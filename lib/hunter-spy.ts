import * as cheerio from 'cheerio';

// Helper to validate generic emails
function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !email.endsWith('.png') && !email.endsWith('.jpg');
}

export async function spyOnCompany(targetUrl: string) {
    if (!targetUrl) return { success: false, error: "No URL provided" };

    try {
        // 1. Timeout Setup (10 seconds max)
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        // 2. Sneaky Headers (Act like a browser)
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5'
        };

        const response = await fetch(targetUrl, {
            signal: controller.signal,
            headers
        });
        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`Failed to access site: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // 3. Information Extraction
        const foundEmails = new Set<string>();
        const foundPhones = new Set<string>();
        const foundKeyPeople = new Set<string>();

        // New: Meta data for AI analysis
        const title = $('title').text().trim();
        const metaDescription = $('meta[name="description"]').attr('content') || '';

        // Extract main text (strip scripts and styles)
        $('script, style, nav, footer').remove();
        const mainText = $('body').text().replace(/\s+/g, ' ').substring(0, 2000).trim();

        // A. Extract Eggs (Emails)
        // From mailto links
        $('a[href^="mailto:"]').each((_, el) => {
            const email = $(el).attr('href')?.replace('mailto:', '').split('?')[0].trim();
            if (email && isValidEmail(email)) foundEmails.add(email.toLowerCase());
        });

        // From text content (Regex)
        const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]{2,}/g;
        const textMatches = $.root().text().match(emailRegex);
        if (textMatches) {
            textMatches.forEach(email => {
                if (isValidEmail(email)) foundEmails.add(email.toLowerCase());
            });
        }

        // B. Extract Phones (Basic Regex for global format)
        // Look for +81, +82, or standard formats
        const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/g;
        // Don't scan entire body for phones, too much noise. Scan Header/Footer/Contact sections.
        const phoneMatches = $.root().text().match(phoneRegex); // Search whole text for phones as it's less noisy than emails
        if (phoneMatches) {
            phoneMatches.forEach(p => {
                if (p.length > 8) foundPhones.add(p.trim());
            });
        }

        // C. Look for "Contact" or "Team" page link for Deep Scan
        let deepLink = '';
        $('a').each((_, el) => {
            const text = $(el).text().toLowerCase();
            const href = $(el).attr('href');
            if (href && (text.includes('contact') || text.includes('about') || text.includes('team'))) {
                if (!deepLink && !href.startsWith('mailto')) deepLink = href;
            }
        });

        return {
            success: true,
            data: {
                title,
                metaDescription,
                summary: mainText,
                emails: Array.from(foundEmails),
                phones: Array.from(foundPhones),
                potentialPeople: Array.from(foundKeyPeople),
                deepLink: deepLink ? new URL(deepLink, targetUrl).toString() : null
            }
        };

    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Connection Failed"
        };
    }
}

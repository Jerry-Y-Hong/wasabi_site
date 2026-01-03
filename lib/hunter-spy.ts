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
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
        };

        let targetFetchUrl = targetUrl;

        // --- NAVER BLOG HANDLER ---
        // Naver blogs use a frameset, we need to bypass it to get the real content
        if (targetUrl.includes('blog.naver.com')) {
            const blogIdMatch = targetUrl.match(/blog\.naver\.com\/([^/]+)\/(\d+)/) || targetUrl.match(/blog\.naver\.com\/([^/]+)\?.*logNo=(\d+)/);
            if (blogIdMatch) {
                const blogId = blogIdMatch[1];
                const logNo = blogIdMatch[2];
                targetFetchUrl = `https://blog.naver.com/PostView.naver?blogId=${blogId}&logNo=${logNo}`;
            }
        }

        const response = await fetch(targetFetchUrl, {
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
        const sns: any = {};

        // A. Extract Emails
        $('a[href^="mailto:"]').each((_, el) => {
            const email = $(el).attr('href')?.replace('mailto:', '').split('?')[0].trim();
            if (email && isValidEmail(email)) foundEmails.add(email.toLowerCase());
        });
        const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]{2,}/g;
        ($.root().text().match(emailRegex) || []).forEach(email => {
            if (isValidEmail(email)) foundEmails.add(email.toLowerCase());
        });

        // B. Extract Phones
        const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/g;
        ($.root().text().match(phoneRegex) || []).forEach(p => {
            if (p.length > 8) foundPhones.add(p.trim());
        });

        // C. Extract SNS Links (Tailored Extraction)
        $('a[href]').each((_, el) => {
            const href = $(el).attr('href') || '';
            if (href.includes('instagram.com/')) sns.instagram = href;
            if (href.includes('facebook.com/')) sns.facebook = href;
            if (href.includes('youtube.com/')) sns.youtube = href;
            if (href.includes('linkedin.com/')) sns.linkedin = href;
        });

        // D. Extract Address (Korean & Global Pattern)
        const addressMatch = $.root().text().match(/[가-힣]+[시도]\s+[가-힣]+[구군]\s+[가-힣\d-]+[길로]\s*\d+/) ||
            $.root().text().match(/\d+\s+[A-Z][a-z]+\s+(St|Ave|Rd|Blvd|Lane),?\s+[A-Z][a-z]+,?\s+[A-Z]{2}\s+\d{5}/);
        const foundAddress = addressMatch ? addressMatch[0] : null;

        // 4. Content Cleanup for AI
        const title = $('title').text().trim() || $('meta[property="og:title"]').attr('content') || '';
        const metaDescription = $('meta[name="description"]').attr('content') ||
            $('meta[property="og:description"]').attr('content') ||
            $('meta[name="twitter:description"]').attr('content') || '';

        $('script, style, nav, footer, iframe, noscript').remove();

        // Target common Korean blog content areas if body text is too generic
        let mainText = $('.se-main-container, .post-view, #postListBody, .contents_area').text() || $('body').text();
        mainText = mainText.replace(/\s+/g, ' ').substring(0, 3000).trim();

        // E. Deep Link identification
        let deepLink = '';
        $('a').each((_, el) => {
            const text = $(el).text().toLowerCase();
            const href = $(el).attr('href');
            if (href && (text.includes('contact') || text.includes('about') || text.includes('team') || text.includes('회사소개') || text.includes('오시는길'))) {
                if (!deepLink && !href.startsWith('mailto') && !href.startsWith('tel')) deepLink = href;
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
                sns,
                address: foundAddress,
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

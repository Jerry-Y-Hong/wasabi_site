'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
// Note: This requires GEMINI_API_KEY in .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
// Flash for speed, Pro for deep research
const flashModel = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
const proModel = genAI.getGenerativeModel({ model: 'gemini-3-pro-preview' });

const ULTIMATE_FALLBACK_MODEL = 'gemini-pro'; // Gemini 1.0 Pro as last resort

interface ProposalRequest {
    partnerName: string;
    partnerType: string;
    relevance: string;
    contactPerson?: string;
    country?: string;
    intelligenceReport?: string;
}

export async function generateProposalEmail(data: ProposalRequest) {
    // --- SMART TEMPLATE MODE (No API Key) ---
    if (!process.env.GEMINI_API_KEY) {
        // Deterministic template based on country
        const country = data.country || 'Global';
        const partner = data.partnerName;
        const relevance = data.relevance || 'Smart Farming';
        const contact = data.contactPerson || 'Manager';

        if (country === 'KR' || country === 'South Korea') {
            return {
                subject: `[제안] ${partner} 귀사와 K-WASABI(케이팜)의 전략적 파트너십 제안`,
                body: `(Smart Template Mode)

${contact} 님 귀하,

안녕하십니까?
대한민국 최고 품질의 스마트팜 와사비를 생산/유통하는 **K-Farm (케이팜) / K-WASABI** 사업부의 홍영희 이사입니다.

귀사의 **"${relevance}"** 관련 활동을 깊이 있게 검토하였으며, 당사의 프리미엄 와사비 솔루션이 귀사의 비즈니스 가치를 한층 더 높여줄 수 있다고 확신하여 본 제안을 드립니다.

**[Why K-Farm?]**
1. **세계 최고 등급의 품질**: 철원/화천 청정 지역의 스마트팜 수직농장에서 생산된 깨끗하고 강력한 맛의 와사비.
2. **사계절 안정 공급**: 기후 영향을 받지 않는 첨단 제어 시설로 365일 균일한 품질과 물량 보장.
3. **독점 품종**: 조직배양 기술로 탄생한 무병묘(Virus-Free) 기반의 압도적인 생산성.

귀사와의 협력을 통해 서로 윈윈(Win-Win)할 수 있는 구체적인 방안을 논의드리고 싶습니다.
첨부된 제안서를 검토해 주시면 감사하겠습니다.

긍정적인 회신 기다리겠습니다.

감사합니다.

홍영희 드림
영업 이사 | K-Farm`
            };
        } else if (country === 'JP' || country === 'Japan') {
            return {
                subject: `【ご提案】${partner}様との戦略的パートナーシップについて (K-WASABI)`,
                body: `(Smart Template Mode)

${partner}
${contact} 様

拝啓

貴社ますますご清栄のこととお慶び申し上げます。
韓国のプレミアム・スマートファームわさび専門企業 **K-Farm (K-WASABI)** の営業責任者、洪(ホン)と申します。

貴社の **"${relevance}"** における素晴らしい実績を拝見し、弊社の高品質なわさびソリューションが貴社の事業発展に貢献できると確信し、ご連絡差し上げました。

**【弊社の強み】**
1. **最高品質**: 独自の垂直農法で栽培された、香り高く辛味の強いプレミアムわさび。
2. **安定供給**: 天候に左右されないスマートファーム技術により、年間を通じて安定した品質と供給をお約束します。
3. **革新的な技術**: 組織培養技術を用いたウイルスフリー苗による高い生産性。

是非一度、具体的な協業の可能性についてお話しさせて頂ければ幸いです。
添付の提案書をご高覧頂けますようお願い申し上げます。

ご検討のほど、何卒よろしくお願い申し上げます。

敬具

洪 泳喜 (Hong Young-hee)
Sales Director | K-Farm`
            };
        } else {
            // Default English
            return {
                subject: `Strategic Partnership Proposal: K-WASABI x ${partner}`,
                body: `(Smart Template Mode)

Dear ${contact},

I hope this email finds you well.

My name is Jerry Y. Hong, Sales Director at **K-Farm (K-WASABI)**, the leading Smart Farm Wasabi producer in Korea.

We have been impressed by **${partner}**'s leadership in **${relevance}**, and I am writing to propose a strategic partnership that combines our premium supply capabilities with your market expertise.

**Why Partner with K-Wasabi?**
* **Premium Quality**: Aeroponically grown real wasabi with superior taste and pungency.
* **Stable Supply**: Our high-tech vertical farms guarantee consistent volume and quality 365 days a year, regardless of climate.
* **Innovation**: We utilize proprietary virus-free tissue culture technology for maximum safety and yield.

We believe a collaboration could generate significant value for both parties. I have attached our brief introduction catalog for your review.

Could we schedule a short call next week to discuss potential synergies?

Best regards,

**Jerry Y. Hong**
Sales Director
K-Farm International`
            };
        }
    }

    try {
        const country = data.country || 'Global';
        let languageInstruction = '';
        let contextInstruction = '';

        // Dynamic Language & Context Logic
        let companyContext = '';
        if (country === 'JP') {
            languageInstruction = '**LANGUAGE: JAPANESE (Business Keigo/Formal)**';
            contextInstruction = '- Tone: Highly polite "Keigo", respectful, emphasizing "trust" and "quality".\n- Cultural Nuance: Start with greetings about the season or weather if appropriate, use standard Japanese business email structure.';
            companyContext = `
            - Location: 韩国 江原道 華川郡 (Wasabi Mecca of Korea).
            - Role: Exclusive Aggregator & Distributor for nationwide Wasabi farms.
            - Products: 全ての部位 (葉, 茎, 根茎, 粉末) を取り扱っています。
            - Capabilities: 自社垂直農場 + 全国ネットワークによる安定供給保証.
            - My Name: 洪 泳喜 (Hong Young-hee)
            - My Title: 営業責任者 (Sales Director)
            `;
        } else if (country === 'KR') {
            languageInstruction = '**LANGUAGE: KOREAN (Business Formal)**';
            contextInstruction = '- Tone: Professional, polite (Has하십시오-che), emphasizing "reliability" and "stable supply".\n- Cultural Nuance: Standard Korean business email format.';
            companyContext = `
            - Location: 강원도 화천군 (한국 와사비의 메카).
            - Role: 전국 와사비 농원 수매 및 유통 전담 (본사 자체 수직농장 보유).
            - Products: 와사비 잎, 줄기, 근경(뿌리), 분말 가공품 일체 취급.
            - USP: 귀하께서 원하시는 어떠한 물량도 공급 가능한 탄탄한 네트워크 구축.
            - My Name: 홍영희 (Jerry Y. Hong)
            - My Title: 영업 이사 (Sales Director)
            `;
        } else if (country === 'TH') {
            languageInstruction = '**LANGUAGE: THAI (Formal Business)**';
            contextInstruction = '- Tone: Highly polite (using Khrub/Kha if appropriate, but generally business formal), respectful.\n- Cultural Nuance: Emphasize "partnership" and "mutual growth", polite business greetings.';
            companyContext = `
            - Location: Hwacheon-gun, Gangwon-do (Mecca of Korean Wasabi).
            - Role: Exclusive National Distributor for high-tech smart farm Wasabi.
            - Products: Leaves, Stems, Rhizomes, and Smart Farm Seedlings.
            - USP: Zero-pesticide, Aeroponic technology, 9-month growth cycle.
            - My Name: Jerry Y. Hong
            - My Title: Sales Director
            `;
        } else if (country === 'VN') {
            languageInstruction = '**LANGUAGE: VIETNAMESE (Formal Business)**';
            contextInstruction = '- Tone: Professional, sincere, using proper honorifics (Ông/Bà/Công ty).\n- Cultural Nuance: Respectful business etiquette, emphasizing quality and advanced Korean technology.';
            companyContext = `
            - Location: Hwacheon-gun, Gangwon-do (Mecca of Korean Wasabi).
            - Role: Leading Korean Smart Farm company specializing in Wasabi.
            - Products: Premium Rhizomes, virus-free Seedlings, and Aeroponic systems.
            - USP: 25x higher productivity than traditional farming, eco-friendly.
            - My Name: Jerry Y. Hong
            - My Title: Sales Director
            `;
        } else {
            // Default to English (US, Global, etc.)
            languageInstruction = '**LANGUAGE: ENGLISH (Professional Business)**';
            contextInstruction = '- Tone: Professional, direct but polite, emphasizing "mutual benefit" and "efficiency".\n- Cultural Nuance: Clear value proposition, concise.';
            companyContext = `
            - Location: Hwacheon-gun, Gangwon-do (The Mecca of Korean Wasabi).
            - Role: Exclusive National Distributor & Aggregator.
            - Products: We handle ALL parts: Leaves, Stems, Rhizomes (Roots), and Powder.
            - USP: We have our own Vertical Farm + a massive network to guarantee supply volume.
            - My Name: Jerry Y. Hong (洪 泳喜)
            - My Title: Sales Director
            `;
        }

        const prompt = `
        Act as a professional B2B Sales Director for "K-Farm International" (Korean Smart Farm Company).
        
        Write a personalized partnership proposal email to a potential partner in ${country}.
        ${languageInstruction}
        IMPORTANT rule: Do NOT use English words unless they are specific proper nouns (like brand names). Translate all concepts into natural business ${country === 'JP' ? 'Japanese' : (country === 'KR' ? 'Korean' : (country === 'TH' ? 'Thai' : (country === 'VN' ? 'Vietnamese' : 'English')))}.
        
        Partner Info:
        - Name: ${data.partnerName}
        - Type: ${data.partnerType}
        - Relevance: ${data.relevance}
        - Contact: ${data.contactPerson || 'Manager'}
        
        Additional Intelligence (Deep Research Results):
        ${data.intelligenceReport || 'None available. Use general relevance.'}
        
        My Company (K-Farm):
        ${companyContext}
        
        Requirements:
        ${contextInstruction}
        - Formatting: Start with Partner Name/Title.
        - Content: Mention their specific relevance (${data.relevance}) and leverage any details from the "Additional Intelligence" to make it highly personalized. Offer our high-quality seedlings/tech used by 90% of Korean farms.
        - IMPORTANT: Do NOT include a signature block (Name, Company, Address) at the end. The system appends it automatically.
        - Output format: JSON with "subject" and "body".
        `;

        const result = await flashModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Simple parsing if JSON is returned within markdown blocks
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return {
            subject: `Partnership Opportunity: K - Farm x ${data.partnerName} `,
            body: text
        };

    } catch (error) {
        console.error('AI Generation Error:', error);
        return {
            subject: `Error generating proposal for ${data.partnerName}`,
            body: "I encountered an error while communicating with the AI. Please try again later."
        };
    }
}

export async function generateBlogContent(topic: string, tone: string, language: string = 'English', keywords: string = '') {
    if (!process.env.GEMINI_API_KEY) {
        // Fallback to mock if no key
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
            title: `[Mock] Future of ${topic}`,
            content: `# Future of ${topic}\n\nThis is a mock post about **${topic}**.\n\n## Key Benefits of K-Farm Technology\n1. **Virus-Free Seedlings**: Our tissue culture technology ensures 99.9% survival.\n2. **Hyper-Cycle Aeroponics**: Harvest in just 9 months instead of 2 years.\n\n*Please set GEMINI_API_KEY to generate real content.*`,
            imagePrompt: "A futuristic smart farm laboratory with glowing green wasabi plants in vertical aeroponic towers, clean white aesthetic, high resolution."
        };
    }

    try {
        // 1. Define Company Context (The "Brain" of the AI)
        const companyContext = `
        You are the Chief Editor for "K-Farm International", a global leader in Wasabi Smart Farming.
        
        Our Core Competologies:
        1. **Virus-Free Seedlings (Tissue Culture)**: We produce genetically superior, pathogen-free wasabi seedlings.
        2. **Hyper-Cycle Aeroponics**: Our proprietary system shortens the cultivation cycle to 9 months (vs. 18-24 months for traditional soil farming).
        3. **Data-Driven Quality**: We control EC, pH, and lighting (PPFD) to maximize Allyl Isothiocyanate (the spicy component).
        
        Your Goal:
        Write a high-quality, engaging blog post that positions K-Farm as the industry authority.
        The content should be informative but subtly promote our specific technologies as the solution.
        `;

        // 2. Construct the Prompt
        const prompt = `
        ${companyContext}

        Task: Write a blog post about: "${topic}"
        
        Configuration:
        - Target Keywords: ${keywords}
        - Tone of Voice: ${tone}
        - Language: ${language}
        
        Structure Requirements:
        1. **Catchy Title**: Write an optimization title (H1).
        2. **Introduction**: Hook the reader, define the problem or trend.
        3. **Body Paragraphs**: Deep dive into the topic. Use subheadings (H2, H3). Use bullet points.
        4. **The K-Farm Edge**: Explain how K-Farm's specific tech (Seedlings or Aeroponics) addresses this topic.
        5. **Conclusion**: Summary and a professional Call to Action (Partnership/Investment).

        Style Requirements:
        - Use standard Markdown.
        - **IMPORTANT**: Use relevant emojis (🌱, 🚀, 💧, 🔬) throughout the text to make it engaging and visually appealing.
        - Use bold text for emphasis.
        
        Output Format:
        Return a valid JSON object with these fields:
        {
            "title": "The exact title of the post",
            "content": "The full blog post in Markdown format",
            "imagePrompt": "A detailed description to generate a cover image for this blog post using an AI image generator"
        }
        `;

        const result = await flashModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 3. Parse JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        // Fallback for non-JSON output
        return {
            title: `Insights on ${topic}`,
            content: text,
            imagePrompt: `A professional representation of ${topic} in a high-tech agricultural setting.`
        };

    } catch (error) {
        console.error('AI Blog Generation Error:', error);
        return {
            title: "Error Generating",
            content: "Failed to generate content. Please try again or check your API Key.",
            imagePrompt: ""
        };
    }
}

export async function generateVideoScript(topic: string, seriesType: string = 'process', specs: string = '') {
    if (!process.env.GEMINI_API_KEY) return { scenes: [], raw: "No API Key" };

    let styleInstruction = "";
    if (seriesType === 'process') {
        styleInstruction = `
        STYLE: "Series 1: The Code of Life" (Professional Documentation)
        - Visuals: Grounded, realistic lab setting. Natural or neutral lighting (avoid heavy blue/neon tints). Focus on the precision of human hands and real laboratory equipment.
        - Audio: Professional, calm, trustworthy narration.
        - Focus: Step-by-step documentation of biotechnology in action.
        - AVOID: Sci-fi robots, glowing blue holograms, or overly futuristic lab equipment.
        `;
    } else if (seriesType === 'facility') {
        styleInstruction = `
        STYLE: "Series 2: The Evolving Farm" (Industrial Scale)
        - Visuals: Realistic drone shots of farms, functional automation (real robot arms or conveyors), macro growth of real plants. Natural green tones.
        - Audio: Dynamic but grounded, rhythmic industrial feel.
        - Focus: Scalability, efficiency, and the power of modern agriculture.
        - AVOID: Cyberpunk aesthetics or unrealistic futuristic cityscapes.
        `;
    } else {
        styleInstruction = `
        STYLE: "Series 3: K-Farm Logic" (Global Business/Vision)
        - Visuals: Professional R&D centers, interviews in real office/lab settings, clean and accurate global data overlays.
        - Audio: Inspiring yet humble and confident.
        - Focus: Philosophy, partnership, and R&D leadership.
        - AVOID: Overly flashy digital effects or "Matrix-style" data streams.
        `;
    }

    const prompt = `
    Act as a Professional Video Director for K-Farm's Smart Farm Documentary Series.
    Create a highly engaging 60-second video script for the topic: "${topic}".
    
    ${styleInstruction}

    Technical Specifics to Include (MUST USE THESE):
    "${specs}"

    Format Requirement:
    - Output a strictly valid JSON array of objects.
    - Fields per object:
      - "scene_number" (integer)
      - "visual_description" (detailed camera instruction, assume Vertical 9:16 format for Shorts)
      - "image_prompt" (A highly detailed, English prompt optimized for AI Video Generators (Veo/Sora). CRITICAL: You MUST explicitly include 'Indoor Smart Farm', 'Vertical Farming Towers', 'LED Grow Lights', 'Clean Lab Environment' in every prompt to avoid outdoor/soil-based generation. ALWAYS append these style keywords: 'Cinematic lighting, 8k, Photorealistic, Unreal Engine 5 render style, Vertical Ratio'.)
      - "voiceover" (the actual script to be spoken. engaging and concise)
      - "on_screen_text" (important data/KPIs to show as overlay)
      - "technical_note" (director's note for sound effects/music mood)
    
    Example JSON Structure:
    [
        { 
          "scene_number": 1, 
          "visual_description": "Close up vertical shot...", 
          "image_prompt": "Cinematic photo of a clean biotech lab, vertical composition, 8k resolution, soft blue lighting...",
          "voiceover": "...", 
          "on_screen_text": "...", 
          "technical_note": "..." 
        }
    ]
    `;

    try {
        const result = await flashModel.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\[[\s\S]*\]/); // Match array
        if (jsonMatch) return { scenes: JSON.parse(jsonMatch[0]) };
        return { scenes: [], raw: text };
    } catch (e) {
        console.error(e);
        return { error: "Failed" };
    }
}

export async function analyzeLeadQuality(companyName: string, websiteSummary: string, metaDescription: string) {
    if (!process.env.GEMINI_API_KEY) return { score: 5, analysis: "AI Analysis Unavailable", angle: "Standard Partnership" };

    const prompt = `
    Act as a Senior Business Development Manager for K-Farm, a leading Korean Smart Farm (Wasabi focus).
    
    Analyze this potential partner based on their website data:
    Company Name: ${companyName}
    Meta Description: ${metaDescription}
    Website Summary: ${websiteSummary}
    
    Task:
    1. Score this lead from 1-10 based on how relevant they are to K-Farm's business (Wasabi seedling sales, Smart Farm tech export, fresh wasabi supply).
    2. Write a 1-sentence analysis of why they are or are not a good fit. (If the website is in Korean, please write the analysis in Korean).
    3. Suggest the "Best Angle" for a sales pitch.
    
    Output Format (Strict JSON):
    {
        "score": number, 
        "analysis": "string",
        "angle": "string"
    }
    `;

    try {
        const result = await flashModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            // Ensure valid score
            parsed.score = parseInt(parsed.score as any);
            if (isNaN(parsed.score)) parsed.score = 5;
            return parsed;
        }
        return { score: 5, analysis: "Analyzing target based on website context. Potential B2B lead.", angle: "Strategic discovery" };
    } catch (e) {
        console.error("AI Qualification Error:", e);
        // Better error message instead of just AI Error
        return { score: 4, analysis: "Limited public data available. Human verification recommended.", angle: "Initial introduction" };
    }
}
export async function translateSearchKeyword(keyword: string, targetCountry: string) {
    if (!process.env.GEMINI_API_KEY || !keyword || targetCountry === 'KR' || targetCountry === 'Global') {
        return keyword;
    }

    const countryMap: Record<string, string> = {
        'JP': 'Japanese',
        'CN': 'Chinese',
        'TH': 'Thai',
        'VN': 'Vietnamese',
        'US': 'English',
        'DE': 'German',
        'FR': 'French',
        'ES': 'Spanish',
        'AR': 'Arabic'
    };

    const targetLang = countryMap[targetCountry] || 'English';

    const prompt = `
    Task: Translate and Optimize a B2B search keyword for the ${targetLang} market.
    Original Keyword (Korean): "${keyword}"
    Target Country: ${targetCountry} (${targetLang})
    
    Requirements:
    1. Translate the keyword into natural, professional B2B search terms used in ${targetLang}.
    2. Add relevant local search operators if helpful (e.g., "wholesale", "company", "contact").
    3. Keep it concise (maximum 5-6 words).
    4. Return ONLY the translated/optimized keyword string. NO explanations.
    `;

    try {
        const result = await flashModel.generateContent(prompt);
        const text = result.response.text().trim().replace(/^"(.*)"$/, '$1'); // Remove potential quotes
        return text || keyword;
    } catch (e) {
        console.error("AI Translation Error:", e);
        return keyword;
    }
}

/**
 * DEEP RESEARCH AGENT (Perplexity-Style Intelligence)
 */
export async function deepResearchPartnerAI(companyName: string, aggregatedData: string) {
    if (!process.env.GEMINI_API_KEY) return { intelligence: "AI Key missing" };

    const prompt = `
    Act as a Executive Strategy Consultant and Business Intelligence Agent. 
    Your goal is to provide a "Perplexity-style" deep dive report that is highly structured, visual, and analytical.

    Target Company: ${companyName}
    
    Raw Intelligence Data:
    ---
    ${aggregatedData}
    ---
    
    ### INSTRUCTIONS:
    1. **Structure and Clarity**: Use clear headings, bullet points, and **tables** to organize information. It must be "일목요연" (clear at a glance).
    2. **Table Usage**:
        - Mandatory: Use a Markdown Table for the **SWOT Analysis** (Strengths, Weaknesses, Opportunities, Threats).
        - Mandatory: Use a Markdown Table for **Key Personnel & Contact Points** (Name, Position, Contact if available).
    3. **Executive Summary**: Start with a 3-sentence powerful summary of who they are.
    4. **Analytical Depth**: Don't just list facts. Analyze "WHY" this company matters to K-Farm (Smart Farm company).
    5. **The Golden Hook**: End with a single, bolded "Sales Hook" - the most compelling opening line for an email.
    
    ### REPORT STRUCTURE (Language: KOREAN):
    1. **기업 핵심 아이덴티티** (Executive Summary & Business Model)
    2. **주요 인사 및 연락처** (Table format)
    3. **SWOT 분석 (K-Farm 협력 관점)** (Table format)
    4. **비즈니스 인사이트 & 파트너십 가치** (Why them? Why now?)
    5. **Golden Hook (제안의 신의 한 수)** (One-liner)

    Return the result as STYLED MARKDOWN. Use professional business Korean.
    `;

    try {
        console.log(`[AI] Dispatching Deep Research for ${companyName} to Gemini 3.0 Pro...`);
        const result = await proModel.generateContent(prompt);
        const text = result.response.text();
        console.log(`[AI] Deep Research successful for ${companyName}`);
        return { intelligence: text };
    } catch (e: any) {
        console.error("Deep Research (Gemini 3.0 Pro) Error:", e.message);

        // STAGE 2 FALLBACK: Try Flash 3.0
        console.log(`[AI] Attempting fallback to Gemini 3.0 Flash for ${companyName}...`);
        try {
            const fallbackResult = await flashModel.generateContent(prompt);
            return { intelligence: "(Note: Gemini 3.0 Flash fallback used)\n\n" + fallbackResult.response.text() };
        } catch (innerErr: any) {
            console.error("Deep Research (Flash 3.0) Error:", innerErr.message);

            // STAGE 3 FALLBACK: Try Ultimate Pro (1.0)
            console.log(`[AI] Attempting ultimate fallback to Gemini Pro (1.0) for ${companyName}...`);
            try {
                // Assuming 'genAI' is available in this scope, e.g., imported at the top of the file
                // import { GoogleGenerativeAI } from "@google/generative-ai";
                // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
                const ultimateFallback = genAI.getGenerativeModel({ model: ULTIMATE_FALLBACK_MODEL });
                const ultimateResult = await ultimateFallback.generateContent(prompt);
                return { intelligence: "(Note: Ultimate fallback used)\n\n" + ultimateResult.response.text() };
            } catch (ultimateErr: any) {
                console.error("Critical AI Failure (All fallbacks failed):", ultimateErr.message);
                return { intelligence: `심층 분석 중 오류가 발생했습니다: ${e.message || '알 수 없는 오류'}. 해당 업체에 대한 온라인 검색 자료가 부족하거나 일시적인 서버 오류일 수 있습니다.` };
            }
        }
    }
}

export async function getDeepResearchKeywords(companyName: string) {
    if (!process.env.GEMINI_API_KEY) return [`${companyName} business info`];

    const prompt = `
    Generate 3 distinct Google Search queries in English to uncover "Deep Intelligence" about the company: "${companyName}".
    Focus on finding: CEO names, address, specific products, and recent business news.
    Return ONLY a JSON array of strings.
    `;

    try {
        const result = await flashModel.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : [`${companyName} CEO address products topics`];
    } catch {
        return [`${companyName} intelligence report`];
    }
}

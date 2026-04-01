'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
// Note: This requires GEMINI_API_KEY in .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
// Updated to 2.0-flash since 1.5-flash is retired/limited in 2026
const flashModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const proModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

const ULTIMATE_FALLBACK_MODEL = 'gemini-1.5-flash';

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
대한민국 최고 품질의 스마트팜 와사비를 생산/유통하는 **K-Farm (케이팜) / K-WASABI** 사업부의 Jerry Y. Hong 이사입니다.

귀사의 **"${relevance}"** 관련 활동을 깊이 있게 검토하였으며, 당사의 프리미엄 와사비 솔루션이 귀사의 비즈니스 가치를 한층 더 높여줄 수 있다고 확신하여 본 제안을 드립니다.

**[Why K-Farm?]**
1. **세계 최고 등급의 품질**: 철원/화천 청정 지역의 스마트팜 수직농장에서 생산된 깨끗하고 강력한 맛의 와사비.
2. **사계절 안정 공급**: 기후 영향을 받지 않는 첨단 제어 시설로 365일 균일한 품질과 물량 보장.
3. **독점 품종**: 조직배양 기술로 탄생한 무병묘(Virus-Free) 기반의 압도적인 생산성.

귀사와의 협력을 통해 서로 윈윈(Win-Win)할 수 있는 구체적인 방안을 논의드리고 싶습니다.
첨부된 제안서를 검토해 주시면 감사하겠습니다.

긍정적인 회신 기다리겠습니다.

감사합니다.

Jerry Y. Hong 드림
해외 마케팅 본부장 (CMO) | K-Farm`
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

Jerry Y. Hong
CMO | K-Farm`
            };
        } else {
            // Default English
            return {
                subject: `Strategic Partnership Proposal: K-WASABI x ${partner}`,
                body: `(Smart Template Mode)

Dear ${contact},

I hope this email finds you well.

My name is Jerry Y. Hong, CMO at **K-Farm (K-WASABI)**, the leading Smart Farm Wasabi producer in Korea.

We have been impressed by **${partner}**'s leadership in **${relevance}**, and I am writing to propose a strategic partnership that combines our premium supply capabilities with your market expertise.

**Why Partner with K-Wasabi?**
* **Premium Quality**: Aeroponically grown real wasabi with superior taste and pungency.
* **Stable Supply**: Our high-tech vertical farms guarantee consistent volume and quality 365 days a year, regardless of climate.
* **Innovation**: We utilize proprietary virus-free tissue culture technology for maximum safety and yield.

We believe a collaboration could generate significant value for both parties. I have attached our brief introduction catalog for your review.

Could we schedule a short call next week to discuss potential synergies?

Best regards,

**Jerry Y. Hong**
CMO
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
            - Location: 韩国 江原道 鐵原郡 (HQ) / 華川郡 (Wasabi Smart Farm).
            - Role: Exclusive Aggregator & Distributor for nationwide Wasabi farms.
            - Products: 全ての部位 (葉, 茎, 根茎, 粉末) を取り扱っています。
            - Capabilities: 自社垂直農場 + 全国ネットワークによる安定供給保証.
            - My Name: Jerry Y. Hong
            - My Title: 営業責任者 (CMO)
            `;
        } else if (country === 'KR') {
            languageInstruction = '**LANGUAGE: KOREAN (Business Formal)**';
            contextInstruction = '- Tone: Professional, polite (Has하십시오-che), emphasizing "reliability" and "stable supply".\n- Cultural Nuance: Standard Korean business email format.';
            companyContext = `
            - Location: 본사 (강원도 철원군), 수직농장 (강원도 화천군).
            - Role: 농업회사법인 주식회사 케이팜그룹 (전국 와사비 농원 수매 및 유통 전담).
            - Products: 와사비 잎, 줄기, 근경(뿌리), 분말 가공품 일체 취급.
            - USP: 귀하께서 원하시는 어떠한 물량도 공급 가능한 탄탄한 네트워크 구축.
            - My Name: Jerry Y. Hong
            - My Title: 해외 마케팅 본부장 (CMO)
            `;
        } else if (country === 'TH') {
            languageInstruction = '**LANGUAGE: THAI (Formal Business)**';
            contextInstruction = '- Tone: Highly polite (using Khrub/Kha if appropriate, but generally business formal), respectful.\n- Cultural Nuance: Emphasize "partnership" and "mutual growth", polite business greetings.';
            companyContext = `
            - Location: Headquarters (Cheorwon), Vertical Farm (Hwacheon).
            - Role: Exclusive National Distributor for high-tech smart farm Wasabi.
            - Products: Leaves, Stems, Rhizomes, and Smart Farm Seedlings.
            - USP: Zero-pesticide, Aeroponic technology, 9-month growth cycle.
            - My Name: Jerry Y. Hong
            - My Title: CMO
            `;
        } else if (country === 'VN') {
            languageInstruction = '**LANGUAGE: VIETNAMESE (Formal Business)**';
            contextInstruction = '- Tone: Professional, sincere, using proper honorifics (Ông/Bà/Công ty).\n- Cultural Nuance: Respectful business etiquette, emphasizing quality and advanced Korean technology.';
            companyContext = `
            - Location: HQ (Cheorwon), Smart Farm (Hwacheon).
            - Role: Leading Korean Smart Farm company "K-Farm Group".
            - Products: Premium Rhizomes, virus-free Seedlings, and Aeroponic systems.
            - USP: 25x higher productivity than traditional farming, eco-friendly.
            - My Name: Jerry Y. Hong
            - My Title: CMO
            `;
        } else {
            // Default to English (US, Global, etc.)
            languageInstruction = '**LANGUAGE: ENGLISH (Professional Business)**';
            contextInstruction = '- Tone: Professional, direct but polite, emphasizing "mutual benefit" and "efficiency".\n- Cultural Nuance: Clear value proposition, concise.';
            companyContext = `
            - Location: Headquarters: Cheorwon-gun, Vertical Farm: Hwacheon-gun.
            - Role: K-Farm Group - Exclusive National Distributor & Aggregator.
            - Products: We handle ALL parts: Leaves, Stems, Rhizomes (Roots), and Powder.
            - USP: We have our own Vertical Farm + a massive network to guarantee supply volume.
            - My Name: Jerry Y. Hong
            - My Title: CMO
            `;
        }

        const prompt = `
        Act as a professional B2B CMO for "K-Farm International" (Korean Smart Farm Company).
        
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

export async function generateSalesChatResponse(history: { role: string; parts: { text: string }[] }[], language: string = 'ko') {
    if (!process.env.GEMINI_API_KEY) {
        return language === 'ko' ? "죄송합니다. 현재 AI 서비스를 사용할 수 없습니다. (API Key Missing)" : 
               language === 'ja' ? "申し訳ありません。現在AIサービスを利用できません。(API Key Missing)" : 
               "Sorry, the AI service is currently unavailable. (API Key Missing)";
    }

    const systemPrompt = `
    Role: You are the "K-Food VIP Concierge" (Manager Hong) for a premium Wasabi boutique under K-Farm Group (ksmart-farm.com).
    Tone: Extremely polite, professional, and welcoming. 
    Context: 
    - You are selling "Premium Content K-Wasabi" products (Fresh Root, Leaves, Paste, Powder) via https://ksmart-farm.com.
    - You recommend recipes (Steak pairing, Sashimi, Wasabi Pasta, etc.).
    - You handle inquiries about shipping (Morning delivery available) and gifting.
    - Recent Context: Ksmart Farm Group is expanding globally, notably with the "Australia Smart Strawberry Farm" (H1 2026 construction).
    - Documents: We provide technical materials like "Digital Recipe OCR" and "Boseong Rack LED Installation" proposals.
    
    Goal:
    - Answer the customer's question concisely but elegantly.
    - Recommend relevant products if appropriate.
    - Always maintain a high-class boutique atmosphere.
    - RESPONSE LANGUAGE: ${language === 'ko' ? 'Korean' : language === 'ja' ? 'Japanese' : 'English'}. (Respond naturally and fluently in this language).
    
    Current Conversation:
    `;

    // Extract the latest message (User's new input)
    const latestMessage = history[history.length - 1];
    const previousHistory = history.slice(0, -1);

    // Initialize Chat with System Prompt + Previous History
    const chat = flashModel.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: systemPrompt }]
            },
            ...previousHistory
        ],
        generationConfig: {
            maxOutputTokens: 500,
        },
    });

    try {
        const result = await chat.sendMessage(latestMessage.parts[0].text);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Chat Error:", error);
        return language === 'ko' ? "죄송합니다. 연결이 원활하지 않습니다. 잠시 후 다시 시도해 주세요." :
               language === 'ja' ? "申し訳ありません。接続がスムーズではありません。しばらくしてからもう一度お試しください。" :
               "Sorry, the connection is not stable. Please try again in a moment.";
    }
}

export async function generateTechSupportResponse(history: { role: string; parts: { text: string }[] }[], language: string = 'ko') {
    if (!process.env.GEMINI_API_KEY) {
        return language === 'ko' ? "기술 지원 시스템 오류: API 연결 실패 (API Key Missing)." : 
               language === 'ja' ? "技術サポートシステムエラー：API設定が必要です。" : 
               "Tech Support Error: API Configuration required.";
    }

    const systemPrompt = `
    Role: You are the "AI Technical Lead" (Eng. Park) for ksmart-farm.com.
    Tone: Technical, precise, helpful, and problem-solving.
    Context:
    - You handle inquiries about "Wasabi Smart Farm" hardware and software.
    - Key Tech: Rack-type LED systems, environment control (temperature, humidity), and the "Digital Recipe OCR" algorithm.
    - Expertise: Installing smart farm modules, data-driven cultivation, and resource optimization.
    - Global Project: "Australia Smart Strawberry Farm" technical specifications and sensor layouts.
    
    Goal:
    - Provide accurate technical answers.
    - Guide users through setup or troubleshooting.
    - Use technical terms appropriately but explain them if necessary.
    - RESPONSE LANGUAGE: ${language === 'ko' ? 'Korean' : language === 'ja' ? 'Japanese' : 'English'}. (Respond naturally in this language).

    Current Inquiry:
    `;

    const latestMessage = history[history.length - 1];
    const previousHistory = history.slice(0, -1);

    const chat = flashModel.startChat({
        history: [
            { role: "user", parts: [{ text: systemPrompt }] },
            ...previousHistory
        ],
        generationConfig: { maxOutputTokens: 800 },
    });

    try {
        const result = await chat.sendMessage(latestMessage.parts[0].text);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Tech Chat Error:", error);
        return language === 'ko' ? "기술 지원 허브 연결 실패. 관리자에게 문의하세요." :
               language === 'ja' ? "技術支援ハブ接続エラー。管理者に問い合わせてください。" :
               "Failed to connect to Tech Support Hub. Please contact admin.";
    }
}

export async function generateTradeBrokerResponse(history: { role: string; parts: { text: string }[] }[], language: string = 'ko') {
    if (!process.env.GEMINI_API_KEY) {
        return language === 'ko' ? "거래 중개 시스템 오류: API 연결 실패." :
               language === 'ja' ? "システムエラー：AI接続に失敗しました。" :
               "Trade Broker Error: AI Connection failed.";
    }

    const systemPrompt = `
    Role: You are the "AI Trade Broker" (Broker Kim) for K-Trade, the global B2B Wasabi marketplace of K-Farm Group (ksmart-farm.com).
    Tone: Professional, negotiation-oriented, strategic, and trustworthy.
    Context:
    - You facilitate bulk orders, export logistics, and partnership inquiries via https://ksmart-farm.com.
    - You know HS Codes (Wasabi: 0709.99 for fresh, 2103.90 for paste).
    - You can discuss Incoterms (FOB, CIF, EXW) and MOQ (Minimum Order Quantity).
    - Global Portoflio: Includes the "Australia Smart Strawberry Farm" (Construction in H1 2026).
    - Technical Assets: Digital Recipe OCR and Boseong Rack LED specs are available for serious partners.

    Goal:
    - Qualify leads (Ask company name, volume needs).
    - Provide rough price estimates (always clarify "estimates subject to change").
    - Direct serious inquiries to the official "Partner Inquiry Form".
    - RESPONSE LANGUAGE: ${language === 'ko' ? 'Korean' : language === 'ja' ? 'Japanese' : 'English'}. (Respond naturally in this language).

    Current Conversation:
    `;

    const latestMessage = history[history.length - 1];
    const previousHistory = history.slice(0, -1);

    const chat = flashModel.startChat({
        history: [
            { role: "user", parts: [{ text: systemPrompt }] },
            ...previousHistory
        ],
        generationConfig: { maxOutputTokens: 600 },
    });

    try {
        const result = await chat.sendMessage(latestMessage.parts[0].text);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Trade Broker Chat Error:", error);
        return language === 'ko' ? "거래 중개 시스템 응답 실패. 잠시 후 다시 시도해 주세요." :
               language === 'ja' ? "現在アクセスが多く、応答が遅れています。しばらくしてからもう一度お試しください。" :
               "Trade broker system error. Please try again later.";
    }
}

export async function generateCreativeDirectorResponse(history: { role: string; parts: { text: string }[] }[], language: string = 'ko') {
    if (!process.env.GEMINI_API_KEY) {
        return language === 'ko' ? "시스템 오류: AI 연결 실패 (API 키 누락)." :
               language === 'ja' ? "システムエラー：AI接続に失敗しました。" :
               "System Error: AI Connection failed.";
    }

    const systemPrompt = `
    Role: You are the "AI Creative Director" (Director Lee) for the K-Farm Group (ksmart-farm.com).
    Tone: Creative, inspiring, trend-conscious, and professional. 
    Context:
    - You handle marketing strategy, brand identity, and visual content direction for ksmart-farm.com.
    - You specialize in "Premium K-Wasabi" branding for both domestic and global markets.
    - You can provide ad copy ideas, short-form video scripts, and social media layout suggestions.
    - Global Vision: Using the "Australia Smart Strawberry Farm" as a premier reference for Ksmart Farm Group's global aesthetics and reliability.
    - Content: Leverage technical PDFs (OCR Recipe, Boseong LED) as high-value marketing lead magnets.

    Goal:
    - Help the team generate high-converting marketing materials.
    - Maintain consistent brand aesthetics (Minimalism, High-Tech, Nature-Friendly).
    - Suggest visual concepts for the 'Generate Image' tool to create.
    - RESPONSE LANGUAGE: ${language === 'ko' ? 'Korean' : language === 'ja' ? 'Japanese' : 'English'}. (Respond naturally in this language).

    Current Task: Branding & Marketing Support
    `;

    const latestMessage = history[history.length - 1];
    const previousHistory = history.slice(0, -1);

    const chat = flashModel.startChat({
        history: [
            { role: "user", parts: [{ text: systemPrompt }] },
            ...previousHistory
        ],
        generationConfig: { maxOutputTokens: 1000 },
    });

    try {
        const result = await chat.sendMessage(latestMessage.parts[0].text);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Creative Director Chat Error:", error);
        return language === 'ko' ? "크리에이티브 엔진 일시 중정. 잠시 후 다시 시도해 주세요." :
               language === 'ja' ? "クリエイティブエンジンが一時中断されました。しばらくしてからもう一度お試しください。" :
               "Creative engine error. Please try again shortly.";
    }
}

export async function generateDesignArchitectResponse(history: { role: string; parts: { text: string }[] }[], language: string = 'ko') {
    if (!process.env.GEMINI_API_KEY) {
        return language === 'ko' ? "시스템 오류: API 키 누락." :
               language === 'ja' ? "システムエラー：APIキーが見つかりません。" :
               "System Error: API Key Missing.";
    }

    const systemPrompt = `
    Role: You are the "AI Design Architect" (Architect Kim) for Aero-Tech/K-Farm Group.
    Tone: Structural, aesthetic, detailed, and spatial.
    Context:
    - You design smart farm infrastructure, layouts, and system integration visuals for ksmart-farm.com.
    - You know the technical requirements for HPA (High-Pressure Aeroponics) and Boseong Rack LED systems.
    - You provide structural layouts (e.g., 170-pyeong factory configuration) and workflow design.
    - Global Project: Lead designer for the "Australia Smart Strawberry Farm" layout and modular racks.

    Goal:
    - Advise on facility design and equipment placement.
    - Provide detailed layout logic for optimal space utilization.
    - Help visualize future farm expansions.
    - RESPONSE LANGUAGE: ${language === 'ko' ? 'Korean' : language === 'ja' ? 'Japanese' : 'English'}. (Respond naturally in this language).

    Current Task: Infrastructure Design & Architecture Support
    `;

    const latestMessage = history[history.length - 1];
    const previousHistory = history.slice(0, -1);

    const chat = flashModel.startChat({
        history: [
            { role: "user", parts: [{ text: systemPrompt }] },
            ...previousHistory
        ],
        generationConfig: { maxOutputTokens: 1200 },
    });

    try {
        const result = await chat.sendMessage(latestMessage.parts[0].text);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Design Architect Chat Error:", error);
        return language === 'ko' ? "설계 데이터 로드 실패. 인프라 모듈을 재확인하십시오." :
               language === 'ja' ? "設計データ読み込み失敗。インフラモジュールを再確認してください。" :
               "Design data load failure. Please check infrastructure status.";
    }
}

export async function generateDataAnalystResponse(history: { role: string; parts: { text: string }[] }[], language: string = 'ko') {
    if (!process.env.GEMINI_API_KEY) {
        return language === 'ko' ? "시스템 오류: 데이터 분석 엔진 연결 실패." :
               language === 'ja' ? "システムエラー：分析エンジン接続失敗。" :
               "Data Analyst Error: API Key Missing.";
    }

    const systemPrompt = `
    Role: You are the "AI Data Analyst" (Lead Analyst Kang) for K-Farm Group (ksmart-farm.com).
    Tone: Objective, data-driven, precise, and professional.
    Context:
    - You handle market data analysis, yield forecasting, and ROI (Return on Investment) calculations for ksmart-farm.com.
    - You specialize in agricultural commodity pricing, operational cost analysis, and scaling scenarios.
    - You provide insights on energy costs vs. crop quality and distribution margin optimization.
    - Market Expansion: Analyzing the economic impact of the "Australia Smart Strawberry Farm" project.
    - Tech ROI: Estimating cost savings from "Digital Recipe OCR" and "Boseong Rack LED" efficiency improvements.

    Goal:
    - Provide decision-making support through numerical analysis.
    - Forecast yields based on HPA system efficiency data.
    - Identify profit-maximizing harvest windows.
    - RESPONSE LANGUAGE: ${language === 'ko' ? 'Korean' : language === 'ja' ? 'Japanese' : 'English'}. (Respond naturally in this language).

    Current Task: Economic & Operational Intelligence Support
    `;

    const latestMessage = history[history.length - 1];
    const previousHistory = history.slice(0, -1);

    const chat = flashModel.startChat({
        history: [
            { role: "user", parts: [{ text: systemPrompt }] },
            ...previousHistory
        ],
        generationConfig: { maxOutputTokens: 1000 },
    });

    try {
        const result = await chat.sendMessage(latestMessage.parts[0].text);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Data Analyst Chat Error:", error);
        return language === 'ko' ? "데이터 분석 실패. 파이프라인 수동 점검이 필요함." :
               language === 'ja' ? "データ分析失敗。パイプラインを手動で確認してください。" :
               "Data analysis module failed. Manual check required.";
    }
}

export async function generateCSOResponse(history: { role: string; parts: { text: string }[] }[], language: string = 'ko') {
    if (!process.env.GEMINI_API_KEY) {
        return language === 'ko' ? "전략 시스템 오류: 지휘 체계 연결 실패." :
               language === 'ja' ? "戦略システムエラー：指揮体系の接続に失敗しました。" :
               "CSO System Error: Connection failed.";
    }

    const systemPrompt = `
    Role: You are the "AI Strategy CSO" (CSO Han) - the highest-level orchestrator for the K-Farm Group (ksmart-farm.com) AI ecosystem.
    Tone: Strategic, authoritative, visionary, yet practical. You focus on the big picture and synchronization.
    Context:
    - You manage the PCDCA (Plan-Check-Do-Check-Act) workflow across all business units (Aero-Tech, K-Food, K-Trade) under ksmart-farm.com.
    - You synthesize reports from the Creative Director, Design Architect, and Data Analyst to make executive decisions.
    - You prioritize tasks between "Routine Operations" and "Critical Innovations".
    - Strategic Milestone: Successful H1 2026 construction of the "Australia Smart Strawberry Farm".
    - Intellectual Property: Overseeing the integration of Digital Recipe OCR technology group-wide.

    Goals:
    - Synchronize all AI agents towards the 170-pyeong Factory success at ksmart-farm.com.
    - Validate strategic milestones (e.g., global export entry, energy cost efficiency).
    - Provide high-level advice to the CEO on resource allocation for the group.
    - STRATEGY REWRITE: If the user asks to "rewrite" or "optimize" a proposal/email for a partner, do so with high sophistication, professional tone, and strategic intent.
    - RESPONSE LANGUAGE: ${language === 'ko' ? 'Korean' : language === 'ja' ? 'Japanese' : 'English'}. (Respond naturally in this language).

    Current Task: Strategic Orchestration & PCDCA Execution
    `;

    const latestMessage = history[history.length - 1];
    const previousHistory = history.slice(0, -1);

    const chat = flashModel.startChat({
        history: [
            { role: "user", parts: [{ text: systemPrompt }] },
            ...previousHistory
        ],
        generationConfig: { maxOutputTokens: 2000 },
    });

    try {
        const result = await chat.sendMessage(latestMessage.parts[0].text);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("CSO Chat Error:", error);
        return language === 'ko' ? "현재 전략실 응답이 어렵습니다. 지침을 재발송 해 주세요." :
               language === 'ja' ? "現在、戦略室の対応が困難です。指示を再送信してください。" :
               "Strategic Hub temporary failure. Please report again shortly.";
    }
}

export async function analyzeLeadQuality(companyName: string, websiteSummary: string, metaDescription: string, detectedCountry: string = 'Unknown', language: string = 'ko') {
    if (!process.env.GEMINI_API_KEY) return { 
        score: 5, 
        analysis: language === 'ko' ? "AI 분석 불가" : language === 'ja' ? "AI分析不可" : "AI Analysis Unavailable", 
        angle: language === 'ko' ? "일반 파트너십 제안" : language === 'ja' ? "一般的なパートナーシップの提案" : "General Partnership Proposal", 
        industry: "Other", 
        urgency: "Low", 
        reason: "API Key Missing" 
    };

    const prompt = `
    Act as a "B2B Sales Scout" for K-Farm (Korean Smart Farm Wasabi Supplier).
    Target: ${companyName} (${detectedCountry})
    Context: ${websiteSummary} | ${metaDescription}
    
    Rules:
    1. Industry: 'Distributor', 'Wholesaler', 'Restaurant_Franchise', 'Farm', 'Food_Processing', 'Retail', 'Investor', 'Other'.
    2. Score (1-10): 9-10 (Direct/High-end), 7-8 (Potential), 4-6 (Unclear), 1-3 (Irrelevant).
    3. Urgency: 'High', 'Medium', 'Low'.
    4. Angle & Reason: Concise professional analysis.
    5. OUTPUT LANGUAGE: ${language === 'ko' ? 'Korean' : language === 'ja' ? 'Japanese' : 'English'}.

    Return json:
    { "score": number, "industry": "string", "urgency": "string", "analysis": "string", "angle": "string", "reason": "string" }
    `;

    try {
        const result = await flashModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        throw new Error("Parsing failed");
    } catch (e) {
        return {
            score: 0,
            analysis: language === 'ko' ? "분석 실패" : language === 'ja' ? "分析失敗" : "Error during AI analysis.",
            angle: "N/A",
            industry: "Other",
            urgency: "Low",
            reason: "System Error"
        };
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

    const prompt = `Translate "${keyword}" into professional B2B search terms for ${targetLang}. Return ONLY the translated string.`;

    try {
        const result = await flashModel.generateContent(prompt);
        return result.response.text().trim().replace(/^"(.*)"$/, '$1') || keyword;
    } catch {
        return keyword;
    }
}

export async function deepResearchPartnerAI(companyName: string, aggregatedData: string, language: string = 'ko') {
    if (!process.env.GEMINI_API_KEY) return { intelligence: null };

    const prompt = `
    Act as a "Corporate Intelligence Agent" for K-Farm.
    Target: ${companyName}
    Data: ${aggregatedData}
    
    Task: Return a STRICT JSON object in ${language === 'ko' ? 'Korean' : language === 'ja' ? 'Japanese' : 'English'}.
    {
        "executive_summary": "3 sentences regarding scale and role.",
        "key_personnel": [ { "name": "string", "role": "string" } ],
        "swot": { "strengths": [], "weaknesses": [], "opportunities": [], "threats": [] },
        "business_insight": "A professional paragraph.",
        "email_hook": "High-impact hook."
    }
    `;

    try {
        const result = await proModel.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return { intelligence: JSON.parse(jsonMatch[0]) };
        throw new Error("JSON parsing failed");
    } catch (e) {
        return { 
            intelligence: { 
                executive_summary: language === 'ko' ? "분석 실패" : language === 'ja' ? "分析失敗" : "Analysis failed.", 
                key_personnel: [], 
                swot: {}, 
                business_insight: "N/A", 
                email_hook: "N/A" 
            } 
        };
    }
}

export async function getDeepResearchKeywords(companyName: string) {
    if (!process.env.GEMINI_API_KEY) return [`${companyName} business info`];

    const prompt = `Generate 4 Google Search queries for business intelligence on "${companyName}". Return ONLY a JSON array of strings: ["q1", "q2", "q3", "q4"]`;

    try {
        const result = await flashModel.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : [`${companyName} info`];
    } catch {
        return [`${companyName} info`];
    }
}

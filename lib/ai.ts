'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
// Note: This requires GEMINI_API_KEY in .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
// Use Flash model for faster response (avoids Vercel timeout)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

interface ProposalRequest {
    partnerName: string;
    partnerType: string;
    relevance: string;
    contactPerson?: string;
    country?: string; // Added Country
}

export async function generateProposalEmail(data: ProposalRequest) {
    if (!process.env.GEMINI_API_KEY) {
        return {
            subject: `[Proposal] Strategic Partnership: K-Farm x ${data.partnerName}`,
            body: `(AI Mode Unavailable - Missing GEMINI_API_KEY)\n\nDear ${data.contactPerson || 'Partner'},\n\nWe are interested in collaborating with ${data.partnerName} based on your work in ${data.relevance}.\n\nPlease check your .env.local file to enable AI generation.`
        };
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
        
        My Company (K-Farm):
        ${companyContext}
        
        Requirements:
        ${contextInstruction}
        - Formatting: Start with Partner Name/Title.
        - Content: Mention their specific relevance (${data.relevance}), offer our high-quality seedlings/tech used by 90% of Korean farms.
        - IMPORTANT: Do NOT include a signature block (Name, Company, Address) at the end. The system appends it automatically.
        - Output format: JSON with "subject" and "body".
        `;

        const result = await model.generateContent(prompt);
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

        const result = await model.generateContent(prompt);
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
        const result = await model.generateContent(prompt);
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
    2. Write a 1-sentence analysis of why they are or are not a good fit.
    3. Suggest the "Best Angle" for a sales pitch.
    
    Output Format (Strict JSON):
    {
        "score": number, 
        "analysis": "string",
        "angle": "string"
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        return { score: 5, analysis: "Analysis failed to parse", angle: "Standard" };
    } catch (e) {
        console.error("AI Qualification Error:", e);
        return { score: 0, analysis: "AI Error", angle: "Unknown" };
    }
}

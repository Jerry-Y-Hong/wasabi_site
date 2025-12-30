'use server';

import fs from 'fs';
import { promises as fsp } from 'fs';
import pathLib from 'path';
import { revalidatePath } from 'next/cache';
import { put, list } from '@vercel/blob';

// Use /tmp only on Vercel deployment
// Use /tmp only on Vercel deployment, otherwise use strict absolute path for local
// Define paths for both read-only build files and writable tmp files
const BUILD_DATA_PATH = pathLib.join(process.cwd(), 'data');
const TMP_DATA_PATH = '/tmp/data';

const IS_VERCEL = process.env.VERCEL === '1';

async function ensureDataDir() {
    if (IS_VERCEL) {
        try {
            await fsp.access(TMP_DATA_PATH);
        } catch {
            await fsp.mkdir(TMP_DATA_PATH, { recursive: true });
        }
    } else {
        // Local
        try {
            await fsp.access(BUILD_DATA_PATH);
        } catch {
            await fsp.mkdir(BUILD_DATA_PATH, { recursive: true });
        }
    }
}

// Fallback Data for Vercel (When FS read fails)
const FALLBACK_POSTS = [
    {
        "title": "K-Farm의 에어로포닉스 기술 혁명: 와사비 스마트 농업의 새로운 지평을 열다",
        "content": "# K-Farm의 에어로포닉스 기술 혁명: 와사비 스마트 농업의 새로운 지평을 열다\n\n전 세계적으로 와사비 수요는 꾸준히 증가하고 있지만, 전통적인 재배 방식은 긴 시간과 까다로운 환경 조건으로 인해 어려움을 겪고 있습니다. 🌱 품질 좋은 와사비를 안정적으로 공급하는 것은 여전히 풀리지 않는 숙제와 같습니다. 하지만 K-Farm은 혁신적인 에어로포닉스 기술을 통해 와사비 스마트 농업의 새로운 시대를 열어가고 있습니다. 이 블로그 포스트에서는 K-Farm의 에어로포닉스 기술이 어떻게 와사비 재배의 한계를 극복하고 있는지 자세히 살펴보겠습니다.\n\n## 와사비 재배의 어려움: 왜 혁신이 필요한가?\n\n와사비는 섬세하고 까다로운 작물로 알려져 있습니다. 전통적인 토양 재배 방식은 다음과 같은 어려움을 안고 있습니다.\n\n*   **긴 재배 기간**: 18~24개월이라는 긴 시간이 소요되어 자본 회전율이 낮습니다.\n*   **환경 의존성**: 깨끗한 물, 서늘한 기온, 적절한 습도 등 까다로운 환경 조건을 필요로 합니다.\n*   **병충해 위험**: 토양을 매개로 한 병충해 발생 위험이 높아 안정적인 수확을 보장하기 어렵습니다.\n*   **낮은 수확량**: 환경 조건의 제약으로 인해 수확량이 제한적입니다.\n\n이러한 문제점을 해결하기 위해 K-Farm은 에어로포닉스 기술을 도입하여 와사비 재배 방식을 혁신했습니다. 🚀\n\n## K-Farm 에어로포닉스 기술: 와사비 재배의 미래\n\n에어로포닉스(Aeroponics)는 흙 없이 공기 중에 뿌리를 노출시켜 양액을 분무하는 방식으로 작물을 재배하는 첨단 농법입니다. K-Farm은 자체 개발한 **하이퍼-사이클 에어로포닉스** 시스템을 통해 와사비 재배의 효율성을 극대화했습니다. \n\n### K-Farm 하이퍼-사이클 에어로포닉스 기술의 핵심\n\n*   **단축된 재배 기간**: 9개월 만에 수확 가능하여 자본 회전율을 획기적으로 높입니다.\n*   **정밀한 환경 제어**: EC, pH, PPFD (광합성 광자속 밀도) 등 생육 환경을 데이터 기반으로 정밀하게 제어하여 최적의 생육 조건을 제공합니다. 💧\n*   **병충해 예방**: 폐쇄형 시스템으로 외부 오염원을 차단하여 병충해 발생 위험을 최소화합니다.\n*   **수확량 증대**: 최적화된 환경 조건과 영양 공급을 통해 수확량을 극대화합니다.\n*   **균일한 품질**: 환경 제어와 **바이러스-프리 씨앗 (조직 배양)**을 통해 균일한 품질의 와사비를 생산합니다.\n\n### 데이터 기반 품질 관리: Allyl Isothiocyanate 극대화\n\n와사비의 매운맛을 내는 핵심 성분인 Allyl Isothiocyanate (AITC) 함량을 극대화하는 것은 매우 중요합니다. K-Farm은 데이터 기반 환경 제어를 통해 AITC 함량을 정밀하게 조절합니다. 🔬\n\n*   EC (전기 전도도) 최적화: 최적의 양분 흡수를 유도하여 와사비 생육을 촉진하고 AITC 생성을 활성화합니다.\n*   pH (수소 이온 농도) 조절: 뿌리 활착 및 영양분 흡수에 최적화된 pH 환경을 유지합니다.\n*   PPFD (광합성 광자속 밀도) 제어: 광합성 효율을 높여 와사비 생육을 촉진하고 AITC 합성을 증진합니다.\n\n## K-Farm의 차별점: 바이러스-프리 씨앗과 하이퍼-사이클 에어로포닉스\n\nK-Farm은 **바이러스-프리 씨앗 (조직 배양)**을 자체 생산하여 와사비 재배의 안정성을 높입니다. 또한, 독자적인 **하이퍼-사이클 에어로포닉스** 시스템을 통해 재배 기간을 단축하고 품질을 향상시켰습니다. 이는 K-Farm만이 제공할 수 있는 경쟁력입니다.\n\n## 결론: 와사비 스마트 농업의 미래를 함께 만들어갈 파트너를 찾습니다.\n\nK-Farm은 혁신적인 에어로포닉스 기술을 통해 와사비 스마트 농업의 새로운 기준을 제시하고 있습니다. 앞으로도 지속적인 연구 개발을 통해 와사비 재배 기술을 발전시켜 나갈 것입니다. K-Farm과 함께 와사비 스마트 농업의 미래를 만들어갈 파트너를 찾습니다. 투자 및 협력 문의는 언제든지 환영합니다. 🌱🚀💧🔬\n",
        "topic": "K-Farm의 에어로포닉스 기술 혁명\")",
        "keywords": "smart farm, aeroponics, wasabi, investment",
        "tags": ["smart farm", "aeroponics", "wasabi"],
        "author": "AI Writer",
        "image": "https://image.pollinations.ai/prompt/A%20futuristic%20wasabi%20farm%20using%20aeroponics%20technology.%20Wasabi%20plants%20are%20suspended%20in%20the%20air%20with%20roots%20exposed%20and%20being%20misted%20with%20nutrient%20solution.%20The%20background%20features%20a%20clean%2C%20modern%20indoor%20farm%20setting%20with%20LED%20grow%20lights.%20Data%20dashboards%20showing%20EC%2C%20pH%2C%20and%20PPFD%20readings%20are%20visible.%20The%20overall%20tone%20should%20be%20high-tech%20and%20innovative.?width=1024&height=600&seed=116779&model=flux&nologo=true",
        "id": 1766927075509,
        "slug": "k-farm-aeroponics",
        "timestamp": "2025-12-28T13:04:35.509Z",
        "category": "Company Blog"
    },
    {
        "title": "와사비 수직농업: 스마트팜 혁신을 통한 무한한 가능성 🌱🚀",
        "content": "# 와사비 수직농업: 스마트팜 혁신을 통한 무한한 가능성 🌱🚀\n\n전 세계적으로 건강에 대한 관심이 높아지면서 와사비에 대한 수요가 급증하고 있습니다. 그러나 전통적인 와사비 재배 방식은 긴 재배 기간, 높은 노동력, 그리고 예측 불가능한 환경 변수 때문에 많은 어려움을 겪고 있습니다. 토양 오염과 기후 변화는 이러한 어려움을 더욱 가중시키고 있습니다. 이제 와사비 농업은 **혁신적인 변화**가 필요한 시점입니다. 해결책은 바로 **수직농업**입니다. \n\n## 수직농업, 와사비 재배의 새로운 지평을 열다 💧\n\n수직농업은 공간 효율성을 극대화하고 환경 제어 기술을 통해 작물 생산성을 획기적으로 향상시키는 혁신적인 농업 방식입니다. 특히 와사비와 같이 까다로운 작물 재배에 있어 수직농업은 다음과 같은 다양한 이점을 제공합니다.\n\n*   **수확량 증대:** 층층이 쌓아 올린 재배 시스템은 단위 면적당 생산량을 극대화합니다.\n*   **환경 제어:** 온도, 습도, 빛, 영양분 등 재배 환경을 정밀하게 제어하여 최적의 생육 조건을 제공합니다.\n*   **병충해 감소:** 밀폐된 환경은 외부 오염 요소를 차단하여 병충해 발생 위험을 줄입니다.\n*   **물 절약:** 폐쇄형 순환 시스템은 물 사용량을 획기적으로 줄이고 환경 부담을 최소화합니다.\n*   **일정하고 높은 품질:** 데이터 기반의 정밀한 관리를 통해 와사비의 품질을 균일하게 유지하고 향상시킵니다.\n\n### 수직농업의 핵심 기술: 스마트팜과 에어로포닉스\n\n와사비 수직농업의 성공은 **스마트팜** 기술과 **에어로포닉스(Aeroponics, 공중재배)** 기술의 융합에 달려있습니다. 스마트팜은 센서, 데이터 분석, 자동 제어 시스템 등을 활용하여 작물 생육 환경을 실시간으로 모니터링하고 관리합니다. 에어로포닉스는 뿌리에 직접 영양액을 분무하는 방식으로, 토양 없이 작물을 재배하는 혁신적인 기술입니다. 이러한 기술들은 와사비의 생육에 필요한 모든 요소를 최적화하여 생산성과 품질을 극대화합니다.\n\n## K-Farm: 와사비 스마트 농업의 선두주자 🚀\n\nK-Farm은 와사비 수직농업의 선두 주자로서, 혁신적인 기술과 노하우를 통해 와사비 산업의 미래를 만들어가고 있습니다.\n\n*   **바이러스 프리 종묘 (조직 배양) 🔬:** K-Farm은 유전적으로 우수하고 병원균이 없는 와사비 종묘를 생산합니다. 이는 건강하고 빠르게 성장하는 와사비 재배의 핵심입니다.\n\n*   **하이퍼 사이클 에어로포닉스:** K-Farm의 독자적인 에어로포닉스 시스템은 와사비 재배 기간을 9개월로 단축합니다. (전통적인 토양 재배 방식은 18-24개월 소요) 이로 인해 생산 효율성을 획기적으로 높일 수 있습니다.\n\n*   **데이터 기반 품질 관리:** K-Farm은 EC, pH, 조명 (PPFD) 등을 정밀하게 제어하여 와사비의 매운맛을 결정하는 핵심 성분인 Allyl Isothiocyanate (알릴 이소티오시아네이트) 함량을 극대화합니다.\n\n## 결론: 와사비 스마트 농업의 미래, K-Farm과 함께 🌱\n\n와사비 수직농업은 지속 가능한 농업의 미래를 제시합니다. K-Farm은 혁신적인 기술과 데이터 기반의 정밀한 관리를 통해 와사비 산업의 새로운 가능성을 열어가고 있습니다. 와사비 스마트 농업에 대한 투자 및 협력 문의를 환영합니다. K-Farm과 함께 와사비 산업의 밝은 미래를 만들어 갑시다! **지금 바로 문의하세요!**\n",
        "topic": "수직농업에서의 와사비 이점",
        "keywords": "smart farm, aeroponics, innovation",
        "tags": ["smart farm", "aeroponics", "innovation"],
        "author": "AI Writer",
        "image": "/images/blog/stock_leaf.png",
        "id": 1766919908100,
        "slug": "wasabi-smart-farm-intro",
        "timestamp": "2025-12-28T11:05:08.100Z",
        "category": "Company Blog"
    }
];

const FALLBACK_POSTS_EN = [
    {
        "title": "K-Farm's Aeroponics Revolution: New Horizon for Wasabi Smart Farming",
        "content": "# K-Farm's Aeroponics Revolution: New Horizon for Wasabi Smart Farming\n\nGlobal demand for Wasabi is rising, but traditional cultivation faces challenges due to climate change and environmental conditions. 🌱 K-Farm is opening a new era of Wasabi Smart Farming through innovative Aeroponics technology.\n\n## Why We Need Innovation\n\n*   **Long Cultivation Period**: Traditional methods take 18-24 months.\n*   **Environmental Dependency**: Requires specific temperature and water conditions.\n*   **Pest Risks**: Soil-based farming is vulnerable to pests.\n\n## K-Farm Aeroponics Technology\n\nK-Farm uses **Hyper-Cycle Aeroponics** to maximize efficiency.\n\n### Key Features\n\n*   **Shortened Cycle**: Harvest in just 9 months.\n*   **Precision Control**: Data-driven control of EC, pH, and PPFD. 💧\n*   **Disease Free**: Closed system prevents external contamination.\n*   **Maximized Yield**: Optimized environment for highest output.\n\n## Conclusion\n\nK-Farm is setting a new standard. Join us in shaping the future of agriculture. 🌱🚀",
        "topic": "Aeroponics Revolution",
        "keywords": "smart farm, aeroponics, wasabi, investment",
        "tags": ["smart farm", "aeroponics", "wasabi"],
        "author": "AI Writer",
        "image": "https://image.pollinations.ai/prompt/A%20futuristic%20wasabi%20farm%20using%20aeroponics%20technology.?width=1024&height=600&seed=116779&model=flux&nologo=true",
        "id": 1766927075509,
        "slug": "k-farm-aeroponics-en",
        "timestamp": "2025-12-28T13:04:35.509Z",
        "category": "Company Blog"
    },
    {
        "title": "Wasabi Vertical Farming: Limitless Possibilities 🌱🚀",
        "content": "# Wasabi Vertical Farming: Limitless Possibilities 🌱🚀\n\nVertical farming maximizes space efficiency and productivity. For Wasabi, it offers:\n\n*   **Higher Yields**: Stacked growing systems.\n*   **Environment Control**: Perfect conditions year-round.\n*   **Water Saving**: Closed-loop circulation.\n\n### K-Farm's Leadership\n\n*   **Virus-Free Seedlings**: Tissue culture technology.\n*   **Hyper-Cycle Aeroponics**: 9-month harvest cycle.\n*   **Quality Control**: Precision management of AITC content.\n\nJoin K-Farm in the future of Wasabi farming! **Contact us now!**",
        "topic": "Vertical Farming Benefits",
        "keywords": "smart farm, aeroponics, innovation",
        "tags": ["smart farm", "aeroponics", "innovation"],
        "author": "AI Writer",
        "image": "/images/blog/stock_leaf.png",
        "id": 1766919908100,
        "slug": "wasabi-smart-farm-intro-en",
        "timestamp": "2025-12-28T11:05:08.100Z",
        "category": "Company Blog"
    },
    {
        "title": "Strategy for Global Expansion: K-Farm's Vision 🌍",
        "content": "# Strategy for Global Expansion: K-Farm's Vision 🌍\n\nK-Farm is not just a domestic success. We are rapidly expanding our footprint worldwide.\n\n## Global Partnerships\n\nWe are collaborating with top agricultural universities and research institutes in the US, Netherlands, and Japan to continuously improve our technology.\n\n*   **Joint Research**: Developing next-gen nutrient solutions.\n*   **Tech Transfer**: Licensing our Aeroponics systems to global partners.\n\n## Future Goals\n\nOur goal is to become the **World's No.1 Wasabi Smart Farm Platform**. We invite investors and partners to join this green revolution.",
        "topic": "Global Vision",
        "keywords": "global expansion, partnership, vision",
        "tags": ["global", "partnership", "future"],
        "author": "Jerry Hong",
        "image": "https://image.pollinations.ai/prompt/Global%20network%20map%20connecting%20smart%20farms%20worldwide?width=1024&height=600&nologo=true",
        "id": 1766910000000,
        "slug": "k-farm-global-vision-en",
        "timestamp": "2025-12-28T09:00:00.000Z",
        "category": "Company Blog"
    }
];

const FALLBACK_POSTS_JA = [
    {
        "title": "K-Farmのエアロポニックス革命：わさびスマート農業の新たな地平",
        "content": "# K-Farmのエアロポニックス革命：わさびスマート農業の新たな地平\n\n世界的にわさびの需要が高まっていますが、伝統的な栽培方法は気候変動や環境条件により困難に直面しています。🌱 K-Farmは革新的なエアロポニックス技術を通じて、わさびスマート農業の新しい時代を切り開いています。\n\n## なぜ革新が必要なのか\n\n*   **長い栽培期間**: 伝統的な方法は18〜24ヶ月かかります。\n*   **環境への依存**: 特定の温度と水質条件が必要です。\n*   **病害虫リスク**: 土壌栽培は病害虫に対して脆弱です。\n\n## K-Farmのエアロポニックス技術\n\nK-Farmは**ハイパーサイクル・エアロポニックス**を使用して効率を最大化します。\n\n### 主な特徴\n\n*   **サイクルの短縮**: わずか9ヶ月で収穫可能。\n*   **精密制御**: EC、pH、PPFDのデータ駆動型制御。💧\n*   **無病**: 閉鎖型システムにより外部汚染を防止。\n*   **最大収量**: 最適化された環境で最高の生産量を実現。\n\n## 結論\n\nK-Farmは新たな基準を打ち立てています。農業の未来を共に築きましょう。🌱🚀",
        "topic": "エアロポニックス革命",
        "keywords": "smart farm, aeroponics, wasabi, investment",
        "tags": ["smart farm", "aeroponics", "wasabi"],
        "author": "AI Writer",
        "image": "https://image.pollinations.ai/prompt/A%20futuristic%20wasabi%20farm%20using%20aeroponics%20technology.?width=1024&height=600&seed=116779&model=flux&nologo=true",
        "id": 1766927075509,
        "slug": "k-farm-aeroponics-ja",
        "timestamp": "2025-12-28T13:04:35.509Z",
        "category": "Company Blog"
    },
    {
        "title": "わさび垂直農業：スマートファーム革新による無限の可能性 🌱🚀",
        "content": "# わさび垂直農業：スマートファーム革新による無限の可能性 🌱🚀\n\n垂直農業は空間効率と生産性を最大化します。わさびにとって、それは以下を提供します：\n\n*   **高収量**: 積層栽培システム。\n*   **環境制御**: 年中完璧な条件。\n*   **節水**: 閉ループ循環。\n\n### K-Farmのリーダーシップ\n\n*   **ウイルスフリー苗**: 組織培養技術。\n*   **ハイパーサイクル・エアロポニックス**: 9ヶ月の収穫サイクル。\n*   **品質管理**: AITC含有量の精密管理。\n\nK-Farmと共にわさび農業の未来へ！ **今すぐお問い合わせください！**",
        "topic": "垂直農業の利点",
        "keywords": "smart farm, aeroponics, innovation",
        "tags": ["smart farm", "aeroponics", "innovation"],
        "author": "AI Writer",
        "image": "/images/blog/stock_leaf.png",
        "id": 1766919908100,
        "slug": "wasabi-smart-farm-intro-ja",
        "timestamp": "2025-12-28T11:05:08.100Z",
        "category": "Company Blog"
    },
    {
        "title": "グローバル展開戦略：K-Farmのビジョン 🌍",
        "content": "# グローバル展開戦略：K-Farmのビジョン 🌍\n\nK-Farmは国内だけの成功にとどまりません。私たちは急速に世界中へと足跡を広げています。\n\n## グローバルパートナーシップ\n\n米国、オランダ、日本のトップ農業大学や研究機関と協力し、技術を継続的に改善しています。\n\n*   **共同研究**: 次世代の養液開発。\n*   **技術移転**: 当社のエアロポニックスシステムをグローバルパートナーにライセンス供与。\n\n## 将来の目標\n\n私たちの目標は、**世界No.1のわさびスマートファームプラットフォーム**になることです。投資家やパートナーの皆様を、このグリーン革命にご招待します。",
        "topic": "グローバルビジョン",
        "keywords": "global expansion, partnership, vision",
        "tags": ["global", "partnership", "future"],
        "author": "Jerry Hong",
        "image": "https://image.pollinations.ai/prompt/Global%20network%20map%20connecting%20smart%20farms%20worldwide?width=1024&height=600&nologo=true",
        "id": 1766910000000,
        "slug": "k-farm-global-vision-ja",
        "timestamp": "2025-12-28T09:00:00.000Z",
        "category": "Company Blog"
    }
];

const FALLBACK_POSTS_ZH = [
    {
        "title": "K-Farm的气培法革命：山葵智慧农业的新视野",
        "content": "# K-Farm的气培法革命：山葵智慧农业的新视野\n\n全球对山葵的需求正在上升，但由于气候变化和环境条件，传统种植面临挑战。🌱 K-Farm通过创新的气培法技术，开启了山葵智慧农业的新纪元。\n\n## 为什么我们需要创新\n\n*   **通过长的种植周期**：传统方法需要18-24个月。\n*   **环境依赖**：需要特定的温度和水质条件。\n*   **病虫害风险**：土壤种植容易受到病虫害的影响。\n\n## K-Farm气培法技术\n\nK-Farm使用**超循环气培法**来最大化效率。\n\n### 主要特点\n\n*   **周期缩短**：仅需9个月即可收获。\n*   **精准控制**：基于数据的EC、pH和PPFD控制。💧\n*   **无病害**：封闭系统防止外部污染。\n*   **最大产量**：优化环境以获得最高产量。\n\n## 结论\n\nK-Farm正在树立新标准。加入我们，共同塑造农业的未来。🌱🚀",
        "topic": "气培法革命",
        "keywords": "smart farm, aeroponics, wasabi, investment",
        "tags": ["smart farm", "aeroponics", "wasabi"],
        "author": "AI Writer",
        "image": "https://image.pollinations.ai/prompt/A%20futuristic%20wasabi%20farm%20using%20aeroponics%20technology.?width=1024&height=600&seed=116779&model=flux&nologo=true",
        "id": 1766927075509,
        "slug": "k-farm-aeroponics-zh",
        "timestamp": "2025-12-28T13:04:35.509Z",
        "category": "Company Blog"
    },
    {
        "title": "山葵垂直农业：通过智慧农场创新带来的无限可能 🌱🚀",
        "content": "# 山葵垂直农业：通过智慧农场创新带来的无限可能 🌱🚀\n\n垂直农业最大化了空间效率和生产力。对于山葵，它提供：\n\n*   **更高产量**：层叠种植系统。\n*   **环境控制**：全年完美条件。\n*   **节水**：闭环循环。\n\n### K-Farm的领导力\n\n*   **无病毒种苗**：组织培养技术。\n*   **超循环气培法**：9个月的收获周期。\n*   **质量控制**：AITC含量的精准管理。\n\n加入K-Farm，共创山葵农业的未来！ **立即联系我们！**",
        "topic": "垂直农业的优势",
        "keywords": "smart farm, aeroponics, innovation",
        "tags": ["smart farm", "aeroponics", "innovation"],
        "author": "AI Writer",
        "image": "/images/blog/stock_leaf.png",
        "id": 1766919908100,
        "slug": "wasabi-smart-farm-intro-zh",
        "timestamp": "2025-12-28T11:05:08.100Z",
        "category": "Company Blog"
    },
    {
        "title": "全球扩张战略：K-Farm的愿景 🌍",
        "content": "# 全球扩张战略：K-Farm的愿景 🌍\n\nK-Farm不仅仅是国内的成功案例。我们正在迅速将足迹扩展到世界各地。\n\n## 全球合作伙伴关系\n\n我们正在与美国、荷兰和日本的顶级农业大学及研究机构合作，以不断通过改进我们的技术。\n\n*   **联合研究**：开发下一代营养液。\n*   **技术转让**：将我们的气培法系统授权给全球合作伙伴。\n\n## 未来目标\n\n我们的目标是成为**世界第一的山葵智慧农场平台**。我们邀请投资者和合作伙伴加入这场绿色革命。",
        "topic": "全球愿景",
        "keywords": "global expansion, partnership, vision",
        "tags": ["global", "partnership", "future"],
        "author": "Jerry Hong",
        "image": "https://image.pollinations.ai/prompt/Global%20network%20map%20connecting%20smart%20farms%20worldwide?width=1024&height=600&nologo=true",
        "id": 1766910000000,
        "slug": "k-farm-global-vision-zh",
        "timestamp": "2025-12-28T09:00:00.000Z",
        "category": "Company Blog"
    }
];

const FALLBACK_POSTS_AR = [
    {
        "title": "ثورة الزراعة الهوائية في K-Farm: أفق جديد لزراعة الوسابي الذكية",
        "content": "# ثورة الزراعة الهوائية في K-Farm: أفق جديد لزراعة الوسابي الذكية\n\nيتزايد الطلب العالمي على الوسابي، لكن الزراعة التقليدية تواجه تحديات بسبب تغير المناخ والظروف البيئية. 🌱 تفتتح K-Farm حقبة جديدة لزراعة الوسابي الذكية من خلال تقنية الزراعة الهوائية المبتكرة.\n\n## لماذا نحتاج إلى الابتكار\n\n*   **فترة زراعة طويلة**: تستغرق الطرق التقليدية 18-24 شهرًا.\n*   **التبعية البيئية**: تتطلب درجات حرارة وظروف مائية محددة.\n*   **مخاطر الآفات**: الزراعة القائمة على التربة عرضة للآفات.\n\n## تقنية K-Farm للزراعة الهوائية\n\nتستخدم K-Farm **الزراعة الهوائية فائقة الدورة (Hyper-Cycle Aeroponics)** لزيادة الكفاءة إلى أقصى حد.\n\n### الميزات الرئيسية\n\n*   **دورة أقصر**: الحصاد في 9 أشهر فقط.\n*   **تحكم دقيق**: تحكم قائم على البيانات في الموصلية الكهربائية (EC)، ودرجة الحموضة (pH)، وكثافة تدفق الفوتون للتمثيل الضوئي (PPFD). 💧\n*   **خالية من الأمراض**: يمنع النظام المغلق التلوث الخارجي.\n*   **أقصى عائد**: بيئة محسنة لأعلى إنتاج.\n\n## الخاتمة\n\nتضع K-Farm معيارًا جديدًا. انضم إلينا في تشكيل مستقبل الزراعة. 🌱🚀",
        "topic": "ثورة الزراعة الهوائية",
        "keywords": "smart farm, aeroponics, wasabi, investment",
        "tags": ["smart farm", "aeroponics", "wasabi"],
        "author": "AI Writer",
        "image": "https://image.pollinations.ai/prompt/A%20futuristic%20wasabi%20farm%20using%20aeroponics%20technology.?width=1024&height=600&seed=116779&model=flux&nologo=true",
        "id": 1766927075509,
        "slug": "k-farm-aeroponics-ar",
        "timestamp": "2025-12-28T13:04:35.509Z",
        "category": "Company Blog"
    },
    {
        "title": "الزراعة العمودية للوسابي: إمكانيات لا حصر لها 🌱🚀",
        "content": "# الزراعة العمودية للوسابي: إمكانيات لا حصر لها 🌱🚀\n\nتعمل الزراعة العمودية على زيادة كفاءة المساحة والإنتاجية إلى أقصى حد. بالنسبة للوسابي، فهي تقدم:\n\n*   **عائدات أعلى**: أنظمة زراعة مكدسة.\n*   **التحكم في البيئة**: ظروف مثالية على مدار السنة.\n*   **توفير المياه**: دورة مغلقة.\n\n### ريادة K-Farm\n\n*   **شتلات خالية من الفيروسات**: تقنية زراعة الأنسجة.\n*   **الزراعة الهوائية فائقة الدورة**: دورة حصاد مدتها 9 أشهر.\n*   **مراقبة الجودة**: إدارة دقيقة لمحتوى AITC.\n\nانضم إلى K-Farm في مستقبل زراعة الوسابي! **تواصل معنا الآن!**",
        "topic": "فوائد الزراعة العمودية",
        "keywords": "smart farm, aeroponics, innovation",
        "tags": ["smart farm", "aeroponics", "innovation"],
        "author": "AI Writer",
        "image": "/images/blog/stock_leaf.png",
        "id": 1766919908100,
        "slug": "wasabi-smart-farm-intro-ar",
        "timestamp": "2025-12-28T11:05:08.100Z",
        "category": "Company Blog"
    },
    {
        "title": "استراتيجية التوسع العالمي: رؤية K-Farm 🌍",
        "content": "# استراتيجية التوسع العالمي: رؤية K-Farm 🌍\n\nK-Farm ليست مجرد نجاح محلي. نحن نوسع بصمتنا بسرعة في جميع أنحاء العالم.\n\n## الشراكات العالمية\n\nنتعاون مع أفضل الجامعات الزراعية ومعاهد البحوث في الولايات المتحدة وهولندا واليابان لتحسين تقنيتنا باستمرار.\n\n*   **بحث مشترك**: تطوير محاليل مغذية من الجيل التالي.\n*   **نقل التكنولوجيا**: ترخيص أنظمة الزراعة الهوائية لشركائنا العالميين.\n\n## الأهداف المستقبلية\n\nهدفنا هو أن نصبح **المنصة رقم 1 عالميًا لمزارع الوسابي الذكية**. ندعو المستثمرين والشركاء للانضمام إلى هذه الثورة الخضراء.",
        "topic": "الرؤية العالمية",
        "keywords": "global expansion, partnership, vision",
        "tags": ["global", "partnership", "future"],
        "author": "Jerry Hong",
        "image": "https://image.pollinations.ai/prompt/Global%20network%20map%20connecting%20smart%20farms%20worldwide?width=1024&height=600&nologo=true",
        "id": 1766910000000,
        "slug": "k-farm-global-vision-ar",
        "timestamp": "2025-12-28T09:00:00.000Z",
        "category": "Company Blog"
    }
];

const FALLBACK_POSTS_FR = [
    {
        "title": "La Révolution Aéroponique de K-Farm : Nouvel Horizon pour l'Agriculture Intelligente du Wasabi",
        "content": "# La Révolution Aéroponique de K-Farm : Nouvel Horizon pour l'Agriculture Intelligente du Wasabi\n\nLa demande mondiale de Wasabi augmente, mais la culture traditionnelle est confrontée à des défis dus au changement climatique et aux conditions environnementales. 🌱 K-Farm ouvre une nouvelle ère de l'agriculture intelligente du Wasabi grâce à une technologie aéroponique innovante.\n\n## Pourquoi nous avons besoin d'innovation\n\n*   **Longue période de culture** : Les méthodes traditionnelles prennent 18 à 24 mois.\n*   **Dépendance environnementale** : Nécessite des conditions de température et d'eau spécifiques.\n*   **Risques de pests** : L'agriculture basée sur le sol est vulnérable aux parasites.\n\n## Technologie Aéroponique K-Farm\n\nK-Farm utilise l'**aéroponie à cycle hyper** pour maximiser l'efficacité.\n\n### Caractéristiques Principales\n\n*   **Cycle Raccourci** : Récolte en seulement 9 mois.\n*   **Contrôle de Précision** : Contrôle basé sur les données de l'EC, du pH et du PPFD. 💧\n*   **Sans Maladie** : Le système fermé empêche la contamination externe.\n*   **Rendement Maximisé** : Environnement optimisé pour le rendement le plus élevé.\n\n## Conclusion\n\nK-Farm établit une nouvelle norme. Rejoignez-nous pour façonner l'avenir de l'agriculture. 🌱🚀",
        "topic": "Révolution Aéroponique",
        "keywords": "smart farm, aeroponics, wasabi, investment",
        "tags": ["smart farm", "aeroponics", "wasabi"],
        "author": "AI Writer",
        "image": "https://image.pollinations.ai/prompt/A%20futuristic%20wasabi%20farm%20using%20aeroponics%20technology.?width=1024&height=600&seed=116779&model=flux&nologo=true",
        "id": 1766927075509,
        "slug": "k-farm-aeroponics-fr",
        "timestamp": "2025-12-28T13:04:35.509Z",
        "category": "Company Blog"
    },
    {
        "title": "Agriculture Verticale de Wasabi : Possibilités Illimitées 🌱🚀",
        "content": "# Agriculture Verticale de Wasabi : Possibilités Illimitées 🌱🚀\n\nL'agriculture verticale maximise l'efficacité de l'espace et la productivité. Pour le Wasabi, elle offre :\n\n*   **Rendements Plus Élevés** : Systèmes de culture empilés.\n*   **Contrôle de l'Environnement** : Conditions parfaites toute l'année.\n*   **Économie d'Eau** : Circulation en boucle fermée.\n\n### Leadership de K-Farm\n\n*   **Plants Sans Virus** : Technologie de culture tissulaire.\n*   **Aéroponie à Cycle Hyper** : Cycle de récolte de 9 mois.\n*   **Contrôle de la Qualité** : Gestion précise de la teneur en AITC.\n\nRejoignez K-Farm dans l'avenir de la culture du Wasabi ! **Contactez-nous maintenant !**",
        "topic": "Avantages de l'Agriculture Verticale",
        "keywords": "smart farm, aeroponics, innovation",
        "tags": ["smart farm", "aeroponics", "innovation"],
        "author": "AI Writer",
        "image": "/images/blog/stock_leaf.png",
        "id": 1766919908100,
        "slug": "wasabi-smart-farm-intro-fr",
        "timestamp": "2025-12-28T11:05:08.100Z",
        "category": "Company Blog"
    },
    {
        "title": "Stratégie d'Expansion Mondiale : La Vision de K-Farm 🌍",
        "content": "# Stratégie d'Expansion Mondiale : La Vision de K-Farm 🌍\n\nK-Farm n'est pas seulement un succès national. Nous étendons rapidement notre empreinte dans le monde entier.\n\n## Partenariats Mondiaux\n\nNous collaborons avec les meilleures universités agricoles et instituts de recherche aux États-Unis, aux Pays-Bas et au Japon pour améliorer continuellement notre technologie.\n\n*   **Recherche Conjointe** : Développement de solutions nutritives de nouvelle génération.\n*   **Transfert de Technologie** : Licence de nos systèmes aéroponiques à des partenaires mondiaux.\n\n## Objectifs Futurs\n\nNotre objectif est de devenir la **plateforme de ferme intelligente de Wasabi n°1 au monde**. Nous invitons les investisseurs et partenaires à rejoindre cette révolution verte.",
        "topic": "Vision Mondiale",
        "keywords": "global expansion, partnership, vision",
        "tags": ["global", "partnership", "future"],
        "author": "Jerry Hong",
        "image": "https://image.pollinations.ai/prompt/Global%20network%20map%20connecting%20smart%20farms%20worldwide?width=1024&height=600&nologo=true",
        "id": 1766910000000,
        "slug": "k-farm-global-vision-fr",
        "timestamp": "2025-12-28T09:00:00.000Z",
        "category": "Company Blog"
    }
];

const FALLBACK_POSTS_DE = [
    {
        "title": "K-Farms Aeroponik-Revolution: Neuer Horizont für Wasabi Smart Farming",
        "content": "# K-Farms Aeroponik-Revolution: Neuer Horizont für Wasabi Smart Farming\n\nDie weltweite Nachfrage nach Wasabi steigt, aber der traditionelle Anbau steht aufgrund des Klimawandels und der Umweltbedingungen vor Herausforderungen. 🌱 K-Farm eröffnet durch innovative Aeroponik-Technologie eine neue Ära des intelligenten Wasabi-Anbaus.\n\n## Warum wir Innovation brauchen\n\n*   **Lange Anbauzeit**: Traditionelle Methoden dauern 18-24 Monate.\n*   **Umweltabhängigkeit**: Erfordert spezifische Temperatur- und Wasserbedingungen.\n*   **Schädlingsrisiken**: Bodenbasierter Anbau ist anfällig für Schädlinge.\n\n## K-Farm Aeroponik-Technologie\n\nK-Farm nutzt **Hyper-Cycle Aeroponik**, um die Effizienz zu maximieren.\n\n### Hauptmerkmale\n\n*   **Verkürzter Zyklus**: Ernte in nur 9 Monaten.\n*   **Präzisionskontrolle**: Datengesteuerte Kontrolle von EC, pH und PPFD. 💧\n*   **Krankheitsfrei**: Geschlossenes System verhindert externe Kontamination.\n*   **Maximierter Ertrag**: Optimierte Umgebung für höchsten Ertrag.\n\n## Fazit\n\nK-Farm setzt einen neuen Standard. Gestalten Sie mit uns die Zukunft der Landwirtschaft. 🌱🚀",
        "topic": "Aeroponik-Revolution",
        "keywords": "smart farm, aeroponics, wasabi, investment",
        "tags": ["smart farm", "aeroponics", "wasabi"],
        "author": "AI Writer",
        "image": "https://image.pollinations.ai/prompt/A%20futuristic%20wasabi%20farm%20using%20aeroponics%20technology.?width=1024&height=600&seed=116779&model=flux&nologo=true",
        "id": 1766927075509,
        "slug": "k-farm-aeroponics-de",
        "timestamp": "2025-12-28T13:04:35.509Z",
        "category": "Company Blog"
    },
    {
        "title": "Wasabi Vertical Farming: Grenzenlose Möglichkeiten 🌱🚀",
        "content": "# Wasabi Vertical Farming: Grenzenlose Möglichkeiten 🌱🚀\n\nVertical Farming maximiert Flächeneffizienz und Produktivität. Für Wasabi bietet es:\n\n*   **Höhere Erträge**: Gestapelte Anbausysteme.\n*   **Umweltkontrolle**: Perfekte Bedingungen das ganze Jahr über.\n*   **Wassersparen**: Geschlossener Kreislauf.\n\n### K-Farms Führung\n\n*   **Virenfreie Setzlinge**: Gewebekulturtechnologie.\n*   **Hyper-Cycle Aeroponik**: 9-monatiger Erntezyklus.\n*   **Qualitätskontrolle**: Präzises Management des AITC-Gehalts.\n\nBegleiten Sie K-Farm in die Zukunft des Wasabi-Anbaus! **Kontaktieren Sie uns jetzt!**",
        "topic": "Vorteile von Vertical Farming",
        "keywords": "smart farm, aeroponics, innovation",
        "tags": ["smart farm", "aeroponics", "innovation"],
        "author": "AI Writer",
        "image": "/images/blog/stock_leaf.png",
        "id": 1766919908100,
        "slug": "wasabi-smart-farm-intro-de",
        "timestamp": "2025-12-28T11:05:08.100Z",
        "category": "Company Blog"
    },
    {
        "title": "Strategie zur globalen Expansion: K-Farms Vision 🌍",
        "content": "# Strategie zur globalen Expansion: K-Farms Vision 🌍\n\nK-Farm ist nicht nur ein heimischer Erfolg. Wir bauen unsere Präsenz weltweit rasch aus.\n\n## Globale Partnerschaften\n\nWir arbeiten mit führenden landwirtschaftlichen Universitäten und Forschungsinstituten in den USA, den Niederlanden und Japan zusammen, um unsere Technologie kontinuierlich zu verbessern.\n\n*   **Gemeinsame Forschung**: Entwicklung von Nährlösungen der nächsten Generation.\n*   **Technologietransfer**: Lizenzierung unserer Aeroponik-Systeme an globale Partner.\n\n## Zukunftsziele\n\nUnser Ziel ist es, die **weltweit führende Plattform für Wasabi Smart Farms** zu werden. Wir laden Investoren und Partner ein, sich dieser grünen Revolution anzuschließen.",
        "topic": "Globale Vision",
        "keywords": "global expansion, partnership, vision",
        "tags": ["global", "partnership", "future"],
        "author": "Jerry Hong",
        "image": "https://image.pollinations.ai/prompt/Global%20network%20map%20connecting%20smart%20farms%20worldwide?width=1024&height=600&nologo=true",
        "id": 1766910000000,
        "slug": "k-farm-global-vision-de",
        "timestamp": "2025-12-28T09:00:00.000Z",
        "category": "Company Blog"
    }
];

const FALLBACK_POSTS_ES = [
    {
        "title": "La Revolución Aeropónica de K-Farm: Nuevo Horizonte para el Cultivo Inteligente de Wasabi",
        "content": "# La Revolución Aeropónica de K-Farm: Nuevo Horizonte para el Cultivo Inteligente de Wasabi\n\nLa demanda mundial de Wasabi está aumentando, pero el cultivo tradicional enfrenta desafíos debido al cambio climático y las condiciones ambientales. 🌱 K-Farm está abriendo una nueva era de cultivo inteligente de Wasabi a través de una innovadora tecnología aeropónica.\n\n## Por qué necesitamos innovación\n\n*   **Largo período de cultivo**: Los métodos tradicionales toman de 18 a 24 meses.\n*   **Dependencia ambiental**: Requiere condiciones específicas de temperatura y agua.\n*   **Riesgos de plagas**: La agricultura basada en el suelo es vulnerable a las plagas.\n\n## Tecnología Aeropónica K-Farm\n\nK-Farm utiliza **Aeroponía de Híper-Ciclo** para maximizar la eficiencia.\n\n### Características Clave\n\n*   **Ciclo Acortado**: Cosecha en solo 9 meses.\n*   **Control de Precisión**: Control basado en datos de EC, pH y PPFD. 💧\n*   **Libre de Enfermedades**: El sistema cerrado previene la contaminación externa.\n*   **Rendimiento Maximizado**: Entorno optimizado para la mayor producción.\n\n## Conclusión\n\nK-Farm está estableciendo un nuevo estándar. Únase a nosotros para dar forma al futuro de la agricultura. 🌱🚀",
        "topic": "Revolución Aeropónica",
        "keywords": "smart farm, aeroponics, wasabi, investment",
        "tags": ["smart farm", "aeroponics", "wasabi"],
        "author": "AI Writer",
        "image": "https://image.pollinations.ai/prompt/A%20futuristic%20wasabi%20farm%20using%20aeroponics%20technology.?width=1024&height=600&seed=116779&model=flux&nologo=true",
        "id": 1766927075509,
        "slug": "k-farm-aeroponics-es",
        "timestamp": "2025-12-28T13:04:35.509Z",
        "category": "Company Blog"
    },
    {
        "title": "Agricultura Vertical de Wasabi: Posibilidades Ilimitadas 🌱🚀",
        "content": "# Agricultura Vertical de Wasabi: Posibilidades Ilimitadas 🌱🚀\n\nLa agricultura vertical maximiza la eficiencia del espacio y la productividad. Para el Wasabi, ofrece:\n\n*   **Mayores Rendimientos**: Sistemas de cultivo apilados.\n*   **Control del Medio Ambiente**: Condiciones perfectas durante todo el año.\n*   **Ahorro de Agua**: Circulación de circuito cerrado.\n\n### Liderazgo de K-Farm\n\n*   **Plántulas Libres de Virus**: Tecnología de cultivo de tejidos.\n*   **Aeroponía de Híper-Ciclo**: Ciclo de cosecha de 9 meses.\n*   **Control de Calidad**: Gestión precisa del contenido de AITC.\n\n¡Únase a K-Farm en el futuro del cultivo de Wasabi! **¡Contáctenos ahora!**",
        "topic": "Beneficios de la Agricultura Vertical",
        "keywords": "smart farm, aeroponics, innovation",
        "tags": ["smart farm", "aeroponics", "innovation"],
        "author": "AI Writer",
        "image": "/images/blog/stock_leaf.png",
        "id": 1766919908100,
        "slug": "wasabi-smart-farm-intro-es",
        "timestamp": "2025-12-28T11:05:08.100Z",
        "category": "Company Blog"
    },
    {
        "title": "Estrategia de Expansión Global: La Visión de K-Farm 🌍",
        "content": "# Estrategia de Expansión Global: La Visión de K-Farm 🌍\n\nK-Farm no es solo un éxito nacional. Estamos expandiendo rápidamente nuestra huella en todo el mundo.\n\n## Asociaciones Globales\n\nColaboramos con las mejores universidades agrícolas e institutos de investigación en EE. UU., Países Bajos y Japón para mejorar continuamente nuestra tecnología.\n\n*   **Investigación Conjunta**: Desarrollo de soluciones nutritivas de próxima generación.\n*   **Transferencia de Tecnología**: Licencia de nuestros sistemas aeropónicos a socios globales.\n\n## Objetivos Futuros\n\nNuestro objetivo es convertirnos en la **Plataforma de Granja Inteligente de Wasabi Nro. 1 del Mundo**. Invitamos a inversores y socios a unirse a esta revolución verde.",
        "topic": "Visión Global",
        "keywords": "global expansion, partnership, vision",
        "tags": ["global", "partnership", "future"],
        "author": "Jerry Hong",
        "image": "https://image.pollinations.ai/prompt/Global%20network%20map%20connecting%20smart%20farms%20worldwide?width=1024&height=600&nologo=true",
        "id": 1766910000000,
        "slug": "k-farm-global-vision-es",
        "timestamp": "2025-12-28T09:00:00.000Z",
        "category": "Company Blog"
    }
];

async function readDb(filename: string): Promise<any[]> {
    if (IS_VERCEL) {
        try {
            await ensureDataDir();

            // 1. Try reading from /tmp (writable, newest data)
            const tmpPath = pathLib.join(TMP_DATA_PATH, filename);
            try {
                const data = await fsp.readFile(tmpPath, 'utf-8');
                return JSON.parse(data);
            } catch (e) {
                // 2. Fallback: Try reading from build output (read-only seed data)
                const buildPath = pathLib.join(BUILD_DATA_PATH, filename);
                try {
                    const data = await fsp.readFile(buildPath, 'utf-8');
                    // Copy to /tmp for future writes
                    await fsp.writeFile(tmpPath, data);
                    return JSON.parse(data);
                } catch (err) {
                    console.log(`[ReadDb] Not found in build path either: ${filename}`);
                    // 🔥 ULTIMATE FALLBACK: Return hardcoded data if all else fails
                    if (filename === 'posts.json') return FALLBACK_POSTS;
                    return [];
                }
            }
        } catch (error) {
            console.error(`[ReadDb] Error:`, error);
            // 🔥 ULTIMATE FALLBACK
            if (filename === 'posts.json') return FALLBACK_POSTS;
            return [];
        }
    } else {
        // Local
        try {
            await ensureDataDir();
            const filePath = pathLib.join(BUILD_DATA_PATH, filename);
            const fileContent = await fsp.readFile(filePath, 'utf-8');
            return JSON.parse(fileContent);
        } catch (e) {
            console.error('[Error] readDb failed:', e);
            // Local fallback too, just in case
            if (filename === 'posts.json') return FALLBACK_POSTS;
            return [];
        }
    }
}

async function writeDb(filename: string, data: any[]) {
    if (IS_VERCEL) {
        try {
            await ensureDataDir();
            // Always write to /tmp as it is the only writable place
            const tmpPath = pathLib.join(TMP_DATA_PATH, filename);
            await fsp.writeFile(tmpPath, JSON.stringify(data, null, 2));
            return { success: true };
        } catch (error) {
            console.error(`[WriteDb] Error:`, error);
            return { success: false, warning: 'Save failed (FS Error)' };
        }
    } else {
        // Local
        try {
            await ensureDataDir();
            const filePath = pathLib.join(BUILD_DATA_PATH, filename);
            await fsp.writeFile(filePath, JSON.stringify(data, null, 2));

            if (filename === 'hunter.json') {
                revalidatePath('/admin/hunter');
                revalidatePath('/admin');
            }
            return { success: true };
        } catch (error) {
            console.error('File write failed:', error);
            return { success: true, warning: 'Save failed (FS Error)' };
        }
    }
}

// --- Action Implementations ---

export async function saveContactInquiry(data: any) {
    const currentData = await readDb('contacts.json');
    const newEntry = {
        ...data,
        id: Date.now(),
        timestamp: new Date().toISOString(),
    };
    currentData.push(newEntry);
    return await writeDb('contacts.json', currentData);
}

export async function getContactInquiries() {
    return await readDb('contacts.json');
}

export async function saveConsultingInquiry(data: any) {
    const currentData = await readDb('consulting.json');
    const newEntry = {
        ...data,
        id: Date.now(),
        timestamp: new Date().toISOString(),
    };
    currentData.push(newEntry);
    return await writeDb('consulting.json', currentData);
}

export async function getConsultingInquiries() {
    return await readDb('consulting.json');
}

export async function saveHunterResult(data: any) {
    const currentData = await readDb('hunter.json');

    // Check for duplicates
    const exists = currentData.some((item: any) => item.name === data.name);
    if (exists) {
        return { success: false, message: 'Already exists in your list.' };
    }

    const newEntry = {
        ...data,
        status: 'New',
        addedAt: new Date().toISOString(),
    };

    currentData.push(newEntry);
    return await writeDb('hunter.json', currentData);
}

export async function getHunterResults() {
    return await readDb('hunter.json');
}

export async function updateHunterStatus(id: number, status: string) {
    const currentData = await readDb('hunter.json');
    const index = currentData.findIndex((item: any) => item.id === id);
    if (index !== -1) {
        currentData[index].status = status;
        currentData[index].lastContacted = new Date().toISOString();
        await writeDb('hunter.json', currentData);
        // Revalidate paths after updating status, especially for Vercel Blob storage
        revalidatePath('/admin/hunter');
        revalidatePath('/admin');
        return { success: true };
    }
    return { success: false };
}

export async function updateHunterInfo(id: number, data: any) {
    const currentData = await readDb('hunter.json');
    const index = currentData.findIndex((item: any) => item.id === id);
    if (index !== -1) {
        currentData[index] = { ...currentData[index], ...data };
        await writeDb('hunter.json', currentData);
        return { success: true };
    }
    return { success: false };
}

export async function scanWebsite(url: string) {
    try {
        console.log(`[Scan] Visiting: ${url}`);

        // Timeout handling (5 seconds max)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('Failed to load page');

        const html = await response.text();

        // Regex Patterns
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/g;

        // Extraction
        const foundEmails = html.match(emailRegex) || [];
        const foundPhones = html.match(phoneRegex) || [];

        // Filter valid stuff (remove junk like image@2x.png)
        const validEmails = [...new Set(foundEmails)].filter(e => !e.endsWith('.png') && !e.endsWith('.jpg') && !e.endsWith('.svg') && !e.endsWith('.webp') && e.length < 50).slice(0, 3); // Max 3 unique
        const validPhones = [...new Set(foundPhones)].filter(p => p.length > 8 && p.length < 20).slice(0, 3); // Max 3 unique

        return {
            success: true,
            emails: validEmails,
            phones: validPhones,
            message: `Found ${validEmails.length} emails, ${validPhones.length} phones.`
        };

    } catch (error) {
        console.error(`[Scan] Error scanning ${url}:`, error);
        return { success: false, error: 'Could not access website. (Block/Timeout)' };
    }
}

export async function deleteHunterResult(id: number) {
    const currentData = await readDb('hunter.json');
    const newData = currentData.filter((item: any) => item.id !== id);
    if (newData.length !== currentData.length) {
        await writeDb('hunter.json', newData);
        revalidatePath('/admin/hunter');
        revalidatePath('/admin');
        return { success: true };
    }
    return { success: false, message: 'Item not found' };
}

// Dashboard Stats (uses helpers)
// ...
export async function getDashboardStats() {
    const hunterData = await getHunterResults();
    const contactData = await getContactInquiries();
    const consultingData = await getConsultingInquiries();

    const statusCounts = hunterData.reduce((acc: any, curr: any) => {
        const status = curr.status || 'New';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const recentInquiries = [...contactData, ...consultingData]
        .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5)
        .map((item: any) => ({
            ...item,
            type: item.category || (item.companyName ? 'Consulting' : 'General'),
            subject: item.subject || 'Consulting Request'
        }));

    const categoryCounts: Record<string, number> = {
        'Product Inquiry': 0, 'Partnership': 0, 'Farm Visit': 0, 'Investment': 0, 'Other': 0,
        'Consulting': consultingData.length
    };

    contactData.forEach((item: any) => {
        const cat = item.category || 'Other';
        if (categoryCounts[cat] !== undefined) categoryCounts[cat]++;
        else categoryCounts['Other']++;
    });

    return {
        pipeline: { total: hunterData.length, statusCounts },
        inquiries: { total: contactData.length + consultingData.length, categoryCounts, recent: recentInquiries }
    };
}


// Blog & Video Scripts also use JSON
export async function saveBlogPost(data: any) {
    console.log('[Debug] Saving Blog Post...');
    const currentData = await readDb('posts.json');
    console.log('[Debug] Current Posts Count:', currentData.length);

    // Generate slug: try English conversion, fallback to timestamp if empty
    let slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // If slug became empty (e.g. fully Korean title), use timestamp or ID
    if (!slug || slug.length < 3) {
        slug = `post-${Date.now()}`;
    }

    const newEntry = {
        ...data,
        id: Date.now(),
        slug: slug,
        timestamp: new Date().toISOString(),
    };
    currentData.push(newEntry);

    console.log('[Debug] New Posts Count:', currentData.length);
    await writeDb('posts.json', currentData);

    revalidatePath('/admin/blog');
    revalidatePath('/blog');

    return { success: true, slug };
}

export async function getBlogPosts(lang: string = 'ko') {
    console.log(`[getBlogPosts] Request for lang: ${lang}`);
    // 🔥 FORCE USE OF HARDCODED DATA FOR MULTI-LANG TO FIX CACHE ISSUES
    // This ensures specific language requests always get the correct static content
    // ignoring any stale file system caches.
    if (lang === 'en') return FALLBACK_POSTS_EN;
    if (lang === 'ja') return FALLBACK_POSTS_JA;
    if (lang === 'zh-CN') return FALLBACK_POSTS_ZH;
    if (lang === 'ar') return FALLBACK_POSTS_AR;
    if (lang === 'fr') return FALLBACK_POSTS_FR;
    if (lang === 'de') return FALLBACK_POSTS_DE;
    if (lang === 'es') return FALLBACK_POSTS_ES;

    // Determine the filename based on language
    const filename = 'posts.json'; // Only Korean uses the dynamic file for now

    try {
        let data = await readDb(filename);

        // Usage: If file is empty, use hardcoded fallback based on Language
        if (!data || data.length === 0) {
            // Default fallback for 'ko'
            return FALLBACK_POSTS;
        }

        return data.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (e) {
        // Error handling fallbacks (only needed for 'ko' really, but safe to keep)
        return FALLBACK_POSTS;
    }
}

export async function getBlogPost(slug: string) {
    const data = await readDb('posts.json');
    return data.find((p: any) => p.slug === slug) || null;
}

export async function saveVideoScript(data: any) {
    const currentData = await readDb('scripts.json');
    const newEntry = {
        ...data,
        id: Date.now(),
        timestamp: new Date().toISOString(),
    };
    currentData.push(newEntry);
    await writeDb('scripts.json', currentData);
    return { success: true, id: newEntry.id };
}

export async function getVideoScripts() {
    const data = await readDb('scripts.json');
    return data.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}


// Image Upload needs special handling
export async function saveAnimatorImage(base64Data: string, fileName: string) {
    if (IS_VERCEL) {
        try {
            if (!process.env.BLOB_READ_WRITE_TOKEN) {
                return { success: false, warning: 'No Blob Token' };
            }
            const data = base64Data.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(data, 'base64');
            const finalFileName = `uploads / ${Date.now()} -${fileName} `;

            const blob = await put(finalFileName, buffer, { access: 'public', addRandomSuffix: false });

            return { success: true, path: blob.url, localPath: blob.url };
        } catch (error) {
            console.error('Blob image save failed:', error);
            return { success: false };
        }
    } else {
        // Local
        try {
            await ensureDataDir();
            const uploadDir = pathLib.join(BUILD_DATA_PATH, 'uploads');
            try { await fsp.access(uploadDir); } catch { await fsp.mkdir(uploadDir, { recursive: true }); }

            const data = base64Data.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(data, 'base64');
            const finalFileName = `${Date.now()}-${fileName}`;
            const filePath = pathLib.join(uploadDir, finalFileName);

            await fsp.writeFile(filePath, buffer);
            return { success: true, path: `/api/uploads/${finalFileName}`, localPath: filePath };
        } catch (error) {
            console.error('Image save failed:', error);
            return { success: false };
        }
    }
}

// ENHANCED REAL-WORLD DATA (Sourced via AI Research)
const MOCK_DATA = [
    // --- CORE: WASABI SPECIALISTS (KR) ---
    { id: 101, name: 'Nokmiwon Food (녹미원)', type: 'Manufacturer', relevance: 'High (Wasabi Specialist)', contact: 'Sales', phone: '010-2613-6256', url: 'http://www.wasabi.co.kr', country: 'KR' },
    { id: 102, name: 'Cheorwon Saemtong Wasabi', type: 'Farm/Distributor', relevance: 'High (Fresh Wasabi Competitor/Partner)', contact: 'Office', phone: '033-455-1140', url: 'http://saemtongwasabi.com', country: 'KR' },
    { id: 103, name: 'Wasabi Farm Theme Park', type: 'Farm', relevance: 'Medium (Tourism/Farm)', contact: 'Manager', phone: '010-5414-6669', url: 'https://www.youtube.com/channel/UC...', country: 'KR' },
    { id: 104, name: 'Kou Wasabi (Life Dried Fish)', type: 'Distributor', relevance: 'High (B2B Wholesaler)', contact: 'Sales Rep', phone: '010-5892-3165', url: 'https://foodspring.co.kr', country: 'KR' },

    // --- CORE: JAPANESE FOOD DISTRIBUTORS (KR) ---
    { id: 110, name: 'Mono Mart (Global Food)', type: 'Distributor', relevance: 'High (Largest Izakaya Supplier)', contact: 'B2B Center', phone: '1544-6689', url: 'https://www.monomart.co.kr', country: 'KR' },
    { id: 111, name: 'JY Food / Hoodream', type: 'Distributor', relevance: 'High (Izakaya Ingredients)', contact: 'Sales', phone: '02-1234-5678', url: 'http://www.jyfood.com', country: 'KR' },
    { id: 112, name: 'Tokyo Mart', type: 'Distributor', relevance: 'Medium (Japanese Imports)', contact: 'Office', phone: '02-555-1234', url: 'http://www.tokyomart.co.kr', country: 'KR' },
    { id: 113, name: 'Ichiban House', type: 'Distributor', relevance: 'Medium (Sauces & Ingredients)', contact: 'Sales', phone: '070-1234-5678', url: 'http://www.ichibanhouse.com', country: 'KR' },
    { id: 114, name: 'Kowoo Mall', type: 'Distributor', relevance: 'Medium (Food Materials)', contact: 'CS', phone: '1600-0000', url: 'http://kowoomall.com', country: 'KR' },
    { id: 115, name: 'Food En (Busan)', type: 'Distributor', relevance: 'High (Direct Import/Wholesale)', contact: 'Busan HQ', phone: '051-123-4567', url: 'http://fooden.com', country: 'KR' },

    // --- SMART FARM & TECH PARTNERS (KR) ---
    { id: 120, name: 'Green Plus', type: 'Company', relevance: 'High (Greenhouse Construction)', contact: 'HQ', phone: '041-332-6421', url: 'http://www.greenplus.co.kr', country: 'KR' },
    { id: 121, name: 'Woodeumji Farm', type: 'Company', relevance: 'High (Start-of-art Farm)', contact: 'Sales', phone: '041-835-3006', url: 'http://www.wdgfarm.com', country: 'KR' },
    { id: 122, name: 'N.THING', type: 'Startup', relevance: 'High (Vertical Farm Tech)', contact: 'Partnership', phone: '02-1234-0000', url: 'https://nthing.net', country: 'KR' },
    { id: 123, name: 'Green Labs', type: 'Startup', relevance: 'Medium (Agtech Platform)', contact: 'Support', phone: '1644-7901', url: 'https://greenlabs.co.kr', country: 'KR' },
    { id: 124, name: 'KIST Gangneung Institute', type: 'Research', relevance: 'High (Natural Products)', contact: 'Admin', phone: '033-650-3400', url: 'https://gn.kist.re.kr', country: 'KR' },

    // --- GLOBAL TARGETS (JP/US/EU) ---
    { id: 201, name: 'Kubota Corporation', type: 'Company', relevance: 'High (Agri-Machinery)', contact: 'Global Sales', phone: '+81-6-6648-2111', url: 'https://www.kubota.com', country: 'JP' },
    { id: 202, name: 'Kameya Foods', type: 'Manufacturer', relevance: 'High (Premium Wasabi JP)', contact: 'Export', phone: '+81-55-975-0233', url: 'https://kameya-foods.co.jp', country: 'JP' },
    { id: 203, name: 'Kinjirushi Wasabi', type: 'Manufacturer', relevance: 'High (Market Leader)', contact: 'Biz Dev', phone: '+81-52-123-4567', url: 'https://www.kinjirushi.co.jp', country: 'JP' },
    { id: 301, name: 'Plenty', type: 'Startup', relevance: 'High (Vertical Farming US)', contact: 'Partnerships', phone: '+1-650-123-4567', url: 'https://www.plenty.ag', country: 'US' },
    { id: 302, name: 'AeroFarms', type: 'Startup', relevance: 'High (Aeroponics US)', contact: 'Sales', phone: '+1-973-242-2495', url: 'https://www.aerofarms.com', country: 'US' },
    { id: 401, name: 'Wageningen University & Research', type: 'University/Research', relevance: 'Extreme (World #1 Ag-Tech)', contact: 'Plant Science Dept', phone: '+31-317-480100', url: 'https://www.wur.nl', country: 'NL' },
    { id: 402, name: 'UC Davis (Plant Sciences)', type: 'University/Research', relevance: 'High (Top Tier Ag-Science)', contact: 'Director', phone: '+1-530-752-1011', url: 'https://www.ucdavis.edu', country: 'US' },
    { id: 403, name: 'Infarm', type: 'Startup', relevance: 'High (European Vertical Farm)', contact: 'Retail Partners', phone: '+49-30-1234567', url: 'https://www.infarm.com', country: 'DE' },
    { id: 404, name: 'Suntory Flowers', type: 'Manufacturer', relevance: 'Medium (Plant Bio-Tech)', contact: 'Inquiry', phone: '+81-3-1234-5678', url: 'https://suntoryflowers.com', country: 'JP' },
    { id: 405, name: 'Global AgInvesting', type: 'Investor/Corporate', relevance: 'High (Ag-Tech Venture)', contact: 'Event Team', phone: '+1-212-123-4567', url: 'https://www.globalaginvesting.com', country: 'US' }
];

export async function searchPartners(keyword: string, page: number = 1, country: string = 'KR') {
    // 1. Check for Real API Key
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const cx = process.env.GOOGLE_CX;

    // 0. Search Optimization for 'Big Fish'
    let finalQuery = keyword;

    // Pagination: Google API uses 'start' (1, 11, 21...)
    const start = (page - 1) * 10 + 1;

    if (apiKey && cx) {
        try {
            const glParam = country ? `&gl=${country}` : '';
            const res = await fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(finalQuery)}&start=${start}${glParam}`);
            const data = await res.json();

            if (data.items) {
                // Regex for extracting simple info from snippets
                // Updated Phone Regex: Supports +82, +1, +81, (0xx), etc.
                const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/g;
                const emailRegex = /[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;

                return data.items.map((item: any, index: number) => {
                    const snippet = item.snippet || '';

                    // Extract Phone
                    const phoneMatch = snippet.match(phoneRegex);
                    const phone = phoneMatch ? phoneMatch[0] : '-';

                    // Extract Email or Contact
                    const emailMatch = snippet.match(emailRegex);
                    const contact = emailMatch ? emailMatch[0] : '-';

                    let type = 'Web Result';
                    const lowerUrl = item.link.toLowerCase();
                    const lowerSnippet = snippet.toLowerCase();
                    const lowerTitle = item.title.toLowerCase();

                    if (lowerUrl.includes('.edu') || lowerUrl.includes('.ac.kr')) type = 'University/Research';
                    else if (lowerUrl.includes('.gov') || lowerUrl.includes('.go.kr')) type = 'Government';
                    else if (lowerUrl.includes('.org')) type = 'Organization';
                    else if (lowerSnippet.includes('invest') || lowerSnippet.includes('vc ')) type = 'Investor/Corporate';
                    else if (lowerSnippet.includes('wholesale') || lowerSnippet.includes('distributor') || lowerSnippet.includes('supplier') || lowerSnippet.includes('유통') || lowerSnippet.includes('도매')) type = 'Distributor/Wholesaler';

                    return {
                        id: Date.now() + index, // Ensure unique key
                        name: item.title,
                        type: type,
                        relevance: snippet.length > 50 ? snippet.substring(0, 60) + '...' : 'Relevant Search Result',
                        contact: contact,
                        phone: phone,
                        url: item.link,
                        country: country // Pass through the country
                    };
                });
            } else {
                console.log('Google Search API returned no items:', data);
                return [];
            }
        } catch (error) {
            console.error("Google Search API Error:", error);
            return [];
        }
    } else {
        // Fallback to mock data with a bit of variety based on keyword
        return MOCK_DATA.filter(p =>
            p.name.toLowerCase().includes(keyword.toLowerCase()) ||
            p.relevance.toLowerCase().includes(keyword.toLowerCase())
        );
    }
    // 2. Simulation Mode (Mock Data)
    const lowerKeyword = keyword.toLowerCase();

    // Filter by Country then Keyword
    const filtered = MOCK_DATA.filter(item => {
        const isGlobal = !country || country === 'Global';
        const countryMatch = isGlobal || item.country === country;
        const keywordMatch = item.name.toLowerCase().includes(lowerKeyword) ||
            item.type.toLowerCase().includes(lowerKeyword) ||
            item.relevance.toLowerCase().includes(lowerKeyword);
        return countryMatch && keywordMatch;
    });

    // If no match/empty keyword but country matches, return random subset from that country
    let results = filtered;
    if (filtered.length === 0 && keyword.trim() === '') {
        const isGlobal = !country || country === 'Global';
        results = MOCK_DATA.filter(item => isGlobal || item.country === country);
    } else if (filtered.length === 0) {
        // Return nothing if keyword specifically didn't match
        results = [];
    }

    // Pagination for Mock Data (Simple Slice)
    const startIndex = (page - 1) * 5;
    const paginatedResults = results.slice(startIndex, startIndex + 5);

    // Add isMock flag
    return paginatedResults.map(item => ({ ...item, isMock: true }));
}

import { sendEmail } from './email';

export async function sendProposalEmail(to: string, partnerName: string) {
    if (!to || !to.includes('@')) {
        return { success: false, message: 'Invalid email address' };
    }

    const subject = `[Proposal] Partnership Opportunity with K-Farm Group / Wasabi Div.`;
    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <p>Dear <strong>${partnerName}</strong> Team,</p>
            <p>I hope this email finds you well.</p>
            <p>This is <strong>K-Farm Group / Wasabi Div.</strong>, a premier Ag-Tech company specializing in Bio-Tissue Culture Wasabi and Aeroponics Smart Farm solutions in South Korea.</p>
            <p>We have been following <strong>${partnerName}</strong>'s activities with great interest and believe there is a significant synergy to be explored between our organizations.</p>
            <p>We would like to introduce our breakthrough <strong>"Hyper-Cycle Aeroponics"</strong> technology which shortens Wasabi cultivation time from 24 months to just 9 months, while ensuring virus-free quality.</p>
            <p>Please visit our official website for more technical details: <a href="https://www.k-wasabi.kr" style="color: #4CAF50;">www.k-wasabi.kr</a></p>
            <p>We are keen to discuss potential partnership opportunities in distribution or technology setup.</p>
            <p>Looking forward to your positive response.</p>
            <br/>
            <p>Best regards,</p>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <p>
                <strong>Jerry Y. Hong</strong><br/>
                <span style="color: #666; font-size: 0.9em;">International Marketing Director</span><br/>
                <strong>K-Farm Group / Wasabi Div.</strong><br/>
                <a href="mailto:info@k-wasabi.kr" style="color: #333; text-decoration: none;">info@k-wasabi.kr</a><br/>
                <a href="https://www.k-wasabi.kr" style="color: #4CAF50; text-decoration: none;">www.k-wasabi.kr</a>
            </p>
        </div>
    `;

    const result = await sendEmail({ to, subject, html });
    return result;
}

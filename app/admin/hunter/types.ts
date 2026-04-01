export interface HunterResult {
    id: number;
    name: string;
    url: string;
    description?: string;
    country: string;
    type: string;
    relevance: string;
    status: string;
    email?: string;
    phone?: string;
    contact?: string;
    lastContacted?: string;
    aiSummary?: {
        score: number;
        analysis: string;
        angle: string;
        industry?: string; 
        urgency?: string;  
    };
    intelligenceReport?: string;
    sns?: {
        instagram?: string;
        facebook?: string;
        youtube?: string;
        twitter?: string;
        linkedin?: string;
    };
    catalogs?: string[];
    note?: string;
    tags?: string[];
    address?: string;
    category?: string;
    isMock?: boolean;
    techSpecs?: { label: string; value: string }[];
}

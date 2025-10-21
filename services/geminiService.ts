

import { GoogleGenAI, Type } from "@google/genai";
import { Keyword, ContentStrategy, CategorizedKeywords, KeywordDetails, IMCPlan } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const keywordSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            keyword: {
                type: Type.STRING,
                description: "The search keyword in Vietnamese.",
            },
            volume: {
                type: Type.STRING,
                enum: ['High', 'Medium', 'Low'],
                description: "Estimated qualitative search volume.",
            },
            intent: {
                type: Type.STRING,
                description: "The likely user intent behind the search query."
            },
            cpc: {
                type: Type.STRING,
                description: "Estimated Cost Per Click (CPC) range in Vietnamese Dong (VND), representing competitor spending."
            },
            competition: {
                type: Type.STRING,
                enum: ['High', 'Medium', 'Low'],
                description: "The level of competition from other advertisers for this keyword."
            },
            semrushLink: {
                type: Type.STRING,
                description: "A plausible example link to a SEMrush keyword overview report for this keyword in the Vietnam database (e.g., https://www.semrush.com/analytics/keywordoverview/?q=...&db=vn)."
            }
        },
        required: ['keyword', 'volume', 'intent', 'cpc', 'competition', 'semrushLink']
    }
};

const keywordUserIntentSchema = {
    type: Type.OBJECT,
    properties: {
        intent: { type: Type.STRING, description: "The type of user intent (e.g., 'Informational', 'Transactional', 'Commercial Investigation', 'Navigational')." },
        description: { type: Type.STRING, description: "A detailed explanation of what the user wants to achieve with this intent for the given keyword, in Vietnamese." },
        exampleQueries: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 2-3 example search queries in Vietnamese that represent this intent."
        }
    },
    required: ['intent', 'description', 'exampleQueries']
};

const contentPillarClusterSchema = {
    type: Type.OBJECT,
    properties: {
        clusterTitle: { type: Type.STRING, description: "The catchy title of the cluster topic." },
        userIntent: { type: Type.STRING, description: "The specific user search intent this cluster topic addresses, in Vietnamese (e.g., 'So sánh lãi suất vay' or 'Tìm hiểu điều kiện vay')." },
        clusterDescription: { type: Type.STRING, description: "A short, appealing description for the cluster topic that directly addresses and expands on the user intent." },
        suggestedFormat: { type: Type.STRING, description: "A suggested content format (e.g., 'How-to Guide', 'Comparison Article', 'Video Script')." },
        specificKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 3-5 specific, long-tail keywords related to the cluster topic."
        },
        draftContent: {
            type: Type.STRING,
            description: "A detailed and engaging draft of the content with AT LEAST 500 characters, written in appealing, persuasive Vietnamese. This should be a substantial piece of content ready to use as a strong starting point."
        }
    },
    required: ['clusterTitle', 'userIntent', 'clusterDescription', 'suggestedFormat', 'specificKeywords', 'draftContent']
};

const contentPillarSchema = {
    type: Type.OBJECT,
    properties: {
        pillarTitle: { type: Type.STRING, description: "The title of the main content pillar." },
        pillarDescription: { type: Type.STRING, description: "A description of what this pillar covers and how its clusters build topical authority." },
        contentAngle: { type: Type.STRING, description: "A unique angle or hook to make the content stand out." },
        clusterTopics: {
            type: Type.ARRAY,
            items: contentPillarClusterSchema,
            description: "An array of related cluster topics that support the main pillar."
        }
    },
    required: ['pillarTitle', 'pillarDescription', 'contentAngle', 'clusterTopics']
};

const competitorSchema = {
    type: Type.OBJECT,
    properties: {
        competitorName: { type: Type.STRING, description: "The name of the competitor website or company." },
        strategySummary: { type: Type.STRING, description: "A brief summary of the competitor's content strategy for the target keyword." },
        strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 2-3 key strengths of the competitor's content."
        },
        weaknesses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 2-3 key weaknesses or opportunities to outperform the competitor."
        }
    },
    required: ['competitorName', 'strategySummary', 'strengths', 'weaknesses']
};

const contentStrategySchema = {
    type: Type.OBJECT,
    properties: {
        keywordUserIntents: {
            type: Type.ARRAY,
            items: keywordUserIntentSchema,
            description: "An analysis of the different user intents for the main keyword."
        },
        aiOverviewIntro: {
            type: Type.STRING,
            description: "A brief introduction about getting featured in Google AI Overviews for this specific keyword, in Vietnamese."
        },
        aiOverviewContent: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Actionable tips on structuring content for the keyword to appear in AI Overviews, in Vietnamese."
        },
        aiOverviewSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Specific Schema Markup recommendations relevant to the keyword, in Vietnamese."
        },
        aiOverviewEEAT: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Strategies to enhance E-E-A-T signals for content related to the keyword, in Vietnamese."
        },
        contentPillars: {
            type: Type.ARRAY,
            items: contentPillarSchema,
            description: "Three comprehensive content pillar suggestions based on the keyword, each with 4 cluster topics and specific keywords for each cluster."
        },
        competitorAnalysis: {
            type: Type.ARRAY,
            items: competitorSchema,
            description: "An analysis of the top 3 competitors for the given keyword."
        }
    },
    required: ['keywordUserIntents', 'aiOverviewIntro', 'aiOverviewContent', 'aiOverviewSchema', 'aiOverviewEEAT', 'contentPillars', 'competitorAnalysis']
};

const keywordDetailsSchema = {
    type: Type.OBJECT,
    properties: {
        intentExplanation: { type: Type.STRING, description: "A detailed explanation of the user's intent for this keyword, in Vietnamese." },
        cpcBreakdown: {
            type: Type.OBJECT,
            properties: {
                lowRangeVND: { type: Type.STRING, description: "The lower end of the estimated CPC range in Vietnamese Dong (VND)." },
                highRangeVND: { type: Type.STRING, description: "The higher end of the estimated CPC range in Vietnamese Dong (VND)." },
                notes: { type: Type.STRING, description: "Brief notes on bidding strategy or factors influencing the CPC, in Vietnamese." }
            },
            required: ['lowRangeVND', 'highRangeVND', 'notes']
        },
        relatedKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 5 semantically related, long-tail keywords in Vietnamese."
        },
        commonQuestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 3 common questions users ask related to this keyword, in Vietnamese."
        }
    },
    required: ['intentExplanation', 'cpcBreakdown', 'relatedKeywords', 'commonQuestions']
};

export const estimatedMetricsSchema = {
    type: Type.OBJECT,
    properties: {
        cpc: { 
            type: Type.NUMBER,
            description: "Estimated Cost Per Click in Vietnamese Dong (VND). Must be a number."
        },
        ctr: { 
            type: Type.NUMBER,
            description: "Estimated Click-Through Rate as a percentage (e.g., 1.5 for 1.5%). Must be a number."
        },
        cvr: { 
            type: Type.NUMBER,
            description: "Estimated Conversion Rate as a percentage (e.g., 2.5 for 2.5%). Must be a number."
        },
        aov: { 
            type: Type.NUMBER,
            description: "Estimated Average Order Value (or loan value) in Vietnamese Dong (VND). Must be a number."
        },
    },
    required: ['cpc', 'ctr', 'cvr', 'aov']
};

const imcPlanSchema = {
    type: Type.OBJECT,
    properties: {
        objectives: {
            type: Type.OBJECT,
            properties: {
                business: { type: Type.STRING, description: "The Business Objective (e.g., increase sales, gain market share)." },
                marketing: { type: Type.STRING, description: "The Marketing Objective, focusing on changing consumer behavior (e.g., increase usage, attract new users)." },
                communication: { type: Type.STRING, description: "The Communication Objective, focusing on changing consumer perception (e.g., increase brand awareness, build brand image)." },
            },
            required: ['business', 'marketing', 'communication'],
        },
        targetAudience: {
            type: Type.OBJECT,
            properties: {
                summary: { type: Type.STRING, description: "A summary of the target audience persona." },
                demographic: { type: Type.STRING, description: "Demographic details (age, gender, income, occupation)." },
                geographic: { type: Type.STRING, description: "Geographic details (city, rural/urban, region)." },
                psychographic: { type: Type.STRING, description: "Psychographic details (lifestyle, values, interests)." },
                behavioral: { type: Type.STRING, description: "Behavioral details (purchase habits, brand loyalty, usage rate)." },
            },
            required: ['summary', 'demographic', 'geographic', 'psychographic', 'behavioral'],
        },
        consumerInsight: {
            type: Type.OBJECT,
            properties: {
                truth: { type: Type.STRING, description: "The 'Truth': a simple, obvious fact about the consumer or category." },
                tension: { type: Type.STRING, description: "The 'Tension': a conflict or frustration the consumer feels related to the truth." },
                motivation: { type: Type.STRING, description: "The 'Motivation': the consumer's desire or goal that the brand can tap into." },
                insight: { type: Type.STRING, description: "The final, concise consumer insight statement." },
            },
            required: ['truth', 'tension', 'motivation', 'insight'],
        },
        bigIdea: {
            type: Type.OBJECT,
            properties: {
                idea: { type: Type.STRING, description: "The overarching Big Idea for the campaign that solves the consumer's tension." },
                keyMessage: { type: Type.STRING, description: "The core, consistent Key Message that will be communicated across all channels." },
                brandRole: { type: Type.STRING, description: "The role the brand plays in the consumer's life related to the Big Idea." },
            },
            required: ['idea', 'keyMessage', 'brandRole'],
        },
        deploymentPlan: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    phaseName: { type: Type.STRING, description: "The name of the campaign phase (e.g., 'Teasing', 'Launch', 'Sustain')." },
                    duration: { type: Type.STRING, description: "The duration of this phase (e.g., '2 Weeks')." },
                    objective: { type: Type.STRING, description: "The specific objective of this phase." },
                    keyHook: { type: Type.STRING, description: "The main activity or 'hook' for this phase (e.g., 'Viral Video Launch', 'KOL Collaboration')." },
                    supportingTactics: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of supporting activities and channels for this phase." },
                    keyMessage: { type: Type.STRING, description: "The specific message for this phase, adapted from the main Key Message." },
                },
                required: ['phaseName', 'duration', 'objective', 'keyHook', 'supportingTactics', 'keyMessage'],
            },
        },
        measurement: {
            type: Type.OBJECT,
            properties: {
                kpis: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            metric: { type: Type.STRING, description: "The name of the Key Performance Indicator (KPI)." },
                            description: { type: Type.STRING, description: "What this KPI measures." },
                            tool: { type: Type.STRING, description: "The tool used to measure it (e.g., 'Google Analytics', 'Meta Business Suite')." },
                        },
                        required: ['metric', 'description', 'tool'],
                    },
                },
                budgetAllocation: {
                    type: Type.OBJECT,
                    properties: {
                        approach: { type: Type.STRING, description: "The budgeting approach used (Top-down or Bottom-up)." },
                        breakdown: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    channel: { type: Type.STRING, description: "The marketing channel or activity." },
                                    percentage: { type: Type.NUMBER, description: "The percentage of the budget allocated." },
                                    amount: { type: Type.STRING, description: "The allocated amount in VND." },
                                    rationale: { type: Type.STRING, description: "The reason for this allocation." },
                                },
                                required: ['channel', 'percentage', 'amount', 'rationale'],
                            },
                        },
                    },
                    required: ['approach', 'breakdown'],
                },
            },
            required: ['kpis', 'budgetAllocation'],
        },
    },
    required: ['objectives', 'targetAudience', 'consumerInsight', 'bigIdea', 'deploymentPlan', 'measurement'],
};


export const fetchKeywords = async (): Promise<Omit<CategorizedKeywords, 'customSearchKeywords'>> => {
    const prompt = `Act as a digital marketing expert specializing in the Vietnamese market for Mcredit, a leading consumer finance company. 
    Generate comprehensive lists of Vietnamese search keywords related to consumer finance, focusing on these specific categories. The goal is to uncover a wide variety of keywords, including high-volume head terms and more specific, long-tail keywords, even those with lower volume and cheaper CPCs.

    1.  **Motorcycle Purchase Loans (Vay mua xe máy):** Generate 50 keywords. Include a mix of general terms, popular brand names (Honda, Yamaha, Suzuki, Piaggio), specific popular models (e.g., 'Honda Vision', 'Yamaha Exciter 155', 'Honda SH Mode'), and long-tail variations like 'trả góp xe Wave Alpha không cần trả trước' (installment for Wave Alpha with no down payment), 'vay mua xe máy cũ' (loan for used motorcycle).
    2.  **Phone Purchase Loans (Vay mua điện thoại):** Generate 50 keywords. Include general terms, and a wide range of specific models, including both new and older popular generations. For example: 'iPhone 15 Pro Max', 'iPhone 14 Pro', 'iPhone 13', 'iPhone 11', 'Samsung Galaxy S24 Ultra', 'Samsung S23', 'Samsung Z Fold 5', 'Oppo Reno11', 'Xiaomi 14'. Also include long-tail terms like 'thu cũ đổi mới iPhone 15' (trade-in for iPhone 15), 'trả góp điện thoại 0%' (0% installment for phone).
    3.  **Tablet Purchase Loans (Vay mua máy tính bảng):** Generate 50 keywords. Include general terms and a variety of specific models like 'iPad Pro M4', 'iPad Air 5', 'iPad Gen 10', 'Samsung Galaxy Tab S9', 'Xiaomi Pad 6'. Include long-tail variations like 'trả góp iPad cho sinh viên' (iPad installment for students).
    4.  **Cash Loans (Vay tiền mặt):** Generate 50 keywords. Include a broad mix of terms for personal loans, unsecured loans, quick cash advances, loans by ID card (vay theo CMND/CCCD), and long-tail keywords specifying purpose or amount, like 'vay 10 triệu online' (borrow 10 million online), 'vay tiền nhanh chỉ cần CMND' (quick loan with only ID card), 'vay tiêu dùng lãi suất thấp' (low-interest consumer loan).

    This should result in a total of 200 keywords. For each keyword, provide:
    - The keyword itself (in Vietnamese).
    - Estimated search volume (High, Medium, or Low). Ensure a good mix, including plenty of 'Low' volume keywords to represent the long-tail.
    - Likely user intent (e.g., informational, transactional, commercial investigation).
    - An estimated Cost Per Click (CPC) range in VND, reflecting competitor spending. Include cheaper CPCs for less competitive long-tail keywords.
    - The competition level (High, Medium, or Low). Ensure a good mix, including many 'Low' and 'Medium' competition keywords.
    - A plausible SEMrush link for a keyword overview in the Vietnam database (db=vn), properly URL-encoded. For example, for "vay mua xe máy", the link would be something like "https://www.semrush.com/analytics/keywordoverview/?q=vay+mua+xe+may&db=vn".

    The output must be a single JSON object with keys: "motorcycleLoanKeywords", "phoneLoanKeywords", "tabletLoanKeywords", and "cashLoanKeywords".`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        motorcycleLoanKeywords: keywordSchema,
                        phoneLoanKeywords: keywordSchema,
                        tabletLoanKeywords: keywordSchema,
                        cashLoanKeywords: keywordSchema,
                    },
                    required: ['motorcycleLoanKeywords', 'phoneLoanKeywords', 'tabletLoanKeywords', 'cashLoanKeywords']
                }
            }
        });

        const jsonString = response.text.trim();
        const data = JSON.parse(jsonString);
        return data;

    } catch (error) {
        console.error("Error fetching keywords:", error);
        throw new Error("Failed to fetch keywords from Gemini API.");
    }
};

export const discoverKeywordsForTerm = async (term: string): Promise<Keyword[]> => {
    const prompt = `Act as a digital marketing expert for Mcredit in Vietnam. The user wants to find keywords related to "${term}".
    Generate a list of 15 relevant Vietnamese search keywords. The keywords should be a mix of informational, transactional, and commercial investigation queries.

    For each keyword, provide:
    - The keyword itself (in Vietnamese).
    - Estimated search volume (High, Medium, or Low).
    - Likely user intent.
    - An estimated Cost Per Click (CPC) range in VND.
    - The competition level (High, Medium, or Low).
    - An example SEMrush link for a keyword overview in the Vietnam database (db=vn).

    The output must be a single JSON array of keyword objects.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: keywordSchema
            }
        });

        const jsonString = response.text.trim();
        const data = JSON.parse(jsonString);
        return data as Keyword[];

    } catch (error) {
        console.error(`Error discovering keywords for term "${term}":`, error);
        const errorMessage = error instanceof Error ? error.message : String(error);

        if (errorMessage.includes('500') || errorMessage.includes('xhr error')) {
             console.error("Gemini API returned a server error. This might be a transient issue or a problem with the API itself.");
             throw new Error("An internal error occurred with the AI service. Please try a different search term or try again later.");
        }
        
        throw new Error("Failed to discover keywords from Gemini API.");
    }
};


export const generateContentStrategy = async (keyword: string): Promise<ContentStrategy> => {
    const prompt = `Act as a top-tier SEO consultant and content strategist for Mcredit, a consumer finance company in Vietnam.
    Based on the Vietnamese keyword "${keyword}", generate a comprehensive content and SEO strategy.
    The output must be a single JSON object.

    The strategy must include FOUR main parts:
    1.  **Keyword User Intent Analysis:**
        - Analyze the primary user intents behind the keyword "${keyword}".
        - Identify at least 3 distinct intents (e.g., 'Informational', 'Transactional', 'Commercial Investigation').
        - For each intent, provide:
            - The \`intent\` type.
            - A detailed \`description\` of the user's goal for this intent, written in Vietnamese.
            - A list of 2-3 \`exampleQueries\` in Vietnamese that a user with this intent might search for.

    2.  **Content Pillar Deep Dive (Creative Strategy):**
        - Generate three comprehensive content pillar suggestions relevant to the keyword.
        - For each pillar, provide:
            - A compelling \`pillarTitle\`.
            - A \`pillarDescription\` that explains what the pillar covers AND how its cluster topics strategically work together to create a comprehensive content map, establishing topical authority.
            - A unique \`contentAngle\` or hook to make the content stand out from competitors.
            - Four related "cluster topics".
            - For each cluster topic, provide:
                - A catchy \`clusterTitle\`.
                - The primary \`userIntent\`, explaining what the user wants to accomplish with this search, written in Vietnamese (e.g., "So sánh các gói vay mua điện thoại để tìm ra lựa chọn tốt nhất" - "Compare phone loan packages to find the best option").
                - A short, appealing \`clusterDescription\` that directly addresses and expands on the user intent.
                - A \`suggestedFormat\` for the content (e.g., 'How-to Guide', 'Comparison Article', 'Video Script', 'Infographic').
                - 3-5 specific, long-tail \`specificKeywords\`.
                - A detailed and engaging \`draftContent\` (AT LEAST 500 characters long) written in appealing, persuasive Vietnamese. This draft should be a substantial piece of content, like a compelling introduction and first section of an article, not just a few sentences.

    3.  **Google AI Overview Roadmap:** A clear, step-by-step strategy to get content about "${keyword}" featured in Google's AI Overviews.
        - \`aiOverviewIntro\`: An introduction that summarizes the three-step roadmap: building a strong content foundation, adding technical signals, and establishing trust.
        - \`aiOverviewContent\`: Step 1: Actionable tips on structuring the content itself to be easily digestible for AI. Focus on clarity, direct answers, and logical flow.
        - \`aiOverviewSchema\`: Step 2: Building on the content structure, provide specific Schema Markup recommendations to technically describe the content to Google.
        - \`aiOverviewEEAT\`: Step 3: To finalize the strategy, list concrete ways to enhance Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T) signals, proving the content's credibility.

    4.  **Competitor Landscape Analysis:**
        - Identify the top 3 ranking competitors for the specific keyword "${keyword}" on Google.com.vn.
        - For each competitor, provide:
            - The \`competitorName\`.
            - A brief \`strategySummary\` of their content and approach specifically related to "${keyword}". Do not give a general summary of their entire website. Focus only on the content that ranks for this keyword.
            - A list of their \`strengths\` in how they specifically target "${keyword}" and its related user intent. For example, "They use a detailed cost calculator" or "Their article has testimonials".
            - A list of their \`weaknesses\` or content gaps Mcredit can exploit to outperform them for "${keyword}". For example, "Their information is outdated" or "They lack a clear call-to-action".

    All content must be in Vietnamese.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: contentStrategySchema
            }
        });
        
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error generating content strategy:", error);
        throw new Error("Failed to generate content strategy from Gemini API.");
    }
};

export const fetchKeywordDetails = async (keyword: string): Promise<KeywordDetails> => {
    const prompt = `Act as an SEO specialist for Mcredit in Vietnam. For the Vietnamese keyword "${keyword}", provide a detailed analysis. The output must be a single JSON object.
    
    1.  **User Intent Explanation:** In Vietnamese, elaborate on the user's specific goal, mindset, and what they expect to find.
    2.  **CPC Breakdown:** In Vietnamese, provide a more granular CPC estimate in Vietnamese Dong (VND). Include low and high range estimates and brief notes on bidding strategy or factors influencing the CPC.
    3.  **Related Keywords:** In Vietnamese, list 5 semantically related, long-tail keywords that target different facets of the user's need.
    4.  **Common Questions:** In Vietnamese, list 3 common questions users ask on Google related to this keyword.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: keywordDetailsSchema
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error(`Error fetching details for keyword "${keyword}":`, error);
        throw new Error("Failed to fetch keyword details from Gemini API.");
    }
};

export const estimateMetricsForBudget = async (budget: number, scenario: string): Promise<{ cpc: number; ctr: number; cvr: number; aov: number; }> => {
    const prompt = `Act as a senior digital marketing strategist for Mcredit, a consumer finance company in Vietnam.
    A campaign is being planned with a monthly budget of ${budget.toLocaleString('vi-VN')} VND.

    The specific scenario for this campaign is: "${scenario}"

    Based on this budget and scenario, provide a realistic and correlated estimation for the following key performance indicators (KPIs) for a Google Ads campaign in the Vietnamese consumer finance sector.

    Your estimations must be nuanced and reflect the specifics of the scenario:
    - If the scenario mentions a highly competitive niche (e.g., 'vay tiền nhanh'), the CPC should be higher.
    - If the scenario focuses on a specific, long-tail product (e.g., 'trả góp iPad Pro cho sinh viên'), CPC might be lower but CTR could be higher due to relevance.
    - If the goal is brand awareness, you might estimate a lower CVR compared to a conversion-focused campaign.
    - If the scenario targets a high-value product (e.g., high-end motorcycle loan), the AOV should be higher.
    - Correlate the metrics. For example, a higher budget for a broad target might increase CPC and lower CTR/CVR due to diminishing returns and less targeted audiences.

    Provide your expert estimation for:
    1.  **Cost Per Click (CPC)** in VND.
    2.  **Click-Through Rate (CTR)** as a percentage.
    3.  **Conversion Rate (CVR)** as a percentage.
    4.  **Average Revenue / Conversion (AOV)** in VND, representing the average loan value.
    
    The output must be a single JSON object with numeric values.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: estimatedMetricsSchema
            }
        });
        
        const jsonString = response.text.trim();
        const data = JSON.parse(jsonString);
        
        const validatedData = {
            cpc: Number(data.cpc) || 0,
            ctr: Number(data.ctr) || 0,
            cvr: Number(data.cvr) || 0,
            aov: Number(data.aov) || 0,
        };

        return validatedData;

    } catch (error) {
        console.error("Error estimating metrics:", error);
        throw new Error("Failed to estimate metrics from Gemini API.");
    }
};

export const generateIMCPlan = async (product: string, problem: string, audience: string, budget: number, budgetMethod: string): Promise<IMCPlan> => {
    const imcFrameworkKnowledge = `
    An IMC plan is an integrated marketing communications plan. It helps brands build campaigns methodically and consistently across multiple channels. The goal is to unite all marketing activities into a single, memorable, and consistent story at every customer touchpoint.

    The 6 steps to build an IMC plan are:
    1.  **Define Objectives**:
        *   **Business Objective**: Focuses on business growth aspects like increasing sales/profit or market share.
        *   **Marketing Objective**: Aims to change consumer behavior, focusing on factors like usage, frequency, or market penetration.
        *   **Communication Objective**: Targets changes in user perception, considering brand awareness, media quality, and channel effectiveness.

    2.  **Define Target Audience**: Segment customers based on:
        *   **Geographic**: Where they live (urban, rural, region).
        *   **Demographic**: Age, gender, occupation, income, marital status.
        *   **Psychographic**: Lifestyle, values, habits, interests.
        *   **Behavioral**: Purchase frequency, online shopping habits, product preferences.

    3.  **Find Insight**: Uncover the unspoken needs or dilemmas of the customer. Use the "Truth – Tension – Motivation" model.
        *   **Truth**: A simple, obvious fact about the consumer's life or the product category.
        *   **Tension**: A conflict, frustration, or unresolved problem the consumer feels related to the truth.
        *   **Motivation**: The consumer's underlying desire or goal that the brand can help them achieve.
        *   The combination of these reveals the core **Insight**.

    4.  **Develop the Big Idea**: A central, unifying message that addresses the insight and guides the entire campaign.
        *   It must be feasible and aligned with the brand's role.
        *   It is supported by a clear **Key Message** that is communicated consistently.

    5.  **Create a Deployment Plan**: Detail the execution of the Big Idea across different phases.
        *   Define phases (e.g., Pre-launch, Launch, Post-launch).
        *   For each phase, specify duration, budget, objectives, a **Key Hook** (main activity), and **Supporting Tactics** (other channels/activities).

    6.  **Allocate Budget & Define KPIs**:
        *   **KPIs**: Set measurable indicators to track success (e.g., Reach, Engagement, Brand Mentions, Conversions).
        *   **Budget Allocation**: Use either a **Top-down** approach (allocating a pre-set total budget) or a **Bottom-up** approach (calculating costs for required activities and summing them up).
    `;

    const prompt = `
    Act as a world-class Integrated Marketing Communications (IMC) strategist from Tomorrow Marketers. Your task is to create a comprehensive IMC plan for a Vietnamese company based on the user's input.
    
    You MUST strictly follow the 6-step framework and concepts detailed below.

    --- FRAMEWORK KNOWLEDGE ---
    ${imcFrameworkKnowledge}
    --- END OF FRAMEWORK KNOWLEDGE ---

    Now, use this framework to generate a detailed and actionable IMC plan based on the following user input:

    *   **Product/Brand**: ${product}
    *   **Business Problem/Goal**: ${problem}
    *   **Target Audience Description**: ${audience}
    *   **Total Campaign Budget**: ${budget > 0 ? budget.toLocaleString('vi-VN') + ' VND' : 'Not specified'}
    *   **Budgeting Method**: ${budgetMethod}

    Provide the output as a single, well-structured JSON object. The plan should be tailored for the Vietnamese market, with realistic and creative ideas. All qualitative content (like messages, ideas, descriptions) should be in Vietnamese, unless it's a technical term.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: imcPlanSchema
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error generating IMC plan:", error);
        throw new Error("Failed to generate IMC plan from Gemini API.");
    }
};
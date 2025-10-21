export interface Keyword {
  keyword: string;
  volume: 'High' | 'Medium' | 'Low';
  intent: string;
  cpc: string;
  competition: 'High' | 'Medium' | 'Low';
  semrushLink: string;
}

export interface KeywordDetails {
  intentExplanation: string;
  cpcBreakdown: {
    lowRangeVND: string;
    highRangeVND: string;
    notes: string;
  };
  relatedKeywords: string[];
  commonQuestions: string[];
}

export interface CategorizedKeywords {
    motorcycleLoanKeywords: Keyword[];
    phoneLoanKeywords: Keyword[];
    tabletLoanKeywords: Keyword[];
    cashLoanKeywords: Keyword[];
    customSearchKeywords: Keyword[];
}

export interface ContentPillarCluster {
    clusterTitle: string;
    userIntent: string;
    clusterDescription: string;
    suggestedFormat: string;
    specificKeywords: string[];
    draftContent: string;
}

export interface ContentPillar {
    pillarTitle: string;
    pillarDescription: string;
    contentAngle: string;
    clusterTopics: ContentPillarCluster[];
}

export interface Competitor {
  competitorName: string;
  strategySummary: string;
  strengths: string[];
  weaknesses: string[];
}

export interface KeywordUserIntent {
  intent: string;
  description: string;
  exampleQueries: string[];
}

export interface ContentStrategy {
  keywordUserIntents: KeywordUserIntent[];
  aiOverviewIntro: string;
  aiOverviewContent: string[];
  aiOverviewSchema: string[];
  aiOverviewEEAT: string[];
  contentPillars: ContentPillar[];
  competitorAnalysis: Competitor[];
}

export interface SavedStrategy extends ContentStrategy {
  id: string;
  keyword: string;
}

export interface MarketingMetrics {
  impressions: number;
  totalClicks: number;

  totalConversions: number;
  cpm: number;
  cpa: number;
  totalRevenue: number;
  roas: number;
}

export interface IMCPlan {
  objectives: {
    business: string;
    marketing: string;
    communication: string;
  };
  targetAudience: {
    summary: string;
    demographic: string;
    geographic: string;
    psychographic: string;
    behavioral: string;
  };
  consumerInsight: {
    truth: string;
    tension: string;
    motivation: string;
    insight: string;
  };
  bigIdea: {
    idea: string;
    keyMessage: string;
    brandRole: string;
  };
  deploymentPlan: Array<{
    phaseName: string;
    duration: string;
    objective: string;
    keyHook: string;
    supportingTactics: string[];
    keyMessage: string;
  }>;
  measurement: {
    kpis: Array<{
      metric: string;
      description: string;
      tool: string;
    }>;
    budgetAllocation: {
      approach: string;
      breakdown: Array<{
        channel: string;
        percentage: number;
        amount: string;
        rationale: string;
      }>;
    };
  };
}
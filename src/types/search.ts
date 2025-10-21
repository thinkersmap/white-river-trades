// Centralized types for search functionality

export interface TradeMatch {
  tradeName: string;
  matchScore: number;
  matchReason: string;
  estimatedPrice: {
    low: number;
    high: number;
    currency: string;
    notes: string;
  };
}

export interface ProjectStep {
  stepName: string;
  stepDescription: string;
  recommendedTrades: string[];
  estimatedPrice: {
    low: number;
    high: number;
    currency: string;
    notes: string;
  };
}

export interface SearchResult {
  intent: "problem" | "project";
  intentReason: string;
  overview: string;
  
  // For problems only
  recommendedTrade?: string;
  recommendationReason?: string;
  estimatedPrice?: {
    low: number;
    high: number;
    currency: string;
    notes: string;
  };
  matches?: TradeMatch[];
  
  // For projects only
  confidenceScore?: number;
  projectSteps?: ProjectStep[];
}

// API Response types
export interface SearchResponse {
  overview: string;
  recommendedTrade: string;
  recommendationReason: string;
  matches: TradeMatch[];
}

// Legacy types for backward compatibility (can be removed later)
export interface LegacySearchResult {
  overview: string;
  recommendedTrade: string;
  recommendationReason: string;
  estimatedPrice: {
    low: number;
    high: number;
    currency: string;
    notes: string;
  };
  matches: TradeMatch[];
}

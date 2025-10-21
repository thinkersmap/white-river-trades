// Utility for persisting search data across pages
export interface SearchData {
  problemDescription: string;
  aiAnalysis: string;
  selectedTrade: string;
  postcode?: string;
  division?: string;
  timestamp: number;
  // Project-specific data
  intent?: "problem" | "project";
  projectSteps?: Array<{
    stepName: string;
    stepDescription: string;
    recommendedTrades: string[];
    estimatedPrice: {
      low: number;
      high: number;
      currency: string;
      notes: string;
    };
  }>;
  confidenceScore?: number;
  overview?: string;
}

const SEARCH_DATA_KEY = 'white-river-search-data';

export function saveSearchData(data: Omit<SearchData, 'timestamp'>) {
  const searchData: SearchData = {
    ...data,
    timestamp: Date.now()
  };
  
  try {
    localStorage.setItem(SEARCH_DATA_KEY, JSON.stringify(searchData));
  } catch (error) {
    console.warn('Failed to save search data to localStorage:', error);
  }
}

export function getSearchData(): SearchData | null {
  try {
    const stored = localStorage.getItem(SEARCH_DATA_KEY);
    if (!stored) return null;
    
    const data = JSON.parse(stored) as SearchData;
    
    // Check if data is older than 24 hours
    const isExpired = Date.now() - data.timestamp > 24 * 60 * 60 * 1000;
    if (isExpired) {
      localStorage.removeItem(SEARCH_DATA_KEY);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Failed to get search data from localStorage:', error);
    return null;
  }
}

export function clearSearchData() {
  try {
    localStorage.removeItem(SEARCH_DATA_KEY);
  } catch (error) {
    console.warn('Failed to clear search data from localStorage:', error);
  }
}

export function updateSearchDataTrade(selectedTrade: string) {
  try {
    const existingData = getSearchData();
    if (existingData) {
      const updatedData: SearchData = {
        ...existingData,
        selectedTrade,
        timestamp: Date.now()
      };
      localStorage.setItem(SEARCH_DATA_KEY, JSON.stringify(updatedData));
    }
  } catch (error) {
    console.warn('Failed to update search data trade:', error);
  }
}

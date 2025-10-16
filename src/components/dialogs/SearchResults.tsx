import { trades } from '@/data/trades';
import { fbqTrack } from '@/lib/fbpixel';

interface TradeMatch {
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

interface SearchResult {
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

interface SearchResultsProps {
  isSearching: boolean;
  searchError: string | null;
  searchResults: SearchResult | null;
  setSelectedTrade: (trade: string) => void;
  setStep: (step: number) => void;
  elapsedTime: number;
  messageIndex: number;
  loadingMessages: string[];
}

export function SearchResults({
  isSearching,
  searchError,
  searchResults,
  setSelectedTrade,
  setStep,
  elapsedTime,
  messageIndex,
  loadingMessages,
}: SearchResultsProps) {
  if (isSearching) {
    return (
      <div className="space-y-8">
        {/* Analysis Loading */}
        <div>
          <div className="text-sm text-gray-400 font-medium mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
            AI ANALYSIS
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-100 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-gray-100 rounded animate-pulse w-11/12"></div>
            <div className="h-4 bg-gray-100 rounded animate-pulse w-10/12"></div>
          </div>
          <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
            <span>{loadingMessages[messageIndex]}</span>
            <span className="text-gray-400">({elapsedTime}s)</span>
          </div>
        </div>

        {/* Matching Trades Loading */}
        <div>
          <div className="text-sm text-gray-400 font-medium mb-4">RECOMMENDED TRADES</div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-100 rounded animate-pulse w-1/3"></div>
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-4/5"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (searchError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
        {searchError}
      </div>
    );
  }

  if (!searchResults) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* AI Analysis */}
      <div>
        <div className="text-sm text-gray-400 font-medium mb-3">AI ANALYSIS</div>
        <div className="bg-gradient-to-br from-purple-50/50 via-blue-50/30 to-purple-50/50 border border-purple-100/50 rounded-xl p-5 text-[15px] leading-relaxed text-gray-700">
          {searchResults.overview}
        </div>
      </div>

      {/* Matching Trades */}
      <div>
        <div className="text-sm text-gray-400 font-medium mb-4">RECOMMENDED TRADES</div>
        <div className="space-y-4">
          {searchResults.matches.map((match: TradeMatch) => {
            const trade = trades.find(t => t.name === match.tradeName);
            if (!trade) return null;
            
            const Icon = trade.icon;
            return (
              <div 
                key={trade.name}
                className="group border border-gray-200 rounded-xl overflow-hidden transition-all hover:border-gray-300 hover:shadow-sm"
              >
                <div className="p-4 space-y-4">
                  {/* Trade Header */}
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-gray-100 rounded-lg shrink-0 group-hover:bg-gray-200 transition-colors">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-medium text-gray-900">{trade.name}</h3>
                        <div className="px-2 py-0.5 bg-green-50 border border-green-200 rounded text-xs font-medium text-green-700">
                          {match.matchScore}% match
                        </div>
                      </div>
                      
                      {/* Price Range */}
                      {match.estimatedPrice && (
                        <div className="mb-2">
                          <span className="text-lg font-semibold text-gray-900">
                            {match.estimatedPrice.currency === 'GBP' ? '£' : '$'}
                            {match.estimatedPrice.low} - {match.estimatedPrice.currency === 'GBP' ? '£' : '$'}
                            {match.estimatedPrice.high}
                          </span>
                          {match.estimatedPrice.notes && (
                            <span className="ml-2 text-sm text-gray-500">
                              {match.estimatedPrice.notes}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* AI Analysis for this trade */}
                      <div className="bg-gradient-to-br from-purple-50/30 via-blue-50/20 to-purple-50/30 border border-purple-100/30 rounded-lg p-3 text-sm text-gray-600 leading-relaxed">
                        {match.matchReason}
                      </div>
                    </div>
                  </div>

                  {/* Select Button */}
                  <button 
                    onClick={() => {
                      setSelectedTrade(trade.name);
                      setStep(2);
                      
                      // Track TradeSelected event
                      fbqTrack('TradeSelected', {
                        content_name: trade.name,
                        content_category: 'trade',
                      });
                    }}
                    className="w-full px-4 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Select {trade.name}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
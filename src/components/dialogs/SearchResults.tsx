import { trades } from '@/data/trades';

interface SearchResultsProps {
  isSearching: boolean;
  searchError: string | null;
  searchResults: any; // TODO: Add proper type
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
            ANALYZING YOUR REQUEST
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
              <div className="h-4 bg-gray-100 rounded-full w-1/2"></div>
            </div>
          </div>
        </div>

        {/* Matching Loading */}
        <div>
          <div className="text-sm text-gray-400 font-medium mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
            FINDING RELEVANT TRADES
          </div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-gray-50/60 border border-gray-100 rounded-xl p-4">
                <div className="animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-gray-100 h-8 w-8 shrink-0"></div>
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="h-4 bg-gray-100 rounded-full w-1/4"></div>
                        <div className="h-4 bg-gray-100 rounded-full w-16"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-100 rounded-full w-full"></div>
                        <div className="h-3 bg-gray-100 rounded-full w-5/6"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-3 bg-gray-100 rounded-full w-20"></div>
                        <div className="h-3 bg-gray-100 rounded-full w-24"></div>
                        <div className="h-3 bg-gray-100 rounded-full w-16"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center space-y-2">
          <div className="text-sm text-gray-500 transition-opacity duration-500">
            {loadingMessages[messageIndex]}
          </div>
          <div className="text-xs text-gray-400">
            {elapsedTime > 0 && `${elapsedTime} seconds elapsed`}
          </div>
        </div>
      </div>
    );
  }

  if (searchError) {
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-100">
        <div className="text-sm text-red-600">
          {searchError}
        </div>
      </div>
    );
  }

  if (searchResults?.matches) {
    return (
      <>
        {/* Analysis Overview */}
        <div>
          <div className="text-sm text-gray-400 font-medium mb-3">AI ANALYSIS</div>
          <div className="bg-gradient-to-r from-purple-500/[0.1] to-blue-500/[0.1] rounded-lg p-6">
            <div className="text-base text-gray-600 leading-relaxed">
              {searchResults.overview}
            </div>
          </div>
        </div>

        {/* Matching Trades */}
        <div>
          <div className="text-sm text-gray-400 font-medium mb-4">RECOMMENDED TRADES</div>
          <div className="space-y-4">
            {searchResults.matches.map((match: any) => { // TODO: Add proper type
              const trade = trades.find(t => t.name === match.tradeName);
              if (!trade) return null;
              
              const Icon = trade.icon;
              return (
                <div 
                  key={trade.name}
                  className="group border border-gray-200 rounded-xl overflow-hidden transition-all hover:border-gray-300 hover:shadow-sm"
                >
                  <button 
                    onClick={() => {
                      setSelectedTrade(trade.name);
                      setStep(2);
                    }}
                    className="w-full text-left"
                  >
                    <div className="flex flex-col">
                      {/* Header */}
                      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-gray-50 rounded-lg shrink-0 group-hover:bg-white transition-colors">
                            <Icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="text-lg font-medium text-gray-900">{trade.name}</div>
                        </div>
                        <div className={`px-2.5 py-1 rounded-full text-sm font-medium ${
                          match.matchScore >= 80 ? 'bg-green-50 text-green-700' :
                          match.matchScore >= 50 ? 'bg-yellow-50 text-yellow-700' :
                          'bg-gray-50 text-gray-500'
                        }`}>
                          {match.matchScore}% match
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5 space-y-4">
                        {/* Description */}
                        <div className="text-base text-gray-600 leading-relaxed">{trade.description}</div>

                        {/* Match Reason */}
                        <div className="text-sm text-gray-600 leading-relaxed bg-gradient-to-r from-purple-500/[0.1] to-blue-500/[0.1] p-3 rounded-lg">{match.matchReason}</div>

                        {/* Price Box */}
                        <div className="bg-gray-50 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <div className="flex items-baseline gap-1.5">
                            <div className="text-2xl font-medium text-gray-900">£{match.estimatedPrice.low.toLocaleString()}</div>
                            <div className="text-gray-400">-</div>
                            <div className="text-2xl font-medium text-gray-900">£{match.estimatedPrice.high.toLocaleString()}</div>
                          </div>
                          <div className="text-sm text-gray-500">{match.estimatedPrice.notes}</div>
                        </div>

                        {/* Subcategories */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {trade.subcategories.map(sub => (
                            <span 
                              key={sub.slug}
                              className="inline-flex text-xs text-gray-600 bg-white border border-gray-200 px-2.5 py-1 rounded-lg group-hover:bg-gray-50 transition-colors"
                            >
                              {sub.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  return null;
}

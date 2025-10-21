import { trades, homeServices } from '@/data/trades';
import { fbqTrack } from '@/lib/fbpixel';
import { SearchResult, TradeMatch } from '@/types/search';

// Combine all work categories
const allWorkCategories = [...trades, ...homeServices];

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
      {/* Intent Classification */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            searchResults.intent === 'problem' 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {searchResults.intent === 'problem' ? '🔧 Problem' : '🏗️ Project'}
          </div>
          <div className="text-sm text-gray-500">{searchResults.intentReason}</div>
        </div>
      </div>

      {/* AI Analysis */}
      <div>
        <div className="text-sm text-gray-400 font-medium mb-3">AI ANALYSIS</div>
        <div className="bg-gradient-to-br from-purple-50/50 via-blue-50/30 to-purple-50/50 border border-purple-100/50 rounded-xl p-5 text-[15px] leading-relaxed text-gray-700">
          {searchResults.overview}
        </div>
      </div>

      {/* Problem Intent - Matching Trades */}
      {searchResults.intent === 'problem' && searchResults.matches && (
        <div>
          <div className="text-sm text-gray-400 font-medium mb-4">RECOMMENDED TRADES</div>
          <div className="space-y-4">
            {searchResults.matches.map((match: TradeMatch) => {
              const trade = allWorkCategories.find(t => t.name === match.tradeName);
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
                        
                        // Track SuggestedTradeSelected event
                        fbqTrack('SuggestedTradeSelected', {
                          content_name: trade.name,
                          content_category: 'trade',
                        });
                      }}
                      className="w-full px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Select {trade.name}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Project Intent - Enhanced Project Steps */}
      {searchResults.intent === 'project' && searchResults.projectSteps && (
        <div className="space-y-8">
          {/* Project Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-blue-700">PROJECT WORKFLOW</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Your Project Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Here&apos;s how your project will unfold, step by step. Each phase has specific trades and estimated costs.
            </p>
            {searchResults.confidenceScore && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  {searchResults.confidenceScore}% confidence match
                </span>
              </div>
            )}
          </div>

          {/* Enhanced Step Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-green-200"></div>
            
            <div className="space-y-8">
              {searchResults.projectSteps?.map((step, index) => (
                <div key={index} className="relative">
                  {/* Timeline Connector */}
                                      {searchResults.projectSteps && index < searchResults.projectSteps.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-8 bg-gradient-to-b from-blue-300 to-purple-300"></div>
                  )}
                  
                  {/* Step Card */}
                  <div className="relative ml-12">
                    <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                      {/* Step Header with Enhanced Design */}
                      <div className="p-8">
                        <div className="flex items-start gap-6 mb-6">
                          {/* Enhanced Step Number */}
                          <div className="flex-shrink-0 relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-lg">
                      {index + 1}
                    </div>
                            <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl opacity-20 blur-sm"></div>
                    </div>
                          
                          {/* Step Content */}
                          <div className="flex-1 space-y-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.stepName}</h3>
                              <p className="text-gray-600 leading-relaxed text-lg">{step.stepDescription}</p>
                  </div>

                            {/* Recommended Trades - Enhanced */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Required Trades</span>
                              </div>
                              <div className="flex flex-wrap gap-3">
                      {step.recommendedTrades.map((tradeName, tradeIndex) => {
                        const trade = allWorkCategories.find(t => t.name === tradeName);
                        if (!trade) return null;
                        const Icon = trade.icon;
                        return (
                          <div 
                            key={tradeIndex}
                                      className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors group/trade"
                                    >
                                      <div className="p-2 bg-white rounded-lg shadow-sm group-hover/trade:shadow-md transition-shadow">
                                        <Icon className="w-5 h-5 text-blue-600" />
                                      </div>
                                      <span className="font-medium text-gray-800">{tradeName}</span>
                          </div>
                        );
                      })}
                              </div>
                            </div>
                    </div>
                  </div>

                        {/* Enhanced Price Estimate */}
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Estimated Cost</div>
                              <div className="flex items-baseline gap-3">
                                <div className="text-3xl font-bold text-gray-900">£{step.estimatedPrice.low.toLocaleString()}</div>
                                <div className="text-gray-400 text-xl">-</div>
                                <div className="text-3xl font-bold text-gray-900">£{step.estimatedPrice.high.toLocaleString()}</div>
                              </div>
                              <div className="text-sm text-gray-500">{step.estimatedPrice.notes}</div>
                            </div>
                            <div className="text-right">
                              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs font-medium text-gray-600">Estimate</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Ready to Start Your Project?</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Each step will be handled by the right professionals. We&apos;ll connect you with trusted tradespeople for each phase.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Total phases: {searchResults.projectSteps.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { Dialog } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { DialogHeader } from '../shared/DialogHeader';
import { LocationStep } from './LocationStep';
import { trades } from '@/data/trades';
import { useState } from 'react';
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
  matches: Array<{
    tradeName: string;
    matchScore: number;
    matchReason: string;
    estimatedPrice: {
      low: number;
      high: number;
      currency: string;
      notes: string;
    };
  }>;
}

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  step: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchExamples: string[];
  placeholderIndex: number;
  isSearching: boolean;
  handleSearch: () => void;
  showResults: boolean;
  searchResults: SearchResult | null;
  searchError: string | null;
  setShowResults: (show: boolean) => void;
  setSearchResults: (results: SearchResult | null) => void;
  selectedTrade: string;
  setSelectedTrade: (trade: string) => void;
  setStep: (step: number) => void;
  elapsedTime: number;
  messageIndex: number;
  loadingMessages: string[];
}

type View = 'search' | 'trades' | 'location';

export function SearchDialog({
  isOpen,
  onClose,
  step,
  searchQuery,
  setSearchQuery,
  searchExamples,
  placeholderIndex,
  isSearching,
  handleSearch,
  showResults,
  searchResults,
  searchError,
  setShowResults,
  setSearchResults,
  selectedTrade,
  setSelectedTrade,
  setStep,
  elapsedTime,
  messageIndex,
  loadingMessages,
}: SearchDialogProps) {
  const [view, setView] = useState<View>('search');

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md" aria-hidden="true" />
      
      <div className="fixed inset-0 flex flex-col">
        <Dialog.Panel className="flex flex-col w-full h-full bg-white sm:h-[calc(100vh-80px)] sm:max-w-5xl sm:mx-auto sm:my-10 sm:rounded-lg">
          <DialogHeader
            onClose={onClose}
            onBack={view !== 'search' ? () => setView('search') : undefined}
            step={step}
            totalSteps={2}
          />

          <div className="flex-1 overflow-y-auto">
            {view === 'trades' ? (
              <div className="p-4 sm:p-6 space-y-8 sm:space-y-12">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 tracking-[-0.01em] mb-3">Available trades</h2>
                  <p className="text-base text-gray-500">Browse our selection of trusted local trades and services.</p>
                </div>

                {Array.from(new Set(trades.map(t => t.category))).map(category => (
                  <div key={category}>
                    <h3 className="text-sm font-medium text-gray-400 mb-4">{category}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {trades
                        .filter(trade => trade.category === category)
                        .map((trade) => {
                          const Icon = trade.icon;
                          return (
                            <div 
                              key={trade.name}
                              className={`
                                bg-gray-50/60 border border-gray-200/60 rounded-md overflow-hidden transition-all
                                ${!trade.available && 'opacity-60'}
                              `}
                            >
                              <button
                                onClick={() => {
                                  if (trade.available) {
                                    setSelectedTrade(trade.name);
                                    setStep(2);
                                    setView('location');
                                  }
                                }}
                                className={`
                                  w-full p-3 sm:p-4 text-left transition-all
                                  ${trade.available 
                                    ? 'hover:bg-gray-100/50 active:bg-gray-100' 
                                    : 'cursor-not-allowed'
                                  }
                                `}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="p-1.5 bg-gray-100 rounded-md shrink-0">
                                    <Icon className="w-4 h-4 text-gray-500" />
                                  </div>
                                  <div className="min-w-0 space-y-1.5 sm:space-y-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium text-gray-900">{trade.name}</span>
                                      {!trade.available && (
                                        <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Coming Soon</span>
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-600 line-clamp-2">{trade.description}</div>
                                    <div className="flex gap-1.5 flex-wrap">
                                      {trade.subcategories.slice(0, 2).map(sub => (
                                        <span 
                                          key={sub.slug}
                                          className="inline-flex text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded"
                                        >
                                          {sub.name}
                                        </span>
                                      ))}
                                      {trade.subcategories.length > 2 && (
                                        <span className="inline-flex text-[10px] text-gray-400">
                                          +{trade.subcategories.length - 2}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            ) : view === 'location' ? (
              <LocationStep
                selectedTrade={selectedTrade}
                tradeIcon={trades.find(t => t.name === selectedTrade)?.icon || (() => null)}
              />
            ) : (
              <div className="p-4 sm:p-6">
                <div className="max-w-2xl mx-auto space-y-8">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 tracking-[-0.01em] mb-3">Find a local trade</h2>
                    <p className="text-base text-gray-500">Describe your project or problem, and we&apos;ll match you with the right trade.</p>
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <MagnifyingGlassIcon className="w-5 h-5" />
                    </div>
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (!e.target.value) {
                          setShowResults(false);
                          setSearchResults(null);
                        }
                      }}
                      className="w-full pl-11 pr-[6.5rem] py-3 sm:py-4 text-base sm:text-lg text-gray-900 placeholder:text-gray-500 bg-gray-50 rounded-xl border border-gray-200/60 focus:outline-none focus:ring-2 focus:ring-black/5"
                      placeholder={searchExamples[placeholderIndex]}
                      onKeyDown={(e) => e.key === 'Enter' && searchQuery && handleSearch()}
                    />
                    <button
                      onClick={handleSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 sm:px-4 py-1.5 sm:py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!searchQuery || isSearching}
                    >
                      {isSearching ? 'Finding...' : 'Find'}
                    </button>
                  </div>

                  {/* Search Results */}
                  {(searchQuery || showResults) && (
                    <div className="mt-8 space-y-8">
                      {isSearching ? (
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
                      ) : searchError ? (
                        <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                          <div className="text-sm text-red-600">
                            {searchError}
                          </div>
                        </div>
                      ) : searchResults?.matches ? (
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
                              {searchResults.matches.map((match) => {
                                const trade = trades.find(t => t.name === match.tradeName);
                                if (!trade) return null;
                                
                                const Icon = trade.icon;
                                return (
                                  <div 
                                    key={trade.name}
                                    className="group border border-gray-200 rounded-xl overflow-hidden transition-all hover:border-gray-300 hover:shadow-sm"
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

                                        {/* Select Button */}
                                        <button 
                                          onClick={() => {
                                            setSelectedTrade(trade.name);
                                            setStep(2);
                                            setView('location');
                                          }}
                                          className="w-full px-4 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                          Select {trade.name}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                  )}

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-2 bg-white text-sm text-gray-500">or</span>
                    </div>
                  </div>

                   <button
                     onClick={() => setView('trades')}
                     className="w-full py-3 text-center text-sm text-gray-600 hover:text-gray-900"
                   >
                     Browse available trades →
                   </button>
                </div>
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { trades } from "@/data/trades";

const searchExamples = [
  "boiler won't turn on",
  "help looking after garden",
  "want to do a loft conversion",
  "need new kitchen fitted",
  "bathroom needs renovating",
  "looking for an electrician",
];

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [selectedTrade, setSelectedTrade] = useState("Roofing");
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showTrades, setShowTrades] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    overview: string;
    recommendedTrade: string;
    recommendationReason: string;
    matches: Array<{
      tradeName: string;
      matchScore: number;
      matchReason: string;
    }>;
  } | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const loadingMessages = [
    "Analyzing your request using AI to find the best matches...",
    "Searching through our database of trusted trades...",
    "Matching your needs with qualified professionals...",
    "Calculating match scores and relevance...",
    "Finding the perfect trade for your project...",
    "Almost there, finalizing recommendations..."
  ];

  // Timer effect for loading state
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let messageTimer: NodeJS.Timeout;

    if (isSearching) {
      setElapsedTime(0);
      setMessageIndex(0);
      
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);

      messageTimer = setInterval(() => {
        setMessageIndex(prev => (prev + 1) % loadingMessages.length);
      }, 3000);
    }

    return () => {
      clearInterval(timer);
      clearInterval(messageTimer);
    };
  }, [isSearching, loadingMessages.length]);

  const handleSearch = async () => {
    if (!searchQuery) return;
    
    setIsSearching(true);
    setShowResults(true);
    setSearchError(null);
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get search results');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setSearchResults(data);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchError(error instanceof Error ? error.message : 'Failed to get search results');
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((current) => (current + 1) % searchExamples.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      {/* Navigation Container */}
      <div className="bg-white">
        <nav className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-8 lg:gap-14">
            <div className="text-lg sm:text-xl font-semibold tracking-tight">White River</div>
            <div className="hidden md:flex items-center gap-6 lg:gap-9">
              <a href="#" className="text-[15px] text-gray-700 hover:text-gray-900 transition-colors">Solutions</a>
              <a href="#" className="text-[15px] text-gray-700 hover:text-gray-900 transition-colors">Industries</a>
              <a href="#" className="text-[15px] text-gray-700 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#" className="text-[15px] text-gray-700 hover:text-gray-900 transition-colors">Resources</a>
              <a href="#" className="text-[15px] text-gray-700 hover:text-gray-900 transition-colors">Company</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-700 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <a
              href="#"
              className="hidden md:block px-6 lg:px-7 py-2.5 bg-black text-white text-[15px] rounded-full hover:bg-gray-900 transition-all"
            >
              Get Started
            </a>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <div className="flex-1 p-4">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Hero Container */}
          <div className="bg-white rounded-[16px] flex items-center">
            <div className="px-6 sm:px-8 lg:px-16 py-12 lg:py-20 w-full">
              <div className="space-y-8 lg:space-y-10">
                {/* Avatar Stack */}
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-white ring-2 ring-gray-50 relative">
        <Image
                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                        alt={`Tradesperson ${i}`}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-gray-600 text-sm font-medium">
                    +28
                  </div>
                </div>

                <div>
                  <h1 className="text-4xl sm:text-5xl lg:text-[72px] leading-[1.1] font-normal tracking-[-0.02em] text-gray-900">
                    Need work done? Discover local services near you.
                  </h1>
                  <p className="mt-4 lg:mt-6 text-lg lg:text-xl text-gray-600 leading-relaxed max-w-[95%] lg:max-w-[90%]">
                    Tell us what you need done and where you are. We&apos;ll show local businesses ready to help. Use the searchbox below to get started.
                  </p>
                </div>

                <div className="relative max-w-2xl">
                  <div 
                    className="relative cursor-pointer group"
                    onClick={() => setIsOpen(true)}
                  >
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                      <MagnifyingGlassIcon className="w-6 h-6" />
                    </div>
                    <input
                      readOnly
                      type="text"
                      className="w-full pl-16 pr-6 py-5 text-lg bg-gray-50 rounded-2xl border border-gray-200/60 focus:outline-none group-hover:border-gray-300 group-hover:bg-white transition-all cursor-pointer shadow-sm"
                      placeholder={searchExamples[placeholderIndex]}
                    />
                  </div>
                </div>

                {/* Search Dialog */}
                <Dialog
                  open={isOpen}
                  onClose={() => setIsOpen(false)}
                  className="relative z-50"
                >
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-md" aria-hidden="true" />
                  
                  <div className="fixed inset-0 flex items-start justify-center sm:pt-10 lg:pt-20">
                    <Dialog.Panel className="w-full h-full sm:h-auto sm:max-h-[calc(100vh-80px)] max-w-5xl bg-white sm:rounded-lg overflow-hidden">
                      <div className="sticky top-0 z-10 bg-white flex items-center justify-between p-4 sm:p-6 border-b">
                        <div>
                          <h2 className="text-lg sm:text-xl font-medium text-gray-900">Find a local trade</h2>
                          <p className="text-sm text-gray-500 mt-1">Describe your project or problem, and we&apos;ll match you with the right trade.</p>
                        </div>
                          <div className="flex items-center gap-4">
                            <div className="hidden sm:flex gap-2">
                              <div className={`h-1 w-8 rounded-full transition-colors ${step >= 1 ? 'bg-black' : 'bg-gray-100'}`} />
                              <div className={`h-1 w-8 rounded-full transition-colors ${step >= 2 ? 'bg-black' : 'bg-gray-100'}`} />
        </div>
                          <button 
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                        {step === 1 ? (
                          <div className="p-6">
                            <div className="max-w-2xl mx-auto space-y-8">
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
                                  className="w-full pl-11 pr-[6.5rem] py-3 sm:py-4 text-base sm:text-lg bg-gray-50 rounded-xl border border-gray-200/60 focus:outline-none focus:ring-2 focus:ring-black/5"
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
                                  ) : searchResults && searchResults.matches ? (
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
                                                className="group hover:bg-gray-50/80 border border-gray-200 rounded-xl mx-0.5 px-4 sm:px-6 py-4 sm:py-6 transition-all hover:border-gray-300"
                                              >
                                                <button 
                                                  onClick={() => {
                                                    setSelectedTrade(trade.name);
                                                    setStep(2);
                                                  }}
                                                  className="w-full text-left"
                                                >
                                                  <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-gray-50 rounded-xl shrink-0 group-hover:bg-white transition-colors">
                                                      <Icon className="w-6 h-6 text-gray-600" />
                                                    </div>
                                                    <div className="min-w-0 space-y-4 flex-1">
                                                      <div>
                                                        <div className="flex items-center justify-between gap-4 mb-2">
                                                          <div className="text-lg font-medium text-gray-900">{trade.name}</div>
                                                          <div className={`text-sm font-medium ${
                                                            match.matchScore >= 80 ? 'text-green-600' :
                                                            match.matchScore >= 50 ? 'text-yellow-600' :
                                                            'text-gray-400'
                                                          }`}>
                                                            {match.matchScore}% match
                                                          </div>
                                                        </div>
                                                        <div className="text-base text-gray-600 leading-relaxed">{trade.description}</div>
                                                      </div>

                                                      <div className="space-y-4">
                                                        <div className="text-sm text-gray-600 leading-relaxed bg-gradient-to-r from-purple-500/[0.1] to-blue-500/[0.1] p-3 rounded-lg">{match.matchReason}</div>
                                                        
                                                        <div className="flex flex-wrap gap-2">
                                                          {trade.subcategories.map(sub => (
                                                            <span 
                                                              key={sub.slug}
                                                              className="inline-flex text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg group-hover:bg-gray-100 transition-colors"
                                                            >
                                                              {sub.name}
                                                            </span>
                                                          ))}
                                                        </div>
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
                                onClick={() => setShowTrades(!showTrades)}
                                className="w-full py-3 text-center text-sm text-gray-600 hover:text-gray-900"
                              >
                                Browse available trades →
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-6">
                            <div className="max-w-2xl mx-auto space-y-8">
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => setStep(1)}
                                  className="text-sm text-gray-500 hover:text-gray-900 -ml-1 px-1 flex items-center gap-1"
                                >
                                  <span className="text-lg">←</span>
                                  <span>Back to search</span>
                                </button>
                                <div className="h-4 border-r border-gray-200"></div>
                                <div className="text-sm text-gray-500">
                                  Selected trade: <span className="text-gray-900 font-medium">{selectedTrade}</span>
                                </div>
                              </div>

                              <div>
                                <h2 className="text-xl font-medium text-gray-900 mb-2">Where are you located?</h2>
                                <p className="text-sm text-gray-500">Enter your postcode to find local trades in your area.</p>
                              </div>

                              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <div className="space-y-6">
                                  <div>
                                    <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-2">
                                      Postcode
                                    </label>
                                    <input
                                      id="postcode"
                                      autoFocus
                                      type="text"
                                      className="w-full px-4 py-3 text-base bg-white rounded-lg border border-gray-200/60 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-colors"
                                      placeholder="e.g. SW1A 1AA"
                                    />
                                  </div>

                                  <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                    </div>
                                    Your postcode is only used to match you with local trades
                                  </div>
                                </div>
                              </div>

                              <div className="pt-4 pb-8">
                                <button 
                                  className="w-full py-4 bg-black text-white text-base font-medium rounded-xl hover:bg-gray-900 transition-colors"
                                >
                                  Find local trades
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Dialog.Panel>
                  </div>
                </Dialog>

                {/* Browse Trades Dialog */}
                <Dialog
                  open={showTrades}
                  onClose={() => setShowTrades(false)}
                  className="relative z-50"
                >
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-md" aria-hidden="true" />
                  
                  <div className="fixed inset-0 flex items-start justify-center pt-20">
                    <Dialog.Panel className="w-full max-w-5xl bg-white rounded-lg">
                      <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-xl font-medium text-gray-900">Available trades</h2>
                        <button 
                          onClick={() => setShowTrades(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          ✕
                        </button>
                      </div>
                      
                      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                        <div className="p-6 space-y-12">
                          {/* Group trades by category */}
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
                                              setSearchQuery(trade.name.toLowerCase());
                                              setShowTrades(false);
                                              setStep(2);
                                            }
                                          }}
                                          className={`
                                            w-full p-4 text-left transition-all
                                            ${trade.available 
                                              ? 'hover:bg-gray-100/50' 
                                              : 'cursor-not-allowed'
                                            }
                                          `}
                                        >
                                          <div className="flex items-start gap-3">
                                            <div className="p-1.5 bg-gray-100 rounded-md shrink-0">
                                              <Icon className="w-4 h-4 text-gray-500" />
                                            </div>
                                            <div className="min-w-0 space-y-2">
                                              <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-900">{trade.name}</span>
                                                {!trade.available && (
                                                  <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Coming Soon</span>
                                                )}
                                              </div>
                                              <div className="text-xs text-gray-500 line-clamp-2">{trade.description}</div>
                                              <div className="flex gap-1.5 flex-wrap">
                                                {trade.subcategories.slice(0, 3).map(sub => (
                                                  <span 
                                                    key={sub.slug}
                                                    className="inline-flex text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded"
                                                  >
                                                    {sub.name}
                                                  </span>
                                                ))}
                                                {trade.subcategories.length > 3 && (
                                                  <span className="inline-flex text-[10px] text-gray-400">
                                                    +{trade.subcategories.length - 3}
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
                      </div>
                    </Dialog.Panel>
                  </div>
                </Dialog>

                {/* Stats */}
                <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 pt-6">
                  <div>
                    <div className="text-3xl sm:text-4xl lg:text-[48px] leading-none font-normal text-gray-900">20+</div>
                    <div className="mt-2 sm:mt-3 text-sm sm:text-[15px] text-gray-500 font-medium">
                      Trusted tradespeople<br/>registered this month
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl lg:text-[48px] leading-none font-normal text-gray-900">4K+</div>
                    <div className="mt-2 sm:mt-3 text-sm sm:text-[15px] text-gray-500 font-medium">
                      Customer reviews<br/>from Britain
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Container */}
          <div className="bg-[#e8eaed] rounded-[16px] overflow-hidden min-h-[400px]">
            <div className="relative w-full h-full min-h-[400px]">
          <Image
                src="/images/roofer.png"
                alt="Skilled roofer working on a roof"
                fill
                priority
                className="object-cover scale-125"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
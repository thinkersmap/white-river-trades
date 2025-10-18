"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navigation } from "@/components/home/Navigation";
import { Hero } from "@/components/home/Hero";
import { SearchDialog } from "@/components/dialogs/SearchDialog";
import { TradesDialog } from "@/components/dialogs/TradesDialog";
import { FinalCTA } from "@/components/shared/FinalCTA";
import { saveSearchData, clearSearchData, getSearchData } from "@/lib/searchData";
import { fbqTrack } from "@/lib/fbpixel";

const searchExamples = [
  "boiler won't turn on",
  "help looking after garden",
  "want to do a loft conversion",
  "need new kitchen fitted",
  "bathroom needs renovating",
  "looking for an electrician",
];
// Stable demo phrases for the step 1 typing animation
const TYPING_PHRASES = [
  "my boiler won't turn on",
  "leaking tap under sink",
  "need socket installed",
  "garden fence repair"
];
// Stable postcode samples for step 3
const POSTCODE_SAMPLES = [
  { postcode: 'KT1 1AA', slug: 'kingston-and-surbiton', name: 'Kingston and Surbiton' },
  { postcode: 'SW19 1AB', slug: 'wimbledon', name: 'Wimbledon' },
  { postcode: 'SW15 2AB', slug: 'putney', name: 'Putney' },
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
  } | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [stepsActive, setStepsActive] = useState(0);
  const stepRefs = useRef<HTMLDivElement[]>([]);
  const [stepHeights, setStepHeights] = useState<number[]>([]);

  // Function to measure maximum content height for each step
  const measureStepHeights = () => {
    const heights: number[] = [];
    stepRefs.current.forEach((stepRef, index) => {
      if (stepRef) {
        // Store original styles
        const originalMinHeight = stepRef.style.minHeight;
        const originalHeight = stepRef.style.height;
        
        // Temporarily remove all height constraints
        stepRef.style.minHeight = 'auto';
        stepRef.style.height = 'auto';
        stepRef.style.maxHeight = 'none';
        
        // Force a reflow to get accurate measurements
        void stepRef.offsetHeight;
        
        // Measure the natural height of all content
        const rect = stepRef.getBoundingClientRect();
        const naturalHeight = rect.height;
        
        // Also measure the scroll height to catch any overflow
        const scrollHeight = stepRef.scrollHeight;
        const maxHeight = Math.max(naturalHeight, scrollHeight);
        
        // Use the larger of current height or measured height to maintain stretched size
        const currentHeight = stepRef.offsetHeight;
        const measuredHeight = Math.max(maxHeight, currentHeight);
        
        // Add padding for breathing room and ensure minimum height
        // Use smaller minimum heights on mobile
        const isMobile = window.innerWidth < 640; // sm breakpoint
        const minHeight = isMobile ? 400 : 600; // Larger minimum heights for new design
        const paddedHeight = Math.max(measuredHeight + 48, minHeight);
        heights[index] = paddedHeight;
        
        // Restore original styles
        stepRef.style.minHeight = originalMinHeight;
        stepRef.style.height = originalHeight;
        stepRef.style.maxHeight = '';
      }
    });
    setStepHeights(heights);
  };

  // Measure heights after component mounts and when content changes
  useEffect(() => {
    // Multiple measurement attempts to catch different animation states
    const measureMultipleTimes = () => {
      measureStepHeights();
      
      // Measure again after a longer delay to catch all animation states
      setTimeout(() => {
        measureStepHeights();
      }, 2000);
      
      // Final measurement after all animations should be complete
      setTimeout(() => {
        measureStepHeights();
      }, 5000);
    };

    const timer = setTimeout(measureMultipleTimes, 500);
    return () => clearTimeout(timer);
  }, []);

  // Re-measure when window resizes
  useEffect(() => {
    const handleResize = () => {
      measureStepHeights();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    
    console.log('handleSearch called with query:', searchQuery);
    console.log('Current search data before clearing:', getSearchData());
    
    // Clear any existing search data when starting a new search
    clearSearchData();
    
    console.log('Search data after clearing:', getSearchData());
    
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
      
      console.log('Saving new search data:', {
        problemDescription: searchQuery,
        aiAnalysis: data.overview,
        selectedTrade: data.recommendedTrade
      });
      
      // Track Facebook Search event (on successful results)
      fbqTrack('Search', {
        search_string: searchQuery,
        content_category: data.recommendedTrade,
      });

      // Save search data for use in other pages
      saveSearchData({
        problemDescription: searchQuery,
        aiAnalysis: data.overview,
        selectedTrade: data.recommendedTrade
      });
      
      console.log('Search data after saving:', getSearchData());
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

  const handleSelectTrade = (tradeName: string) => {
    console.log('handleSelectTrade called with:', tradeName);
    console.log('Current search data before clearing:', getSearchData());
    
    // Clear existing search data when selecting a different trade
    clearSearchData();
    
    console.log('Search data after clearing:', getSearchData());
    
    setSelectedTrade(tradeName);
    setSearchQuery(tradeName.toLowerCase());
    setShowTrades(false);
    setStep(2);
    
    console.log('handleSelectTrade: No event fired here - events should be fired by individual components');
  };

  // Scroll spy for steps (now 3 steps instead of 5)
  useEffect(() => {
    let raf = 0;
    const handler = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const sections = stepRefs.current.filter(Boolean);
        if (!sections.length) return;
        const viewportCenter = window.innerHeight / 2;
        let bestIdx = 0;
        let bestDist = Infinity;
        sections.forEach((el, idx) => {
          const rect = el.getBoundingClientRect();
          const sectionCenter = rect.top + rect.height / 2;
          const dist = Math.abs(sectionCenter - viewportCenter);
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = idx;
          }
        });
        if (bestIdx !== stepsActive && bestIdx < 3) setStepsActive(bestIdx);
      });
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, [stepsActive]);

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      <Navigation />
      <Hero 
        onSearch={() => {
          setIsOpen(true);
          // Track SearchOpened event when search dialog is opened from Hero
          fbqTrack('SearchOpened', {
            content_name: 'search_dialog_opened',
            content_category: 'search',
          });
        }}
        searchExamples={searchExamples}
        placeholderIndex={placeholderIndex}
      />

      {/* Horizontal Trades (after hero) - Hidden for now */}
      {/* <div className="px-4 pt-6">
        <div className="max-w-[120rem] mx-auto overflow-x-auto">
          <ul className="flex items-stretch gap-3 min-w-full pr-2">
            {['Roofing','Plumbing','Electrical','Carpentry','Painting','Gardening','Cleaning'].map((name) => (
              <li key={name} className="min-w-[220px] sm:min-w-[240px] bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="h-40 rounded-xl bg-gray-100 mb-4"></div>
                <div className="text-base font-medium text-gray-900">{name}</div>
              </li>
            ))}
          </ul>
              </div>
            </div> */}

      {/* Process Steps Section */}
      <section className="flex-1 p-4 py-16 lg:py-24 relative">
        <div className="h-full grid grid-cols-1 gap-4">
            <StepsScrollSections stepRefs={stepRefs} stepHeights={stepHeights} />
        </div>
      </section>

      <FinalCTA 
        onSearch={() => {
          setIsOpen(true);
          // Track SearchOpened event when search dialog is opened from FinalCTA
          fbqTrack('SearchOpened', {
            content_name: 'search_dialog_opened',
            content_category: 'search',
          });
        }}
      />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/10">
        <div className="max-w-[120rem] mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">
              © 2024 White River Trades
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-white/60 hover:text-white text-sm transition-colors">Privacy</Link>
              <Link href="/terms" className="text-white/60 hover:text-white text-sm transition-colors">Terms</Link>
              <Link href="/contact" className="text-white/60 hover:text-white text-sm transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>

      <SearchDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        step={step}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchExamples={searchExamples}
        placeholderIndex={placeholderIndex}
        isSearching={isSearching}
        handleSearch={handleSearch}
        showResults={showResults}
        searchResults={searchResults}
        searchError={searchError}
        setShowResults={setShowResults}
        setSearchResults={setSearchResults}
        selectedTrade={selectedTrade}
        setSelectedTrade={setSelectedTrade}
        setStep={setStep}
        elapsedTime={elapsedTime}
        messageIndex={messageIndex}
        loadingMessages={loadingMessages}
      />

      <TradesDialog
        isOpen={showTrades}
        onClose={() => setShowTrades(false)}
        onBackToSearch={() => {
          setShowTrades(false);
          setIsOpen(true);
        }}
        onSelectTrade={handleSelectTrade}
      />
    </div>
  );
}


// Three main steps that reveal on scroll
function StepsScrollSections({ stepRefs, stepHeights }: { stepRefs: React.MutableRefObject<HTMLDivElement[]>; stepHeights: number[] }) {
  const [expandedHeights, setExpandedHeights] = useState<number[]>([]);
  const expandedHeightsRef = useRef<number[]>([]);
  
  const cards = [
    {
      title: 'Describe your problem and get AI-powered recommendations',
      sub: 'Tell us what you need done and our AI will analyze your request to suggest the best trades for the job.',
      tone: 'from-sky-500/20 via-cyan-400/10 to-indigo-500/20',
      stepNumber: '01',
    },
    {
      title: 'Connect to your local area and submit your details',
      sub: 'We automatically match you to the right local division and collect your contact information to get started.',
      tone: 'from-emerald-500/20 via-teal-400/10 to-cyan-500/20',
      stepNumber: '02',
    },
    {
      title: 'Receive quotes and confirm your job',
      sub: 'Compare options from qualified trades and choose the one that fits your budget and timeline best.',
      tone: 'from-violet-500/20 via-indigo-400/10 to-blue-500/20',
      stepNumber: '03',
    },
  ];

  // Track when elements expand and maintain that height to prevent layout shifts
  useEffect(() => {
    const updateExpandedHeights = () => {
      const newHeights = stepRefs.current.map((ref, index) => {
        if (ref) {
          const currentHeight = ref.offsetHeight;
          const currentExpanded = expandedHeightsRef.current[index] || 0;
          // Only update if the current height is larger than what we've seen before
          return Math.max(currentHeight, currentExpanded);
        }
        return expandedHeightsRef.current[index] || 0;
      });
      expandedHeightsRef.current = newHeights;
      setExpandedHeights(newHeights);
    };

    // Update heights when stepHeights change (elements become visible)
    updateExpandedHeights();

    // Use ResizeObserver to track height changes and maintain expanded state
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const index = stepRefs.current.findIndex(ref => ref === entry.target);
        if (index !== -1) {
          const newHeight = entry.contentRect.height;
          const currentExpanded = expandedHeightsRef.current[index] || 0;
          const maxHeight = Math.max(currentExpanded, newHeight);
          
          if (maxHeight > currentExpanded) {
            expandedHeightsRef.current[index] = maxHeight;
            setExpandedHeights(prev => {
              const newHeights = [...prev];
              newHeights[index] = maxHeight;
              return newHeights;
            });
          }
        }
      });
    });

    // Observe all step refs
    stepRefs.current.forEach(ref => {
      if (ref) resizeObserver.observe(ref);
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, [stepHeights, stepRefs]);
  return (
    <>
      {cards.map((card, idx) => (
        <motion.section
          key={card.title}
          ref={(el: HTMLDivElement | null) => { if (el) stepRefs.current[idx] = el; }}
          data-step-idx={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: '-20% 0px -20% 0px', once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`relative overflow-hidden rounded-[16px] p-6 sm:p-8 lg:p-16 text-white bg-slate-950 ring-1 ring-white/10`}
          style={{
            minHeight: expandedHeights[idx] ? `${expandedHeights[idx]}px` : 
              stepHeights[idx] ? `${stepHeights[idx]}px` :
              idx === 0 ? '24rem' : 
              idx === 1 ? '28rem' :
              '26rem',
            height: 'auto',
            transition: 'min-height 0.3s ease-out, height 0.3s ease-out'
          }}
        >
          {/* Gradient wash */}
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.tone} rounded-[16px]`} />
          {/* Soft radial glows */}
          <div className="hidden sm:block pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="hidden sm:block pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

          <div className="relative h-full flex flex-col">
            <div className="flex-shrink-0">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-lg">
                  {card.stepNumber}
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight">{card.title}</h3>
              <p className="mt-3 text-base sm:text-lg text-white/80 max-w-4xl">{card.sub}</p>
            </div>

             {/* Media placeholder or animation - fills remaining height after header */}
             <div 
               className="mt-12 transition-all duration-500 ease-out flex-1 flex flex-col"
               style={{
                 minHeight: '24rem',
                 transition: 'min-height 0.5s ease-out',
                 contain: 'layout style'
               }}
             >
              {idx === 0 ? (
                <div className="flex flex-col justify-center h-full">
                  <SearchToAnalysisAnimation phrases={TYPING_PHRASES} />
                </div>
              ) : idx === 1 ? (
                <div className="flex flex-col justify-center h-full">
                  <LocationToContactAnimation />
                </div>
              ) : idx === 2 ? (
                <div className="flex flex-col justify-center h-full">
                <QuoteSkeletonAnimation />
                </div>
              ) : (
                <div className="h-full rounded-2xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10"></div>
              )}
            </div>
          </div>
        </motion.section>
      ))}
    </>
  );
}



// Consolidated Step 1: Search to Analysis flow
function SearchToAnalysisAnimation({ phrases }: { phrases: string[] }) {
  const [phase, setPhase] = useState<'searching' | 'analyzing' | 'results'>('searching');
  const [typed, setTyped] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const currentPhrase = phrases[phraseIdx % phrases.length];

  // Generate relevant analysis + recommendations per query
  const ctx = (() => {
    const q = currentPhrase.toLowerCase();
    if (q.includes('boiler') || q.includes('hot') || q.includes("won't turn on")) {
      return {
        analysis: 'Likely boiler ignition or pressure fault. Check pressure, pilot/ignition and valves. A Gas Engineer can diagnose safely.',
        recs: [
          { trade: 'Gas Engineer', match: 0.95, tone: 'from-sky-400 to-cyan-300' },
          { trade: 'HVAC Specialist', match: 0.86, tone: 'from-violet-400 to-indigo-300' },
          { trade: 'Plumber', match: 0.78, tone: 'from-emerald-400 to-teal-300' }
        ],
      } as const;
    }
    if (q.includes('tap') || q.includes('leak')) {
      return {
        analysis: 'Localised plumbing leak. Likely failed washer, cartridge or seal. Shut off water if severe. A Plumber can repair swiftly.',
        recs: [
          { trade: 'Plumber', match: 0.94, tone: 'from-emerald-400 to-teal-300' },
          { trade: 'Handyperson', match: 0.82, tone: 'from-amber-400 to-orange-300' },
          { trade: 'Gas Engineer', match: 0.72, tone: 'from-sky-400 to-cyan-300' }
        ],
      } as const;
    }
    if (q.includes('socket') || q.includes('plug') || q.includes('outlet')) {
      return {
        analysis: 'New socket installation or circuit extension required. An Electrician will assess load and certify work.',
        recs: [
          { trade: 'Electrician', match: 0.96, tone: 'from-indigo-400 to-blue-300' },
          { trade: 'HVAC Specialist', match: 0.80, tone: 'from-violet-400 to-indigo-300' },
          { trade: 'Plumber', match: 0.68, tone: 'from-emerald-400 to-teal-300' }
        ],
      } as const;
    }
    if (q.includes('fence') || q.includes('garden')) {
      return {
        analysis: 'Timber fencing repair or panel replacement. A Carpenter can fix posts/panels; for larger works consider a Landscaper.',
        recs: [
          { trade: 'Carpenter', match: 0.92, tone: 'from-amber-400 to-orange-300' },
          { trade: 'Landscaper', match: 0.84, tone: 'from-emerald-400 to-teal-300' },
          { trade: 'Handyperson', match: 0.76, tone: 'from-sky-400 to-cyan-300' }
        ],
      } as const;
    }
    // Default fallback
    return {
      analysis: 'We matched your request with the most relevant trades based on similar jobs in your area.',
      recs: [
        { trade: 'Plumber', match: 0.9, tone: 'from-emerald-400 to-teal-300' },
        { trade: 'Electrician', match: 0.85, tone: 'from-indigo-400 to-blue-300' },
        { trade: 'Carpenter', match: 0.8, tone: 'from-amber-400 to-orange-300' }
      ],
    } as const;
  })();

  useEffect(() => {
    let t1: number | undefined;
    let t2: number | undefined;
    let t3: number | undefined;

    if (phase === 'searching') {
      setTyped('');
      let i = 0;
      t1 = window.setInterval(() => {
        if (i < currentPhrase.length) {
          setTyped(currentPhrase.slice(0, i + 1));
          i += 1;
        } else {
          window.clearInterval(t1);
          t2 = window.setTimeout(() => setPhase('analyzing'), 800);
        }
      }, 60);
    } else if (phase === 'analyzing') {
      t1 = window.setTimeout(() => setPhase('results'), 2000);
    } else if (phase === 'results') {
      t1 = window.setTimeout(() => {
        setPhraseIdx((p) => (p + 1) % phrases.length);
        setPhase('searching');
      }, 4000);
    }

    return () => {
      window.clearInterval(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [phase, currentPhrase, phrases.length]);

  return (
    <div className="flex-1 w-full rounded-2xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl space-y-6">
        {/* Search bar */}
        <div className="relative rounded-xl bg-white text-gray-900 shadow-sm">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input readOnly value={typed} className="w-full pl-10 pr-4 py-4 rounded-xl bg-white text-gray-900" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {phase === 'analyzing' && (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin motion-reduce:animate-none" />
            )}
          </div>
        </div>

        {/* Analyzing context */}
        {phase === 'analyzing' && (
          <div className="bg-white/5 ring-1 ring-white/10 rounded-xl p-4 flex items-center justify-between">
            <div className="text-sm text-white/80">Analyzing your request with AI…</div>
            <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin motion-reduce:animate-none" />
          </div>
        )}

        {/* Results */}
        {phase === 'results' && (
          <div className="space-y-4">
            <div className="bg-white/5 ring-1 ring-white/10 rounded-xl p-5 text-sm leading-relaxed text-white/85">
              {ctx.analysis}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {ctx.recs.map((r, i) => (
                <div key={r.trade} className={`rounded-xl ring-1 ring-white/10 p-4 ${i === 0 ? 'bg-white/7' : 'bg-white/3 opacity-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className={`font-medium text-sm ${i === 0 ? 'text-white' : 'text-white/60'}`}>{r.trade}</div>
                    <div className={`text-xs px-2 py-0.5 rounded-full ${i === 0 ? `text-white/90 bg-gradient-to-r ${r.tone}` : 'text-white/50 bg-white/10'}`}>
                      {Math.round(r.match * 100)}%
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full ${i === 0 ? `bg-gradient-to-r ${r.tone}` : 'bg-white/20'}`} 
                      style={{ width: `${r.match * 100}%`, transition: 'width 600ms ease' }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Consolidated Step 2: Location to Contact flow - Ultra Simple
function LocationToContactAnimation() {
  const [phase, setPhase] = useState<'searching' | 'loading' | 'map' | 'submitting' | 'complete'>('searching');
  const [sampleIdx, setSampleIdx] = useState(0);
  const current = POSTCODE_SAMPLES[sampleIdx % POSTCODE_SAMPLES.length];
  const [typed, setTyped] = useState('');
  const [pathData, setPathData] = useState<string>('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [typingField, setTypingField] = useState<'name' | 'email' | 'phone' | null>(null);

  // Convert GeoJSON to simple SVG path
  const geojsonToPath = (geometry: { type: string; coordinates: number[][][] | number[][][][] }, width = 400, height = 300) => {
    if (!geometry || !geometry.coordinates) return '';
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const walk = (coords: number[] | number[][] | number[][][]) => {
      if (Array.isArray(coords[0])) {
        (coords as (number[] | number[][] | number[][][])[]).forEach(walk);
      } else {
        const [x, y] = coords as number[];
        minX = Math.min(minX, x); minY = Math.min(minY, y);
        maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
      }
    };
    walk(geometry.coordinates as number[] | number[][] | number[][][]);
    if (!isFinite(minX)) return '';
    const scale = Math.min(width / (maxX - minX), height / (maxY - minY)) * 0.9;
    const offX = (width - (maxX - minX) * scale) / 2;
    const offY = (height - (maxY - minY) * scale) / 2;
    const ringToPath = (ring: number[][]) => ring.map(([x, y]) => `${(x - minX) * scale + offX},${height - ((y - minY) * scale + offY)}`).join(' ');
    if (geometry.type === 'Polygon') {
      return (geometry.coordinates as number[][][]).map((ring) => `M ${ringToPath(ring)} Z`).join(' ');
    }
    if (geometry.type === 'MultiPolygon') {
      return (geometry.coordinates as number[][][][]).map(poly => poly.map((ring) => `M ${ringToPath(ring)} Z`).join(' ')).join(' ');
    }
    return '';
  };

  useEffect(() => {
    let t1: NodeJS.Timeout | undefined;
    let t2: NodeJS.Timeout | undefined;
    let t3: NodeJS.Timeout | undefined;

    if (phase === 'searching') {
      setTyped('');
      setPathData('');
      setContactForm({ name: '', email: '', phone: '' });
      setTypingField(null);
      let i = 0;
      t1 = setInterval(() => {
        if (i < current.postcode.length) {
          setTyped(current.postcode.slice(0, i + 1));
          i += 1;
        } else {
          clearInterval(t1);
          // Pause before moving to loading
          t2 = setTimeout(() => setPhase('loading'), 1500);
        }
      }, 120);
    } else if (phase === 'loading') {
      // Brief loading state
      t1 = setTimeout(() => {
        setPhase('map');
      }, 800);
    } else if (phase === 'map') {
      // Fetch boundary data
      (async () => {
        try {
          const res = await fetch(`/data/constituencies/${current.slug}.geojson`);
          if (res.ok) {
            const gj = await res.json();
            const p = geojsonToPath(gj.geometry, 400, 300);
            setPathData(p);
          } else {
            setPathData('');
          }
        } catch { setPathData(''); }
      })();
      
      // Animate contact form filling with typewriter effect while map is pinging
      const contactData = {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '020 7123 4567'
      };
      
      // Type name
      t1 = setTimeout(() => {
        setTypingField('name');
        let i = 0;
        const nameInterval = setInterval(() => {
          if (i < contactData.name.length) {
            setContactForm(prev => ({ ...prev, name: contactData.name.slice(0, i + 1) }));
            i += 1;
          } else {
            clearInterval(nameInterval);
            setTypingField(null);
          }
        }, 80);
      }, 500);
      
      // Type email
      t2 = setTimeout(() => {
        setTypingField('email');
        let i = 0;
        const emailInterval = setInterval(() => {
          if (i < contactData.email.length) {
            setContactForm(prev => ({ ...prev, email: contactData.email.slice(0, i + 1) }));
            i += 1;
          } else {
            clearInterval(emailInterval);
            setTypingField(null);
          }
        }, 60);
      }, 1500);
      
      // Type phone
      t3 = setTimeout(() => {
        setTypingField('phone');
        let i = 0;
        const phoneInterval = setInterval(() => {
          if (i < contactData.phone.length) {
            setContactForm(prev => ({ ...prev, phone: contactData.phone.slice(0, i + 1) }));
            i += 1;
          } else {
            clearInterval(phoneInterval);
            setTypingField(null);
          }
        }, 100);
      }, 2500);
      
      // Move to submitting after form is filled
      setTimeout(() => setPhase('submitting'), 3500);
    } else if (phase === 'submitting') {
      t1 = setTimeout(() => setPhase('complete'), 1500);
    } else if (phase === 'complete') {
      t1 = setTimeout(() => {
        setSampleIdx((s) => (s + 1) % POSTCODE_SAMPLES.length);
        setPhase('searching');
      }, 3000);
    }

    return () => {
      if (t1) clearTimeout(t1);
      if (t2) clearTimeout(t2);
      if (t3) clearTimeout(t3);
    };
  }, [phase, current.postcode, current.slug]);

  return (
    <div className="flex-1 w-full rounded-2xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full h-full flex flex-col items-center justify-center space-y-8">
        {/* Postcode Input - Only show when searching */}
        {phase === 'searching' && (
          <div className="relative rounded-xl bg-white text-gray-900 shadow-sm max-w-md mx-auto">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
          </div>
            <input readOnly value={typed} className="w-full pl-10 pr-4 py-4 rounded-xl bg-white text-gray-900" placeholder="Enter your postcode" />
          </div>
        )}

        {/* Loading State */}
        {phase === 'loading' && (
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 relative">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-white/80 text-lg">Loading {current.name}...</p>
          </div>
        )}

        {/* Map with Contact Form - Show when map phase */}
        {phase === 'map' && (
          <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-6">
            {/* Map */}
            <div className="relative flex-1 h-96 bg-slate-900 rounded-2xl overflow-hidden">
              <style jsx>{`
                @keyframes radar-pulse {
                  0% {
                    transform: scale(0.3);
                    opacity: 1;
                  }
                  100% {
                    transform: scale(1.5);
                    opacity: 0;
                  }
                }
                .radar-ring-1 {
                  animation: radar-pulse 2s infinite;
                }
                .radar-ring-2 {
                  animation: radar-pulse 2s infinite 0.5s;
                }
                .radar-ring-3 {
                  animation: radar-pulse 2s infinite 1s;
                }
              `}</style>
              <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="mapGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.45" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="400" height="300" fill="#0f172a" />
                {pathData ? (
                  <g>
                    <path d={pathData} fill="url(#mapGrad)" stroke="#34d399" strokeWidth="2" />
                    <clipPath id="mapClip">
                      <rect x="0" y="0" width="400" height="300" />
                    </clipPath>
                    <path d={pathData} fill="none" stroke="#34d399" strokeWidth="2" clipPath="url(#mapClip)" />
                  </g>
                ) : (
                  <g>
                    <rect x="20" y="20" width="360" height="260" fill="#1e293b" />
                    <text x="200" y="150" textAnchor="middle" fill="#64748b" fontSize="14">Boundary unavailable</text>
                  </g>
                )}
                
                {/* User location - static */}
                <circle cx="200" cy="150" r="8" fill="#3b82f6" stroke="white" strokeWidth="2" />
                <circle cx="200" cy="150" r="4" fill="white" />
              </svg>
              
              {/* CSS-based radar rings for better performance */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-blue-500 rounded-full radar-ring-1 opacity-60"></div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-blue-500 rounded-full radar-ring-2 opacity-40"></div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-blue-500 rounded-full radar-ring-3 opacity-20"></div>
            </div>
          </div>

            {/* Contact Form */}
            <div className="w-full lg:w-80 bg-white/5 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Your Details</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Full Name</label>
                  <div className="relative">
              <input
                readOnly
                      value={contactForm.name} 
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                      placeholder="Enter your name"
              />
                    {typingField === 'name' && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white animate-pulse"></div>
                    )}
            </div>
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Email</label>
                  <div className="relative">
              <input
                readOnly
                      value={contactForm.email} 
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                      placeholder="Enter your email"
              />
                    {typingField === 'email' && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white animate-pulse"></div>
                    )}
            </div>
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Phone</label>
                  <div className="relative">
              <input
                readOnly
                      value={contactForm.phone} 
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                      placeholder="Enter your phone"
                    />
                    {typingField === 'phone' && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submitting State */}
        {phase === 'submitting' && (
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 relative">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-white/80 text-lg">Submitting your request...</p>
          </div>
        )}

        {/* Complete State with Agent */}
        {phase === 'complete' && (
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              A
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Alex Thompson</h3>
            <p className="text-white/80 text-lg mb-4">Your dedicated agent will call you within 24 hours</p>
            <div className="bg-emerald-500/20 rounded-lg p-4">
              <p className="text-emerald-400 text-sm">Request submitted successfully!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Step 5: Quote skeleton with visible price
function QuoteSkeletonAnimation() {
  const quotes = [
    { price: 425, date: '18 Mar 2024', desc: 'Boiler ignition repair and safety check', color: 'emerald' },
    { price: 510, date: '19 Mar 2024', desc: 'Tap cartridge replacement and leak fix', color: 'blue' },
    { price: 365, date: '21 Mar 2024', desc: 'Socket installation with certification', color: 'purple' },
  ];
  const [i, setI] = useState(0);
  const q = quotes[i % quotes.length];
  
  // Color schemes for different quotes
  const colorSchemes = {
    emerald: {
      primary: 'from-emerald-500 to-teal-500',
      secondary: 'from-teal-400 to-cyan-400',
      accent: 'emerald-500',
      ring: 'emerald-500/20',
      text: 'emerald-400'
    },
    blue: {
      primary: 'from-blue-500 to-indigo-500',
      secondary: 'from-indigo-400 to-purple-400',
      accent: 'blue-500',
      ring: 'blue-500/20',
      text: 'blue-400'
    },
    purple: {
      primary: 'from-purple-500 to-pink-500',
      secondary: 'from-pink-400 to-rose-400',
      accent: 'purple-500',
      ring: 'purple-500/20',
      text: 'purple-400'
    }
  };
  
  const colors = colorSchemes[q.color as keyof typeof colorSchemes];
  
  useEffect(() => {
    const t = window.setTimeout(() => setI((p) => (p + 1) % quotes.length), 3000);
    return () => window.clearTimeout(t);
  }, [i, quotes.length]);

  return (
    <div className="flex-1 w-full rounded-2xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10 p-3 sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <div className={`rounded-xl sm:rounded-2xl bg-white/5 ring-1 ring-${colors.ring} p-4 sm:p-6 transition-all duration-500`}>
          {/* Header with price - Mobile optimized */}
          <div className="flex items-center justify-between mb-3 sm:mb-0">
            <div className={`h-4 sm:h-5 w-24 sm:w-40 rounded bg-gradient-to-r ${colors.primary} animate-pulse`} />
            <div className={`text-${colors.text} text-xl sm:text-2xl font-semibold transition-colors duration-500`}>£{q.price}</div>
          </div>

          {/* Meta: date + description - Mobile stack */}
          <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-3 sm:items-center">
            <div className="text-xs text-white/70">{q.date}</div>
            <div className="text-sm text-white/85 sm:col-span-2 sm:truncate leading-relaxed">{q.desc}</div>
          </div>

          {/* Line items skeleton - Mobile optimized */}
          <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
            {[1,2,3,4].map((i) => (
              <div key={i} className="grid grid-cols-6 gap-2 sm:gap-3 items-center">
                <div className="col-span-4 h-3 sm:h-4 rounded bg-white/10 animate-pulse" />
                <div className="col-span-1 h-3 sm:h-4 rounded bg-white/10 animate-pulse" />
                <div className="col-span-1 h-3 sm:h-4 rounded bg-white/10 animate-pulse" />
              </div>
            ))}
          </div>

          {/* Footer with confirm CTA - Mobile optimized */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div className="h-4 sm:h-5 w-20 sm:w-28 rounded bg-white/10 animate-pulse" />
            <div className="px-3 sm:px-4 py-2 rounded-lg bg-white/10 ring-1 ring-white/15 text-white text-sm transition-all duration-500 text-center sm:text-left">
              Confirm job
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
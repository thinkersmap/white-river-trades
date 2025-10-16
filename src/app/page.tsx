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
  const [mobileStepsOpen, setMobileStepsOpen] = useState(false);
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
        const minHeight = isMobile ? 300 : 400; // 300px on mobile, 400px on desktop
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

  // Scroll spy for steps
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
        if (bestIdx !== stepsActive) setStepsActive(bestIdx);
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
      <section className="px-4 py-16 lg:py-24 relative">
        <div className="max-w-[120rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Left vertical steps */}
          <div className="lg:col-span-3">
            <StepsNav
              active={stepsActive}
              onClickStep={(i:number) => stepRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            />
          </div>
          {/* Right showcase panel */}
          <div className="lg:col-span-9">
            {/* Mobile sticky step indicator */}
            <div className="lg:hidden sticky top-0 z-40 bg-transparent mb-3">
              <MobileSteps
                active={stepsActive}
                onSelect={(i:number) => {
                  setMobileStepsOpen(false);
                  stepRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                open={mobileStepsOpen}
                setOpen={setMobileStepsOpen}
              />
            </div>
            <StepsScrollSections stepRefs={stepRefs} stepHeights={stepHeights} />
          </div>
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

// Inline components for the steps showcase (five steps, with subheadings and graphic placeholders)
function StepsNav({ active, onClickStep }: { active: number; onClickStep: (i: number) => void }) {
  const items = [
    { id: 0, label: '01 Search', activeBg: 'bg-sky-700', doneBg: 'bg-sky-400', dotActive: 'from-sky-400 to-cyan-300', dotDone: 'from-sky-300 to-cyan-200', ring: 'ring-sky-400/40' },
    { id: 1, label: '02 Select', activeBg: 'bg-rose-600', doneBg: 'bg-rose-400', dotActive: 'from-rose-400 to-fuchsia-300', dotDone: 'from-rose-300 to-fuchsia-200', ring: 'ring-rose-400/40' },
    { id: 2, label: '03 Connect', activeBg: 'bg-emerald-600', doneBg: 'bg-emerald-400', dotActive: 'from-emerald-400 to-teal-300', dotDone: 'from-emerald-300 to-teal-200', ring: 'ring-emerald-400/40' },
    { id: 3, label: '04 Request', activeBg: 'bg-amber-600', doneBg: 'bg-amber-400', dotActive: 'from-amber-400 to-orange-300', dotDone: 'from-amber-300 to-orange-200', ring: 'ring-amber-400/40' },
    { id: 4, label: '05 Confirm', activeBg: 'bg-violet-600', doneBg: 'bg-violet-400', dotActive: 'from-violet-400 to-indigo-300', dotDone: 'from-violet-300 to-indigo-200', ring: 'ring-violet-400/40' },
  ];
  return (
    <div className="sticky top-24 hidden lg:block">
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <span
              className={`shrink-0 w-2 h-2 rounded-[2px] ${
                item.id === active
                  ? `bg-gradient-to-br ${item.dotActive}`
                  : item.id < active
                  ? `bg-gradient-to-br ${item.dotDone}`
                  : 'bg-gray-300'
              }`}
            />
            <button
              onClick={() => onClickStep(item.id)}
              className={`flex-1 text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                item.id === active
                  ? `bg-slate-900 text-white ring-1 ${item.ring}`
                  : item.id < active
                  ? 'text-gray-900 hover:bg-gray-100'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Mobile sticky steps indicator with expandable list
function MobileSteps({ active, onSelect, open, setOpen }: { active: number; onSelect: (i:number) => void; open: boolean; setOpen: (v:boolean)=>void }) {
  const items = [
    { id: 0, label: '01 Search', activeBg: 'bg-sky-700', doneBg: 'bg-sky-400', dotActive: 'from-sky-400 to-cyan-300', dotDone: 'from-sky-300 to-cyan-200', ring: 'ring-sky-400/40', tone: 'from-sky-500/20 via-cyan-400/10 to-indigo-500/20' },
    { id: 1, label: '02 Select', activeBg: 'bg-rose-600', doneBg: 'bg-rose-400', dotActive: 'from-rose-400 to-fuchsia-300', dotDone: 'from-rose-300 to-fuchsia-200', ring: 'ring-rose-400/40', tone: 'from-rose-500/20 via-fuchsia-400/10 to-purple-500/20' },
    { id: 2, label: '03 Connect', activeBg: 'bg-emerald-600', doneBg: 'bg-emerald-400', dotActive: 'from-emerald-400 to-teal-300', dotDone: 'from-emerald-300 to-teal-200', ring: 'ring-emerald-400/40', tone: 'from-emerald-500/20 via-teal-400/10 to-cyan-500/20' },
    { id: 3, label: '04 Request', activeBg: 'bg-amber-600', doneBg: 'bg-amber-400', dotActive: 'from-amber-400 to-orange-300', dotDone: 'from-amber-300 to-orange-200', ring: 'ring-amber-400/40', tone: 'from-amber-400/20 via-orange-400/10 to-pink-400/20' },
    { id: 4, label: '05 Confirm', activeBg: 'bg-violet-600', doneBg: 'bg-violet-400', dotActive: 'from-violet-400 to-indigo-300', dotDone: 'from-violet-300 to-indigo-200', ring: 'ring-violet-400/40', tone: 'from-violet-500/20 via-indigo-400/10 to-blue-500/20' },
  ];
  const current = items[active] ?? items[0];
  return (
    <div className="px-4 sm:px-5">
      {/* Main indicator bar */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-950 ring-1 ring-white/10 text-white">
        {/* Gradient wash */}
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${current.tone} rounded-2xl`} />
        
        <div className="relative flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span
              className={`shrink-0 w-2 h-2 rounded-[2px] ${
                active === current.id
                  ? `bg-gradient-to-br ${current.dotActive}`
                  : `bg-gradient-to-br ${current.dotDone}`
              }`}
            />
            <span className="text-sm font-medium">{current.label}</span>
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            aria-label="Toggle steps"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {open && (
        <div className="mt-2 space-y-1">
          {items.map((item) => (
            <div key={item.id} className="relative overflow-hidden rounded-2xl bg-slate-950 ring-1 ring-white/10">
              {/* Gradient wash */}
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.tone} rounded-2xl`} />
              
              <button
                onClick={() => onSelect(item.id)}
                className={`relative w-full text-left px-4 py-3 text-sm font-medium flex items-center gap-3 transition-all duration-200 ${
                  item.id === active 
                    ? `text-white ring-1 ${item.ring} bg-white/5` 
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                <span
                  className={`shrink-0 w-2 h-2 rounded-[2px] ${
                    item.id === active
                      ? `bg-gradient-to-br ${item.dotActive}`
                      : item.id < active
                      ? `bg-gradient-to-br ${item.dotDone}`
                      : 'bg-gray-400'
                  }`}
                />
                <span>{item.label}</span>
                {item.id < active && (
                  <div className="ml-auto">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Right column sections that reveal on scroll
function StepsScrollSections({ stepRefs, stepHeights }: { stepRefs: React.MutableRefObject<HTMLDivElement[]>; stepHeights: number[] }) {
  const cards = [
    {
      title: 'Type your problem or project in the search bar',
      sub: 'Describe the job in a sentence or two to get started.',
      tone: 'from-sky-500/20 via-cyan-400/10 to-indigo-500/20',
    },
    {
      title: 'Select a suitable trade based on our AI recommendations',
      sub: 'We suggest the best trade for the job—switch anytime.',
      tone: 'from-rose-500/20 via-fuchsia-400/10 to-purple-500/20',
    },
    {
      title: 'Connect to your local division',
      sub: 'We match you to the right constituency automatically.',
      tone: 'from-emerald-500/20 via-teal-400/10 to-cyan-500/20',
    },
    {
      title: 'Add your contact info then submit your request',
      sub: 'We need these details to confirm your job quickly.',
      tone: 'from-amber-400/20 via-orange-400/10 to-pink-400/20',
    },
    {
      title: 'Receive quotes and confirm your job',
      sub: 'Compare options and choose the one that fits best.',
      tone: 'from-violet-500/20 via-indigo-400/10 to-blue-500/20',
    },
  ];
  return (
    <div className="space-y-8">
      {cards.map((card, idx) => (
        <motion.section
          key={card.title}
          ref={(el: HTMLDivElement | null) => { if (el) stepRefs.current[idx] = el; }}
          data-step-idx={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: '-20% 0px -20% 0px', once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`relative overflow-hidden rounded-2xl p-8 lg:p-12 text-white bg-slate-950 ring-1 ring-white/10`}
          style={{
            minHeight: stepHeights[idx] ? `${stepHeights[idx]}px` : 
              idx === 0 ? '16rem' : // Reduced fallback heights for mobile
              idx === 1 ? '20rem' :
              idx === 2 ? '18rem' :
              idx === 3 ? '17rem' :
              '19rem',
            height: 'auto',
            transition: 'min-height 0.3s ease-out, height 0.3s ease-out'
          }}
        >
          {/* Gradient wash */}
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.tone} rounded-2xl`} />
          {/* Soft radial glows */}
          <div className="hidden sm:block pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="hidden sm:block pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

          <div className="relative h-full flex flex-col">
            <div className="flex-shrink-0">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight">{card.title}</h3>
              <p className="mt-1 text-sm sm:text-base text-white/80 max-w-3xl">{card.sub}</p>
            </div>

             {/* Media placeholder or animation - fills remaining height after header */}
             <div 
               className="mt-8 transition-all duration-500 ease-out flex-1 flex flex-col"
               style={{
                 minHeight: '20rem',
                 transition: 'min-height 0.5s ease-out',
                 contain: 'layout style'
               }}
             >
              {idx === 0 ? (
                <TypingSearchAnimation phrases={TYPING_PHRASES} />
              ) : idx === 1 ? (
                <SearchAnalyzeResultsAnimation />
              ) : idx === 2 ? (
                <PostcodeToDivisionAnimation />
              ) : idx === 3 ? (
                <ContactSubmissionAnimation />
              ) : idx === 4 ? (
                <QuoteSkeletonAnimation />
              ) : (
                <div className="h-full rounded-2xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10"></div>
              )}
            </div>
          </div>
        </motion.section>
      ))}
    </div>
  );
}

// Hook: loops through phrases with optional mid-backspace and end spinner
function useTypingLoop(phrases: string[], options?: { typeDelay?: number; backspaceDelay?: number; pauseBetween?: number; endSpinnerMs?: number; midResetEvery?: number; }) {
  const { typeDelay = 70, backspaceDelay = 35, pauseBetween = 700, endSpinnerMs = 2200, midResetEvery = 0 } = options || {};
  const [text, setText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let t1: number | undefined;
    let t2: number | undefined;
    let t3: number | undefined;
    const current = phrases[idx % phrases.length] || "";
    const enableMidway = typeof midResetEvery === 'number' && midResetEvery > 0;
    const midway = enableMidway && current.length > 6 && (idx % midResetEvery === midResetEvery - 1) ? Math.ceil(current.length * 0.5) : null;
    let i = 0;
    setText("");
    setIsAnalyzing(false);
    const cursor = window.setInterval(() => setCursorVisible((v) => !v), 600);

    const typeForward = (limit: number, next: () => void) => {
      t1 = window.setInterval(() => {
        if (i < limit) {
          setText(current.slice(0, i + 1));
          i += 1;
        } else {
          window.clearInterval(t1);
          next();
        }
      }, typeDelay);
    };

    const backspaceToZero = (next: () => void) => {
      t2 = window.setInterval(() => {
        if (i > 0) {
          setText(current.slice(0, i - 1));
          i -= 1;
        } else {
          window.clearInterval(t2);
          next();
        }
      }, backspaceDelay);
    };

    const afterFinish = () => {
      // Show spinner after every phrase, then move to next
      setTimeout(() => setIsAnalyzing(true), 300);
      t3 = window.setTimeout(() => {
        setIsAnalyzing(false);
        setIdx((p) => (p + 1) % phrases.length);
      }, endSpinnerMs);
    };

    if (midway !== null) {
      typeForward(midway, () => backspaceToZero(() => typeForward(current.length, afterFinish)));
    } else {
      typeForward(current.length, afterFinish);
    }

    return () => {
      window.clearInterval(t1);
      window.clearInterval(t2);
      window.clearTimeout(t3);
      window.clearInterval(cursor);
    };
  }, [idx, phrases, typeDelay, backspaceDelay, pauseBetween, endSpinnerMs, midResetEvery]);

  return { text, cursorVisible, isAnalyzing } as const;
}

function TypingSearchAnimation({ phrases }: { phrases: string[] }) {
  const { text, cursorVisible, isAnalyzing } = useTypingLoop(phrases, { typeDelay: 70, backspaceDelay: 35, pauseBetween: 700, endSpinnerMs: 1800, midResetEvery: 0 });
  return (
    <div className="flex-1 w-full rounded-2xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        <div className="relative rounded-xl bg-white text-gray-900 shadow-sm w-full">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input
            readOnly
            aria-label="Search problem"
            value={text}
            className="w-full pl-10 pr-12 py-4 rounded-xl bg-white text-gray-900"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {!isAnalyzing ? (
              <span className={`w-0.5 h-5 ${cursorVisible ? 'bg-blue-600' : 'bg-transparent'}`} />
            ) : (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin motion-reduce:animate-none" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 2: AI analysis + recommendations animation
function SearchAnalyzeResultsAnimation() {
  const [phase, setPhase] = useState<'typing' | 'analyzing' | 'results'>('typing');
  const [typed, setTyped] = useState('');
  const phrases = TYPING_PHRASES;
  const [idx, setIdx] = useState(0);
  const current = phrases[idx % phrases.length];

  // Generate relevant analysis + recommendations per query
  const ctx = (() => {
    const q = current.toLowerCase();
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
    if (phase === 'typing') {
      setTyped('');
      let i = 0;
      t1 = window.setInterval(() => {
        if (i < current.length) {
          setTyped(current.slice(0, i + 1));
          i += 1;
        } else {
          window.clearInterval(t1);
          // brief pause then analyzing
          t2 = window.setTimeout(() => setPhase('analyzing'), 350);
        }
      }, 60);
    } else if (phase === 'analyzing') {
      // show clear analyzing bar for a bit longer per feedback
      t1 = window.setTimeout(() => setPhase('results'), 2000);
    } else if (phase === 'results') {
      // dwell so user can read suggestions, then advance
      t1 = window.setTimeout(() => {
        setIdx((p) => (p + 1) % phrases.length);
        setPhase('typing');
      }, 4500);
    }
    return () => {
      window.clearInterval(t1);
      window.clearTimeout(t2);
    };
  }, [phase, current, phrases.length]);

  return (
    <div className="flex-1 w-full rounded-2xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl space-y-4">
        {/* Search bar */}
        <div className="relative rounded-xl bg-white text-gray-900 shadow-sm">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input readOnly value={typed} className="w-full pl-10 pr-24 py-4 rounded-xl bg-white text-gray-900" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {phase === 'analyzing' ? (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin motion-reduce:animate-none" />
            ) : (
              <span className="text-xs text-gray-400">Press Enter</span>
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
          <div className="space-y-4 flex-1">
            <div className="bg-white/5 ring-1 ring-white/10 rounded-xl p-5 text-sm leading-relaxed text-white/85">
              {ctx.analysis}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
              {ctx.recs.map((r, i) => (
                <div key={r.trade} className={`rounded-xl ring-1 ring-white/10 p-4 ${i === 0 ? 'bg-white/7' : 'bg-white/3 opacity-70'}`}>
                  <div className="flex items-center justify-between">
                    <div className="text-white font-medium text-sm">{r.trade}</div>
                    <div className={`text-xs text-white/90 px-2 py-0.5 rounded-full bg-gradient-to-r ${r.tone}`}>{Math.round(r.match * 100)}%</div>
                  </div>
                  <div className="mt-3 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-1.5 rounded-full bg-gradient-to-r ${r.tone}`} style={{ width: `${r.match * 100}%`, transition: 'width 600ms ease' }} />
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

// Step 3: Postcode -> connect to local division with boundary
function PostcodeToDivisionAnimation() {
  const [sampleIdx, setSampleIdx] = useState(0);
  const current = POSTCODE_SAMPLES[sampleIdx % POSTCODE_SAMPLES.length];
  const [phase, setPhase] = useState<'typing' | 'connecting' | 'connected'>('typing');
  const [typed, setTyped] = useState('');
  const [pathData, setPathData] = useState<string>('');

  // Convert GeoJSON to simple SVG path
  const geojsonToPath = (geometry: { type: string; coordinates: number[][][] | number[][][][] }, width = 320, height = 200) => {
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
    let t1: number | undefined;
    if (phase === 'typing') {
      setTyped('');
      let i = 0;
      t1 = window.setInterval(() => {
        if (i < current.postcode.length) {
          setTyped(current.postcode.slice(0, i + 1));
          i += 1;
        } else {
          window.clearInterval(t1);
          setPhase('connecting');
        }
      }, 70);
    } else if (phase === 'connecting') {
      // fetch boundary
      (async () => {
        try {
          const res = await fetch(`/data/constituencies/${current.slug}.geojson`);
          if (res.ok) {
            const gj = await res.json();
            const p = geojsonToPath(gj.geometry, 320, 200);
            setPathData(p);
          } else {
            setPathData('');
          }
        } catch { setPathData(''); }
        // slight pause to feel responsive
        setTimeout(() => setPhase('connected'), 1600);
      })();
    } else if (phase === 'connected') {
      // dwell then next sample
      t1 = window.setTimeout(() => {
        setSampleIdx((s) => (s + 1) % POSTCODE_SAMPLES.length);
        setPhase('typing');
      }, 3000);
    }
    return () => {
      if (t1) window.clearInterval(t1);
    };
  }, [phase, current.postcode, current.slug]);

  return (
    <div className="flex-1 w-full rounded-2xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl space-y-5">
        {/* Postcode bar */}
        <div className="relative rounded-xl bg-white text-gray-900 shadow-sm">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <input readOnly value={typed} className="w-full pl-10 pr-24 py-4 rounded-xl bg-white text-gray-900" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {phase === 'connecting' ? (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin motion-reduce:animate-none" />
            ) : (
              <span className="text-xs text-gray-400">Enter postcode</span>
            )}
          </div>
        </div>

        {/* Connecting context */}
        {phase === 'connecting' && (
          <div className="bg-white/5 ring-1 ring-white/10 rounded-xl p-4 flex items-center justify-between">
            <div className="text-sm text-white/80">Connecting you to your local division…</div>
            <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin motion-reduce:animate-none" />
          </div>
        )}

        {/* Connected: small map with boundary */}
        {phase === 'connected' && (
          <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch flex-1 min-h-0">
            <div className="sm:col-span-2 flex flex-col justify-center">
              <div className="text-white text-sm">Connected to</div>
              <div className="text-white/90 text-lg font-semibold">{current.name}</div>
              <div className="text-white/70 text-xs mt-1">Postcode {current.postcode}</div>
            </div>
            <div className="justify-self-end w-full sm:w-auto flex-1 flex flex-col">
              <svg className="w-full flex-1 rounded-lg ring-1 ring-white/10" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id="divGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.45" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="320" height="200" fill="#0b1220" />
                {pathData ? (
                  <path d={pathData} fill="url(#divGrad)" stroke="#34d399" strokeWidth="2" />
                ) : (
                  <g>
                    <rect x="20" y="20" width="280" height="160" fill="#111827" />
                    <text x="160" y="105" textAnchor="middle" fill="#9CA3AF" fontSize="12">Boundary unavailable</text>
                  </g>
                )}
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Step 4: Contact details and submission success
function ContactSubmissionAnimation() {
  const [phase, setPhase] = useState<'form' | 'submitting' | 'submitted'>('form');
  const [name] = useState('Sarah Johnson');
  const [email] = useState('sarah.johnson@example.com');
  const [phone] = useState('020 7123 4567');

  useEffect(() => {
    let t: number | undefined;
    if (phase === 'form') t = window.setTimeout(() => setPhase('submitting'), 1600);
    else if (phase === 'submitting') t = window.setTimeout(() => setPhase('submitted'), 1400);
    else if (phase === 'submitted') t = window.setTimeout(() => setPhase('form'), 2400);
    return () => window.clearTimeout(t);
  }, [phase]);

  return (
    <div className="flex-1 w-full rounded-2xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10 p-4 sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        {/* Form */}
        {phase !== 'submitted' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
            <div className="sm:col-span-1">
              <label className="block text-xs text-white/70 mb-1">Full name</label>
              <input
                readOnly
                value={name}
                className="w-full px-3 py-2 rounded-lg bg-white text-gray-900 shadow-sm"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs text-white/70 mb-1">Email address</label>
              <input
                readOnly
                value={email}
                className="w-full px-3 py-2 rounded-lg bg-white text-gray-900 shadow-sm"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs text-white/70 mb-1">Phone number</label>
              <input
                readOnly
                value={phone}
                className="w-full px-3 py-2 rounded-lg bg-white text-gray-900 shadow-sm"
              />
            </div>
          </div>
        )}

        {phase === 'submitting' && (
          <div className="mt-6 bg-white/5 ring-1 ring-white/10 rounded-xl p-4 flex items-center justify-between">
            <div className="text-sm text-white/80">Submitting your job request…</div>
            <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin motion-reduce:animate-none" />
          </div>
        )}

        {phase === 'submitted' && (
          <div className="mt-2 bg-emerald-500/15 ring-1 ring-emerald-400/40 rounded-xl p-5 flex items-center gap-3 flex-1">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            </div>
            <div className="text-white/90 text-sm">
              Request submitted. We&apos;ll call you within <span className="font-semibold">24 hours</span> to confirm details.
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
    { price: 425, date: '18 Mar 2024', desc: 'Boiler ignition repair and safety check' },
    { price: 510, date: '19 Mar 2024', desc: 'Tap cartridge replacement and leak fix' },
    { price: 365, date: '21 Mar 2024', desc: 'Socket installation with certification' },
  ];
  const [i, setI] = useState(0);
  const q = quotes[i % quotes.length];
  useEffect(() => {
    const t = window.setTimeout(() => setI((p) => (p + 1) % quotes.length), 3000);
    return () => window.clearTimeout(t);
  }, [i, quotes.length]);

  return (
    <div className="flex-1 w-full rounded-2xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10 p-4 sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
          {/* Header with price */}
          <div className="flex items-center justify-between">
            <div className="h-5 w-40 rounded bg-white/10 animate-pulse" />
            <div className="text-white text-2xl font-semibold">£{q.price}</div>
          </div>

          {/* Meta: date + description */}
          <div className="mt-4 grid grid-cols-3 gap-3 items-center">
            <div className="col-span-1 text-xs text-white/70">{q.date}</div>
            <div className="col-span-2 text-sm text-white/85 truncate">{q.desc}</div>
          </div>

          {/* Line items skeleton */}
          <div className="mt-6 space-y-3">
            {[1,2,3,4].map((i) => (
              <div key={i} className="grid grid-cols-6 gap-3 items-center">
                <div className="col-span-4 h-4 rounded bg-white/10 animate-pulse" />
                <div className="col-span-1 h-4 rounded bg-white/10 animate-pulse" />
                <div className="col-span-1 h-4 rounded bg-white/10 animate-pulse" />
              </div>
            ))}
          </div>

          {/* Footer with confirm CTA (non-clickable) */}
          <div className="mt-6 flex items-center justify-between">
            <div className="h-5 w-28 rounded bg-white/10 animate-pulse" />
            <div className="px-4 py-2 rounded-lg bg-white/10 ring-1 ring-white/15 text-white text-sm">Confirm job</div>
          </div>
        </div>
      </div>
    </div>
  );
}
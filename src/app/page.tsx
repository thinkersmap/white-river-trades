"use client";

import { useState, useEffect } from "react";
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

      {/* Process Steps Section - Full Width Timeline */}
      <section className="flex-1 py-16 lg:py-24 relative">
        <TimelineSteps />
      </section>

      {/* Why Homeowners Choose Us Section */}
      <section className="py-16 lg:py-24 relative">
        <WhyChooseUsSection />
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
              © 2025 White River Trades 
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


// Learn More Accordion Component
function LearnMoreAccordion({ stepNumber }: { stepNumber: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const getStepContent = () => {
    switch (stepNumber) {
      case '01':
        return {
          content: (
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900">Understanding Your Problem</h3>
                <p className="text-gray-700 leading-relaxed">
                  With dozens of different trades available, it&apos;s crucial we understand exactly what you need done. We analyze your description to ensure you get connected with the right specialist who has the exact skills for your specific job.
                </p>
              </div>

              {/* Process Steps */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">How we get you to the right place:</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-gray-700">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Problem Understanding</p>
                      <p className="text-sm text-gray-600">We read your description and identify the specific type of work needed</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-gray-700">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Trade Identification</p>
                      <p className="text-sm text-gray-600">We determine which trade category matches your needs (plumbing, electrical, etc.)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-gray-700">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Right Specialist Connection</p>
                      <p className="text-sm text-gray-600">We connect you with qualified professionals who specialize in your specific issue</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why This Matters */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Why getting the right trade matters:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• A plumber can&apos;t fix electrical issues safely</li>
                  <li>• An electrician can&apos;t repair your boiler</li>
                  <li>• Wrong tradesperson = wasted time and money</li>
                  <li>• Right specialist = faster, safer, better results</li>
                </ul>
              </div>
            </div>
          )
        };
      case '02':
        return {
          content: (
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900">Local Agent Network</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your dedicated agent works exclusively with companies in your local area. They know the local market, have established relationships, and can negotiate better deals on your behalf.
                </p>
              </div>

              {/* Agent Process */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">What your agent does:</h4>
                <div className="grid gap-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Local Market Knowledge</p>
                      <p className="text-sm text-gray-700">Knows which tradespeople are available, their specialties, and reputation in your area</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Direct Liaison</p>
                      <p className="text-sm text-gray-700">Communicates directly with local companies, handles scheduling, and manages the process</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Price Negotiation</p>
                      <p className="text-sm text-gray-700">Uses their relationships to negotiate better prices and terms for you</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Benefits for you:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• No need to call multiple companies yourself</li>
                  <li>• Access to trusted local professionals</li>
                  <li>• Better prices through agent relationships</li>
                  <li>• Someone else handles all the coordination</li>
                </ul>
              </div>
            </div>
          )
        };
      case '03':
        return {
          content: (
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900">You&apos;re in Complete Control</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your agent will present you with detailed quotes from qualified tradespeople. You have full control over the decision-making process with no pressure or commitment until you&apos;re completely satisfied.
                </p>
              </div>

              {/* Decision Process */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Your decision process:</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-gray-700">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Review Quotes</p>
                      <p className="text-sm text-gray-600">Compare detailed quotes with itemized costs, timelines, and guarantees</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-gray-700">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Ask Questions</p>
                      <p className="text-sm text-gray-600">Speak directly with tradespeople, request changes, or negotiate terms</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-gray-700">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Make Your Choice</p>
                      <p className="text-sm text-gray-600">Only proceed when you&apos;re completely satisfied with a quote and ready to start</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote Details */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">What you&apos;ll see in quotes:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <div className="space-y-1">
                    <p className="font-medium">Detailed Pricing</p>
                    <p>• Materials and labor costs</p>
                    <p>• Any additional fees</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Timeline & Guarantees</p>
                    <p>• Project completion dates</p>
                    <p>• Workmanship warranties</p>
                  </div>
                </div>
              </div>

              {/* No Pressure */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">No pressure, no commitment:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Take as long as you need to decide</li>
                  <li>• Ask as many questions as you want</li>
                  <li>• Negotiate terms that work for you</li>
                  <li>• Only proceed when you&apos;re 100% ready</li>
                </ul>
              </div>
            </div>
          )
        };
      default:
        return { content: <div>Content not available</div> };
    }
  };

  const stepContent = getStepContent();

  return (
    <div className="w-full">
      {/* Transparent container with outline design - fully clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left rounded-xl sm:rounded-2xl border-2 transition-all duration-200 ${isOpen
            ? 'border-gray-400 bg-gray-50/30' 
            : 'border-gray-200 bg-transparent hover:border-gray-300'
        } p-4 sm:p-6 lg:p-8`}
      >
        {/* Header */}
        <div className="flex items-center justify-between py-1">
          <span className="text-base font-medium text-gray-600">
            Learn More
          </span>
          <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {/* Expandable content */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="pt-4 border-t border-gray-200/50">
            <div className="text-gray-900">
              {stepContent.content}
            </div>
          </div>
        </motion.div>
      </button>
    </div>
  );
}

// Modern timeline with sharp, contemporary design
function TimelineSteps() {
  const steps = [
    {
      title: 'Describe your problem',
      subtitle: 'Tell us what you need done and our AI will analyze your request to suggest the best trades for the job.',
      stepNumber: '01',
      accent: 'blue',
      animation: <SearchToAnalysisAnimation phrases={TYPING_PHRASES} />,
      minHeight: 'min-h-[500px] sm:min-h-[500px] lg:min-h-[600px]'
    },
    {
      title: 'Connect to your local area',
      subtitle: 'We automatically match you to the right local division and collect your contact information to get started.',
      stepNumber: '02',
      accent: 'green',
      animation: <LocationToContactAnimation />,
      minHeight: 'min-h-[450px] sm:min-h-[500px] lg:min-h-[550px]'
    },
    {
      title: 'Confirm your job',
      subtitle: 'Compare options from qualified trades and choose the one that fits your budget and timeline best.',
      stepNumber: '03',
      accent: 'purple',
      animation: <QuoteSkeletonAnimation />,
      minHeight: 'min-h-[400px] sm:min-h-[450px] lg:min-h-[500px]'
    },
  ];

  return (
    <div className="w-full">
      <div className="space-y-16 sm:space-y-24 lg:space-y-32">
        {steps.map((step, idx) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: '-10% 0px -10% 0px', once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: idx * 0.15 }}
            className="w-full"
          >
            <div className="w-full px-4 sm:px-6 lg:px-12">
              {/* Step header */}
              <div className="mb-8 sm:mb-12 lg:mb-16">
                <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center text-xs sm:text-sm font-bold tracking-wide ${step.accent === 'blue' ? 'ring-2 ring-blue-500/20' :
                    step.accent === 'green' ? 'ring-2 ring-green-500/20' :
                    'ring-2 ring-purple-500/20'
                  }`}>
                    {step.stepNumber}
                  </div>
                  <div className="h-px bg-gray-200 flex-1" />
                </div>
                
                <h3 className="text-2xl sm:text-3xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-3 sm:mb-4 lg:mb-6 max-w-5xl leading-tight">
                  {step.title}
                </h3>
                
                <p className="text-base sm:text-lg lg:text-2xl text-gray-600 leading-relaxed max-w-4xl font-light">
                  {step.subtitle}
                </p>
            </div>

              {/* Step animation/content */}
              <div className="w-full relative">
                {/* Step gradient background (using provided tones) */}
                {/* Dark base so pastel tones wash over a deep surface */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-slate-950" />
                <div className={`absolute inset-0 rounded-xl sm:rounded-2xl ${step.accent === 'blue'
                    ? 'bg-gradient-to-br from-sky-500/20 via-cyan-400/10 to-indigo-500/20'
                    : step.accent === 'green'
                    ? 'bg-gradient-to-br from-emerald-500/20 via-teal-400/10 to-cyan-500/20'
                    : 'bg-gradient-to-br from-violet-500/20 via-indigo-400/10 to-blue-500/20'
                }`} />
                
                {/* Subtle overlay for depth */}
                <div className={`absolute inset-0 rounded-xl sm:rounded-2xl ${step.accent === 'blue'
                    ? 'bg-gradient-to-tr from-white/0 via-white/0 to-white/0'
                    : step.accent === 'green'
                    ? 'bg-gradient-to-tr from-white/0 via-white/0 to-white/0'
                    : 'bg-gradient-to-tr from-white/0 via-white/0 to-white/0'
                }`} />
                
                {/* Subtle noise texture */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIvPjwvc3ZnPg==')]" />
                
                {/* Main content container */}
                <div className={`relative rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 lg:p-16 shadow-2xl ${step.minHeight}`}>
                  {step.animation}
            </div>

                {/* Glow aligned to step tones */}
                <div className={`absolute -inset-1 rounded-xl sm:rounded-2xl blur-xl opacity-30 ${step.accent === 'blue'
                    ? 'bg-gradient-to-r from-sky-500/20 to-indigo-500/20'
                    : step.accent === 'green'
                    ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20'
                    : 'bg-gradient-to-r from-violet-500/20 to-blue-500/20'
                } -z-10`} />
                </div>

                {/* Learn More Accordion */}
                <div className="mt-8 sm:mt-12 lg:mt-16">
                  <LearnMoreAccordion 
                    stepNumber={step.stepNumber}
                  />
                </div>
                </div>
          </motion.div>
        ))}
                </div>
            </div>
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
    <div className="w-full">
      <div className="w-full max-w-4xl sm:max-w-6xl mx-auto space-y-4 sm:space-y-8">
        {/* Search bar */}
        <div className="relative rounded-xl sm:rounded-2xl border border-white/20 bg-white/5 shadow-lg sm:shadow-xl hover:border-sky-400/50 transition-all duration-300 hover:shadow-xl sm:hover:shadow-2xl">
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-sky-500/5 to-cyan-500/5 opacity-50" />
          <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-white/80">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input readOnly value={typed} className="relative w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-4 sm:py-6 rounded-xl sm:rounded-2xl bg-transparent text-white text-base sm:text-xl font-medium placeholder-white/50" />
          <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2">
            {phase === 'analyzing' && (
              <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin motion-reduce:animate-none" />
            )}
          </div>
        </div>

        {/* Analyzing context */}
        {phase === 'analyzing' && (
          <div className="relative rounded-xl sm:rounded-2xl border border-sky-400/30 bg-gradient-to-r from-sky-500/10 to-cyan-500/10 p-4 sm:p-6 flex items-center justify-between shadow-lg">
            <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-sky-600/5 to-cyan-600/5" />
            <div className="relative text-sm sm:text-lg font-medium text-sky-100">Analyzing your request with AI…</div>
            <div className="relative w-5 h-5 sm:w-6 sm:h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin motion-reduce:animate-none" />
          </div>
        )}

        {/* Results */}
        {phase === 'results' && (
          <div className="space-y-4 sm:space-y-8">
            <div className="relative rounded-xl sm:rounded-2xl border border-white/20 bg-gradient-to-br from-white/5 to-white/10 p-4 sm:p-8 text-sm sm:text-lg leading-relaxed text-white/90 font-light shadow-lg">
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-sky-500/5 to-cyan-500/5" />
              <div className="relative">{ctx.analysis}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {ctx.recs.map((r, i) => (
                <div key={r.trade} className={`relative rounded-xl sm:rounded-2xl border p-4 sm:p-6 transition-all duration-300 shadow-lg ${i === 0
                    ? 'bg-gradient-to-br from-sky-500/20 to-cyan-500/20 border-sky-400/40 shadow-xl scale-105' 
                    : 'bg-gradient-to-br from-white/5 to-white/10 border-white/20 hover:border-white/30 hover:shadow-xl'
                }`}>
                  <div className={`absolute inset-0 rounded-xl sm:rounded-2xl ${i === 0 ? 'bg-gradient-to-br from-sky-600/10 to-cyan-600/10' : 'bg-gradient-to-br from-white/5 to-white/10'
                  }`} />
                  <div className="relative flex items-center justify-between mb-3 sm:mb-4">
                    <div className={`font-bold text-base sm:text-lg ${i === 0 ? 'text-sky-100' : 'text-white/80'
                    }`}>{r.trade}</div>
                    <div className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-bold ${i === 0
                        ? 'text-sky-100 bg-sky-500/30 border border-sky-400/30' 
                        : 'text-white/70 bg-white/10 border border-white/20'
                    }`}>
                      {Math.round(r.match * 100)}%
                    </div>
                  </div>
                  <div className="relative h-2 sm:h-3 w-full rounded-full bg-white/20 overflow-hidden">
                    <div 
                      className={`h-2 sm:h-3 rounded-full transition-all duration-700 ${i === 0 ? 'bg-gradient-to-r from-sky-400 to-cyan-400' : 'bg-gradient-to-r from-white/40 to-white/60'
                      }`} 
                      style={{ width: `${r.match * 100}%` }} 
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

// Consolidated Step 2: Location to Contact flow - Compact Design
function LocationToContactAnimation() {
  const [phase, setPhase] = useState<'searching' | 'loading' | 'map' | 'contact' | 'submitting' | 'complete'>('searching');
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
          t2 = setTimeout(() => setPhase('loading'), 1000);
        }
      }, 120);
    } else if (phase === 'loading') {
      t1 = setTimeout(() => setPhase('map'), 1200);
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
      
      // Auto-click the button after showing map for a bit
      t1 = setTimeout(() => setPhase('contact'), 2500);
    } else if (phase === 'contact') {
      // Animate contact form filling with typewriter effect
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
      
      // Auto-submit after form is filled
      setTimeout(() => setPhase('submitting'), 4000);
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
    <div className="w-full">
      <div className="w-full max-w-2xl mx-auto">
        {/* Main container with smooth transitions */}
        <div className="relative h-full min-h-[450px] sm:min-h-[500px] lg:min-h-[550px] transition-all duration-500 ease-in-out flex items-center justify-center">
          
          {/* Postcode Input Phase */}
        {phase === 'searching' && (
            <div className="transition-all duration-500 flex items-center justify-center w-full">
              <div className="relative rounded-xl sm:rounded-2xl border border-white/20 bg-white/5 shadow-lg hover:border-green-400/50 transition-all duration-300">
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-50" />
                <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-white/80">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1118 0z" />
                    <circle cx="12" cy="10" r="3" />
              </svg>
          </div>
                <input readOnly value={typed} className="relative w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-4 sm:py-6 rounded-xl sm:rounded-2xl bg-transparent text-white text-base sm:text-xl font-medium placeholder-white/50" placeholder="Enter your postcode" />
              </div>
          </div>
        )}

        {/* Loading State */}
        {phase === 'loading' && (
            <div className="transition-all duration-500 flex items-center justify-center w-full">
          <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 relative">
                  <div className="absolute inset-0 rounded-full border-3 sm:border-4 border-white/20"></div>
                  <div className="absolute inset-0 rounded-full border-3 sm:border-4 border-green-400 border-t-transparent animate-spin"></div>
            </div>
                <p className="text-white/80 text-lg sm:text-xl font-medium">Loading {current.name}...</p>
              </div>
          </div>
        )}

          {/* Map Phase */}
        {phase === 'map' && (
            <div className="transition-all duration-500 flex items-center justify-center w-full">
              <div className="space-y-4">
                {/* Compact Map */}
                <div className="relative aspect-[4/3] max-w-sm mx-auto rounded-xl sm:rounded-2xl overflow-hidden border border-white/20 shadow-xl bg-slate-950">
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
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#059669" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                    <rect x="0" y="0" width="400" height="300" fill="#111827" />
                {pathData ? (
                  <g>
                        <path d={pathData} fill="url(#mapGrad)" stroke="#10b981" strokeWidth="2" />
                    <clipPath id="mapClip">
                      <rect x="0" y="0" width="400" height="300" />
                    </clipPath>
                        <path d={pathData} fill="none" stroke="#10b981" strokeWidth="2" clipPath="url(#mapClip)" />
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
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-green-500 rounded-full radar-ring-1 opacity-60"></div>
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-green-500 rounded-full radar-ring-2 opacity-40"></div>
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-green-500 rounded-full radar-ring-3 opacity-30"></div>
            </div>
          </div>

                {/* Add Contact Details Button */}
                <div className="text-center">
                  <div className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 text-emerald-100 font-medium shadow-lg">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <line x1="20" y1="8" x2="20" y2="14" />
                      <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                    Add Contact Details
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Form Phase */}
          {phase === 'contact' && (
            <div className="transition-all duration-500 flex items-center justify-center w-full">
              <div className="relative rounded-xl sm:rounded-2xl border border-white/20 p-6 sm:p-8 shadow-xl">
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5" />
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-600/5 via-transparent to-teal-600/10" />
                <h4 className="relative text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Your Details</h4>
                <div className="relative space-y-4 sm:space-y-6">
                <div>
                    <label className="block text-xs sm:text-sm font-bold text-white/80 mb-2 sm:mb-3 uppercase tracking-wide">Full Name</label>
                  <div className="relative">
              <input
                readOnly
                      value={contactForm.name} 
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/20 rounded-lg sm:rounded-xl text-white text-base sm:text-lg font-medium placeholder-white/50"
                      placeholder="Enter your name"
              />
                    {typingField === 'name' && (
                        <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-0.5 h-5 sm:h-6 bg-green-400 animate-pulse"></div>
                    )}
            </div>
                </div>
                <div>
                    <label className="block text-xs sm:text-sm font-bold text-white/80 mb-2 sm:mb-3 uppercase tracking-wide">Email</label>
                  <div className="relative">
              <input
                readOnly
                      value={contactForm.email} 
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/20 rounded-lg sm:rounded-xl text-white text-base sm:text-lg font-medium placeholder-white/50"
                      placeholder="Enter your email"
              />
                    {typingField === 'email' && (
                        <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-0.5 h-5 sm:h-6 bg-green-400 animate-pulse"></div>
                    )}
            </div>
                </div>
                <div>
                    <label className="block text-xs sm:text-sm font-bold text-white/80 mb-2 sm:mb-3 uppercase tracking-wide">Phone</label>
                  <div className="relative">
              <input
                readOnly
                      value={contactForm.phone} 
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border border-white/20 rounded-lg sm:rounded-xl text-white text-base sm:text-lg font-medium placeholder-white/50"
                      placeholder="Enter your phone"
                    />
                    {typingField === 'phone' && (
                        <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-0.5 h-5 sm:h-6 bg-green-400 animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submitting State */}
        {phase === 'submitting' && (
            <div className="transition-all duration-500 flex items-center justify-center w-full">
          <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 relative">
                  <div className="absolute inset-0 rounded-full border-3 sm:border-4 border-white/20"></div>
                  <div className="absolute inset-0 rounded-full border-3 sm:border-4 border-green-400 border-t-transparent animate-spin"></div>
            </div>
                <p className="text-white/80 text-lg sm:text-xl font-medium">Submitting your request...</p>
              </div>
          </div>
        )}

        {/* Complete State with Agent */}
        {phase === 'complete' && (
            <div className="transition-all duration-500 flex items-center justify-center w-full">
              <div className="text-center max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              A
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Alex Thompson</h3>
            <p className="text-white/80 text-lg mb-4">Your dedicated agent will call you within 24 hours</p>
                <div className="bg-emerald-500/20 rounded-lg p-4 border border-emerald-400/30">
                  <p className="text-emerald-400 text-sm font-medium">Request submitted successfully!</p>
                </div>
            </div>
          </div>
        )}
        </div>
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
  
  useEffect(() => {
    const t = window.setTimeout(() => setI((p) => (p + 1) % quotes.length), 3000);
    return () => window.clearTimeout(t);
  }, [i, quotes.length]);

  return (
    <div className="w-full">
      <div className="w-full max-w-3xl sm:max-w-5xl mx-auto">
        <div className="relative rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-8 lg:p-12 transition-all duration-500 shadow-xl sm:shadow-2xl hover:shadow-2xl sm:hover:shadow-3xl">
          {/* Cinematic gradient background */}
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500/5 to-violet-500/5" />
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-purple-600/5 via-transparent to-violet-600/10" />
          
          {/* Header with price */}
          <div className="relative flex items-center justify-between mb-4 sm:mb-8">
            <div className={`h-4 sm:h-6 w-24 sm:w-40 rounded-lg animate-pulse ${q.color === 'emerald' ? 'bg-gradient-to-r from-emerald-400 to-green-500' :
              q.color === 'blue' ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
              'bg-gradient-to-r from-purple-400 to-violet-500'
            }`} />
            <div className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white">£{q.price}</div>
          </div>

          {/* Meta: date + description */}
          <div className="relative mb-4 sm:mb-8 space-y-2 sm:space-y-3">
            <div className="text-xs sm:text-sm font-bold text-white/60 uppercase tracking-wide">{q.date}</div>
            <div className="text-sm sm:text-xl text-white/90 leading-relaxed font-light">{q.desc}</div>
          </div>

          {/* Line items skeleton */}
          <div className="relative space-y-3 sm:space-y-4 mb-4 sm:mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="grid grid-cols-6 gap-2 sm:gap-4 items-center">
                <div className="col-span-4 h-3 sm:h-5 rounded-lg bg-white/20 animate-pulse" />
                <div className="col-span-1 h-3 sm:h-5 rounded-lg bg-white/20 animate-pulse" />
                <div className="col-span-1 h-3 sm:h-5 rounded-lg bg-white/20 animate-pulse" />
              </div>
            ))}
          </div>

          {/* Footer with confirm CTA */}
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 pt-4 sm:pt-6 border-t border-white/20">
            <div className="h-4 sm:h-6 w-20 sm:w-32 rounded-lg bg-white/20 animate-pulse" />
            <div className={`px-4 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl text-white text-base sm:text-lg font-bold transition-all duration-200 shadow-lg border border-white/20 text-center sm:text-left ${
              q.color === 'emerald' ? 'bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600' :
              q.color === 'blue' ? 'bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600' :
              'bg-gradient-to-r from-purple-400 to-violet-500 hover:from-purple-500 hover:to-violet-600'
            }`}>
              Confirm job
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Why Choose Us Section - Subheading flow with novel visuals
function WhyChooseUsSection() {
  const stories = [
    {
      title: 'You\'re not alone in feeling overwhelmed',
      subtitle: 'Every homeowner has been there',
      description: 'That sinking feeling when something breaks. The panic of not knowing who to call. The dread of being ripped off or getting shoddy work.',
      accent: 'red'
    },
    {
      title: 'There\'s a better way',
      subtitle: 'Meet Sarah from Kingston',
      description: 'Sarah had the same fears. Then she discovered White River Trades. Within 24 hours, she had three detailed quotes from qualified local tradespeople.',
      accent: 'blue'
    },
    {
      title: 'You\'re in complete control',
      subtitle: 'No pressure, no surprises',
      description: 'Compare detailed quotes side by side. Ask questions directly to tradespeople. Negotiate terms. You decide when you\'re ready.',
      accent: 'green'
    },
    {
      title: 'Quality you can count on',
      subtitle: 'Every job backed by our guarantee',
      description: 'All tradespeople are vetted and qualified. Every job comes with our workmanship guarantee. If something isn\'t right, we make it right.',
      accent: 'purple'
    }
  ];

  return (
    <div className="w-full">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        {/* Section header */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center text-xs sm:text-sm font-bold tracking-wide ring-2 ring-gray-500/20">
              ✓
            </div>
            <div className="h-px bg-gray-200 flex-1" />
          </div>
          
          <h3 className="text-2xl sm:text-3xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-3 sm:mb-4 lg:mb-6 max-w-5xl leading-tight">
            Why homeowners choose us
          </h3>
          
          <p className="text-base sm:text-lg lg:text-2xl text-gray-600 leading-relaxed max-w-4xl font-light">
            The journey from worry to confidence, told through real experiences
          </p>
        </div>

        {/* 3-Column Platform Features */}
        <div className="w-full">
          {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                title: "Verified Local Professionals",
                subtitle: "Every company checked against official UK business data.",
                color: "green",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
              {
                title: "We Handle Everything",
                subtitle: "Tell us the problem, we match, confirm, and coordinate.",
                color: "blue",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )
              },
              {
                title: "Fast, Reliable Communication",
                subtitle: "We call within 24 hours to get your job moving.",
                color: "orange",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              }
            ].map((card, idx) => (
            <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: '-10% 0px -10% 0px', once: true }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: idx * 0.15 }}
                className="group"
              >
                <div className="relative rounded-xl sm:rounded-2xl border border-white/20 bg-black shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  {/* Complex free-form gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
                  
                  {/* Dynamic gradient based on card color */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-transparent ${
                    card.color === 'green' ? 'to-green-600/30' :
                    card.color === 'blue' ? 'to-blue-600/30' :
                    'to-orange-600/30'
                  }`} />
                  
                  {/* Additional gradient layers for depth */}
                  <div className={`absolute inset-0 bg-gradient-to-tr from-transparent ${
                    card.color === 'green' ? 'via-green-500/10' :
                    card.color === 'blue' ? 'via-blue-500/10' :
                    'via-orange-500/10'
                  } to-transparent`} />
                  <div 
                    className="absolute bottom-0 right-0 w-3/4 h-3/4"
                    style={{
                      background: card.color === 'green' 
                        ? 'radial-gradient(ellipse at bottom right, rgba(34, 197, 94, 0.4) 0%, rgba(22, 163, 74, 0.2) 40%, transparent 70%)'
                        : card.color === 'blue'
                        ? 'radial-gradient(ellipse at bottom right, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.2) 40%, transparent 70%)'
                        : 'radial-gradient(ellipse at bottom right, rgba(249, 115, 22, 0.4) 0%, rgba(234, 88, 12, 0.2) 40%, transparent 70%)'
                    }}
                  />
                  
                  {/* Content */}
                  <div className="relative p-6 sm:p-8">
                  {/* Icon */}
                    <div className={`w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center mb-6 ring-2 ${
                      card.color === 'green' ? 'ring-green-500/20' :
                      card.color === 'blue' ? 'ring-blue-500/20' :
                      'ring-orange-500/20'
                    } shadow-inner`}>
                      <div className={`drop-shadow-sm ${
                        card.color === 'green' ? 'text-green-400' :
                        card.color === 'blue' ? 'text-blue-400' :
                        'text-orange-400'
                      }`}>
                        {card.icon}
                      </div>
                  </div>
                  
                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 leading-tight">
                      {card.title}
                    </h3>
                    
                    {/* Subtitle */}
                    <p className="text-gray-300 leading-relaxed mb-6 text-sm sm:text-base">
                      {card.subtitle}
                    </p>
                    
                    {/* Learn More CTA */}
                    <div className={`font-medium text-sm sm:text-base transition-colors duration-200 ${
                      card.color === 'green' ? 'text-green-400 hover:text-green-300' :
                      card.color === 'blue' ? 'text-blue-400 hover:text-blue-300' :
                      'text-orange-400 hover:text-orange-300'
                    }`}>
                      Learn more →
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        </div>

      </div>
    </div>
  );
}

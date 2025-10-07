"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/home/Navigation";
import { Hero } from "@/components/home/Hero";
import { SearchDialog } from "@/components/dialogs/SearchDialog";
import { TradesDialog } from "@/components/dialogs/TradesDialog";

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

  const handleSelectTrade = (tradeName: string) => {
    setSelectedTrade(tradeName);
    setSearchQuery(tradeName.toLowerCase());
    setShowTrades(false);
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      <Navigation />
      <Hero 
        onSearch={() => setIsOpen(true)}
        searchExamples={searchExamples}
        placeholderIndex={placeholderIndex}
      />

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
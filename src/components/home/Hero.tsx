"use client";

import Image from 'next/image';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useEffect, useMemo, useRef, useState } from 'react';

interface HeroProps {
  onSearch: () => void;
  searchExamples: string[];
  placeholderIndex: number;
}

export function Hero({ onSearch, searchExamples, placeholderIndex }: HeroProps) {
  const [typedText, setTypedText] = useState<string>("");
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentPhrase = useMemo(() => searchExamples[placeholderIndex] || "", [searchExamples, placeholderIndex]);

  useEffect(() => {
    // Clear any existing timer
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setTypedText("");

    // Typewriter animation
    const chars = currentPhrase.split("");
    let index = 0;
    typingTimerRef.current = setInterval(() => {
      index += 1;
      setTypedText(chars.slice(0, index).join(""));
      if (index >= chars.length && typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    }, 30);

    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, [currentPhrase]);
  return (
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
                Find local services you can trust for your home.
                </h1>
                <p className="mt-4 lg:mt-6 text-lg lg:text-xl text-gray-600 leading-relaxed max-w-[95%] lg:max-w-[90%]">
                Tell us what you need fixed or improved and where you live. We&apos;ll match you with trusted local trades ready to help. {" "}
                <span className="bg-[linear-gradient(90deg,#8b5cf6_0%,#3b82f6_50%,#06b6d4_100%)] bg-clip-text text-transparent font-medium">Click the searchbar to begin.</span>
                </p>
              </div>

              <div className="relative max-w-2xl cursor-pointer group" onClick={onSearch}>
                {/* Animated gradient border wrapper with enhanced glow */}
                <div
                  className="relative rounded-2xl p-[3px]"
                  style={{
                    background: 'conic-gradient(from var(--angle) at 50% 50%, #8b5cf6 0%, #3b82f6 40%, #06b6d4 70%, #8b5cf6 100%)',
                    animation: 'rotate-angle 4s linear infinite',
                  }}
                >
                  {/* Soft glow behind the border */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[14px] opacity-30 group-hover:opacity-50 transition-opacity"
                    style={{
                      background: 'conic-gradient(from var(--angle) at 50% 50%, #8b5cf6 0%, #3b82f6 40%, #06b6d4 70%, #8b5cf6 100%)',
                      filter: 'blur(16px)',
                      animation: 'rotate-angle 8s linear infinite',
                    }}
                  />
                <div className="relative rounded-2xl bg-white ring-1 ring-transparent group-hover:ring-gray-200 transition">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                    <MagnifyingGlassIcon className="w-6 h-6" />
                  </div>
                  
                  <input
                    readOnly
                    type="text"
                    className="w-full pl-16 pr-16 py-5 text-lg text-gray-600 placeholder:text-gray-400 bg-white rounded-2xl border border-transparent focus:outline-none transition-all cursor-pointer shadow-sm group-hover:bg-gray-50"
                    value={typedText}
                    placeholder=""
                  />
                </div>
                </div>
              </div>

              {/* How it works */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-sm font-medium text-gray-900">①</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Tell us what you need</div>
                    <div className="mt-1 text-xs text-gray-500 leading-relaxed">Describe the job or service you&apos;re looking for.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-sm font-medium text-gray-900">②</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Share your location</div>
                    <div className="mt-1 text-xs text-gray-500 leading-relaxed">Enter your postcode so we can find pros near you.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-sm font-medium text-gray-900">③</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Get matched instantly</div>
                    <div className="mt-1 text-xs text-gray-500 leading-relaxed">We&apos;ll match you with the right local trade.</div>
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
              src="/images/hero-2.png"
              alt="Skilled roofer working on a roof"
              fill
              priority
              className="object-cover scale-125"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

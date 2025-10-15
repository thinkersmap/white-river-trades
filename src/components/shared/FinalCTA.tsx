"use client";

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface FinalCTAProps {
  onSearch: () => void;
}

export function FinalCTA({ onSearch }: FinalCTAProps) {
  return (
    <section className="px-4 py-16 lg:py-24">
      <div className="max-w-[120rem] mx-auto">
        <div className="bg-white rounded-[16px] overflow-hidden">
          <div className="px-6 sm:px-8 lg:px-16 py-12 lg:py-20">
            <div className="text-center space-y-8 lg:space-y-10">
              {/* Main heading */}
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl leading-[1.1] font-normal tracking-[-0.02em] text-gray-900">
                  Ready to get started?
                </h2>
                <p className="mt-4 lg:mt-6 text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  Tell us what you need fixed or improved and where you live. We&apos;ll match you with trusted local trades ready to help.
                </p>
              </div>

              {/* Search bar */}
              <div className="relative max-w-2xl mx-auto cursor-pointer group" onClick={onSearch}>
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
                    <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-gray-400">
                      <MagnifyingGlassIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    
                    <input
                      readOnly
                      type="text"
                      className="w-full pl-12 sm:pl-16 pr-6 sm:pr-8 py-4 sm:py-5 text-base sm:text-lg bg-white rounded-2xl border border-transparent focus:outline-none transition-all cursor-pointer shadow-sm group-hover:bg-gray-50 tracking-tight"
                      value="Click me to search"
                      placeholder=""
                      style={{
                        color: 'transparent',
                        background: 'linear-gradient(90deg, #8b5cf6 0%, #3b82f6 50%, #06b6d4 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* How it works - clean design */}
              <div className="pt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
                  {/* Step 1 */}
                  <div className="group">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm group-hover:bg-gray-200 transition-colors duration-200">
                        1
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-gray-900">Tell us what you need</h3>
                        <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">Describe the job or service you&apos;re looking for.</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="group">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm group-hover:bg-gray-200 transition-colors duration-200">
                        2
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-gray-900">Share your location</h3>
                        <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">Enter your postcode so we can find pros near you.</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="group">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm group-hover:bg-gray-200 transition-colors duration-200">
                        3
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-gray-900">Get matched instantly</h3>
                        <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">We&apos;ll match you with the right local trade.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
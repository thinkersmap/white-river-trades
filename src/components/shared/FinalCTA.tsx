"use client";

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface FinalCTAProps {
  onSearch: () => void;
}

export function FinalCTA({ onSearch }: FinalCTAProps) {
  return (
    <section className="px-4 py-16 lg:py-24 relative overflow-hidden">
      {/* Subtle abstract background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-cyan-100/40 to-blue-100/40 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-purple-100/20 to-pink-100/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 right-1/3 w-16 h-16 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-xl animate-bounce" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-gradient-to-br from-purple-200/15 to-pink-200/15 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '6s', animationDelay: '1s' }} />
      </div>
      
      <div className="max-w-[120rem] mx-auto relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-[16px] overflow-hidden shadow-xl border border-white/20">
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

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
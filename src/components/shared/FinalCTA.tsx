"use client";

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface FinalCTAProps {
  onSearch: () => void;
}

export function FinalCTA({ onSearch }: FinalCTAProps) {
  return (
    <section className="px-4 py-20 lg:py-32">
      <div className="max-w-4xl mx-auto">
        {/* Simple, bold statement */}
        <div className="text-center mb-12">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Ready?
          </h2>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            Tell us what you need and we&apos;ll find the right tradesperson for you.
          </p>
        </div>

        {/* Large, prominent button */}
        <div className="text-center">
          <button
            onClick={onSearch}
            className="group relative inline-flex items-center justify-center px-12 py-6 text-xl font-semibold text-white bg-gray-900 rounded-2xl hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <MagnifyingGlassIcon className="w-6 h-6 mr-3" />
            Start your search
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
          </button>
        </div>
      </div>
    </section>
  );
}
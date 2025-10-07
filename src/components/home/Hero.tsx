import Image from 'next/image';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface HeroProps {
  onSearch: () => void;
  searchExamples: string[];
  placeholderIndex: number;
}

export function Hero({ onSearch, searchExamples, placeholderIndex }: HeroProps) {
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
                  Need work done? Discover local services near you.
                </h1>
                <p className="mt-4 lg:mt-6 text-lg lg:text-xl text-gray-600 leading-relaxed max-w-[95%] lg:max-w-[90%]">
                  Tell us what you need done and where you are. We&apos;ll show local businesses ready to help. Use the searchbox below to get started.
                </p>
              </div>

              <div className="relative max-w-2xl">
                <div 
                  className="relative cursor-pointer group"
                  onClick={onSearch}
                >
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                    <MagnifyingGlassIcon className="w-6 h-6" />
                  </div>
                  <input
                    readOnly
                    type="text"
                    className="w-full pl-16 pr-6 py-5 text-lg text-gray-900 placeholder:text-gray-500 bg-gray-50 rounded-2xl border border-gray-200/60 focus:outline-none group-hover:border-gray-300 group-hover:bg-white transition-all cursor-pointer shadow-sm"
                    placeholder={searchExamples[placeholderIndex]}
                  />
                </div>
              </div>

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
  );
}

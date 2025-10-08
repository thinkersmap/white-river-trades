"use client";

import { ArrowRightIcon, CheckIcon, ShieldCheckIcon, HeartIcon } from "@heroicons/react/20/solid";

interface JobBannerProps {
  tradeName: string;
}

export function JobBanner({ tradeName }: JobBannerProps) {

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 sm:p-12 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Save hours searching,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              we&apos;ll do the hard work
            </span>
          </h2>
          <p className="text-xl sm:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Tell us what you need, and we&apos;ll contact qualified {tradeName.toLowerCase()} companies and send you the top results.
          </p>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={() => console.log('Describe your job clicked')}
            className="px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-3 text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 mx-auto"
          >
            Describe your job
            <ArrowRightIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-8 text-slate-400">
            <div className="flex items-center gap-3">
              <CheckIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Free</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheckIcon className="w-5 h-5" />
              <span className="text-sm font-medium">No obligation</span>
            </div>
            <div className="flex items-center gap-3">
              <HeartIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Handled with care</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

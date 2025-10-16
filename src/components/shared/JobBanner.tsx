"use client";

import { useState, useEffect } from "react";
import { ArrowRightIcon, CheckIcon, ShieldCheckIcon, HeartIcon } from "@heroicons/react/20/solid";
import { JobDescriptionDialog } from "@/components/shared/JobDescriptionDialog";
import { getSearchData, clearSearchData } from "@/lib/searchData";
import { fbqTrack } from "@/lib/fbpixel";

interface JobBannerProps {
  tradeName: string;
  divisionName?: string;
  postcode?: string;
}

export function JobBanner({ tradeName, divisionName, postcode }: JobBannerProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [hasValidSearchData, setHasValidSearchData] = useState(false);
  const [problemDescription, setProblemDescription] = useState<string | undefined>(undefined);
  const [aiAnalysis, setAiAnalysis] = useState<string | undefined>(undefined);
  const [savedPostcode, setSavedPostcode] = useState<string | undefined>(undefined);
  const [savedDivision, setSavedDivision] = useState<string | undefined>(undefined);

  useEffect(() => {
    const data = getSearchData();
    const valid = !!data && data.selectedTrade === tradeName;
    setHasValidSearchData(valid);
    if (valid) {
      setProblemDescription(data.problemDescription || undefined);
      setAiAnalysis(data.aiAnalysis || undefined);
      setSavedPostcode(data.postcode || undefined);
      setSavedDivision(data.division || undefined);
    }
  }, [tradeName]);

  const handleDescribeClick = () => {
    const data = getSearchData();
    if (data && data.selectedTrade && data.selectedTrade !== tradeName) {
      clearSearchData();
    }

    // Prefer provided division/postcode from page when available
    const nextDivision = divisionName || data?.division;
    const nextPostcode = postcode || data?.postcode;
    setSavedDivision(nextDivision || undefined);
    setSavedPostcode(nextPostcode || undefined);
    setShowDialog(true);
    
    // Track StartLead when the dialog is opened
    fbqTrack('StartLead', {
      content_name: tradeName,
      content_category: 'trade',
      postcode: nextPostcode,
      division: nextDivision,
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 sm:p-8 lg:p-12 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Save hours searching,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              we&apos;ll do the hard work
            </span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
            Tell us what you need, and we&apos;ll contact qualified {tradeName.toLowerCase()} companies and send you the top results.
          </p>
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <button
            onClick={handleDescribeClick}
            className="px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-lg sm:text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 mx-auto w-full sm:w-auto"
          >
            Describe your job
            <ArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 text-slate-400">
            <div className="flex items-center gap-2 sm:gap-3">
              <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">Free</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">No obligation</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">Handled with care</span>
            </div>
          </div>
        </div>
      </div>

      <JobDescriptionDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        tradeName={tradeName}
        problemDescription={hasValidSearchData ? problemDescription : undefined}
        aiAnalysis={hasValidSearchData ? aiAnalysis : undefined}
        postcode={savedPostcode}
        division={savedDivision}
      />
    </div>
  );
}

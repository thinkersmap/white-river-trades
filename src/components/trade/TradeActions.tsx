"use client";

import React, { useState } from "react";
import { JobDescriptionDialog } from "@/components/shared/JobDescriptionDialog";
import { getSearchData, clearSearchData } from "@/lib/searchData";
import { fbqTrack } from "@/lib/fbpixel";
import { ProjectStep } from "@/types/search";

interface TradeActionsProps {
  tradeSlug: string;
  tradeName: string;
  constituencySlug?: string;
  constituencyName?: string;
  postcode?: string;
}

export function TradeActions({ tradeName, constituencyName, postcode }: TradeActionsProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [savedPostcode, setSavedPostcode] = useState<string | undefined>(undefined);
  const [savedDivision, setSavedDivision] = useState<string | undefined>(undefined);
  const [intent, setIntent] = useState<"problem" | "project" | undefined>(undefined);
  const [projectSteps, setProjectSteps] = useState<ProjectStep[] | undefined>(undefined);
  const [confidenceScore, setConfidenceScore] = useState<number | undefined>(undefined);
  
  // Get search data from localStorage and check for mismatch
  const searchData = getSearchData();
  const hasValidSearchData = searchData && searchData.selectedTrade === tradeName;

  // Clear search data if there's a mismatch and set project data
  React.useEffect(() => {
    console.log('TradeActions useEffect:', { searchData, tradeName, hasValidSearchData });
    if (searchData && searchData.selectedTrade && searchData.selectedTrade !== tradeName) {
      console.log('Trade mismatch detected, clearing data:', { saved: searchData.selectedTrade, current: tradeName });
      clearSearchData();
    } else if (hasValidSearchData) {
      setIntent(searchData?.intent || undefined);
      setProjectSteps(searchData?.projectSteps || undefined);
      setConfidenceScore(searchData?.confidenceScore || undefined);
    }
  }, [tradeName, searchData, hasValidSearchData]);

  const handleContinue = () => {
    // Get fresh search data
    const currentSearchData = getSearchData();
    
    // Only proceed if the trade matches
    if (currentSearchData && currentSearchData.selectedTrade && currentSearchData.selectedTrade !== tradeName) {
      console.log('Continue button: Trade mismatch detected, clearing data');
      clearSearchData();
      return; // Don't open dialog with mismatched data
    }
    
    // Prefer provided division/postcode from page when available, else from saved data
    const nextDivision = constituencyName || currentSearchData?.division;
    const nextPostcode = postcode || currentSearchData?.postcode;
    setSavedDivision(nextDivision || undefined);
    setSavedPostcode(nextPostcode || undefined);

    // Persist merged data for later flows
    const updatedSearchData = {
      ...currentSearchData,
      postcode: nextPostcode,
      division: nextDivision,
      selectedTrade: tradeName
    };
    localStorage.setItem('white-river-search-data', JSON.stringify({
      ...updatedSearchData,
      timestamp: Date.now()
    }));
    
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
    <>
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          onClick={handleContinue}
          className="flex-1 px-8 py-4 bg-gray-900 text-white text-lg font-medium rounded-xl hover:bg-gray-700 transition-colors shadow-sm"
        >
          Continue
        </button>
        <div className="relative flex-1">
          <div className="px-8 py-4 bg-white text-gray-400 text-lg font-medium rounded-xl border border-gray-200 transition-colors shadow-sm flex items-center justify-center cursor-not-allowed select-none">
            <span>Browse directory</span>
          </div>
          <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 border border-gray-200 shadow-sm">Coming soon</span>
        </div>
      </div>

      <JobDescriptionDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        tradeName={tradeName}
        problemDescription={hasValidSearchData ? searchData?.problemDescription : undefined}
        aiAnalysis={hasValidSearchData ? searchData?.aiAnalysis : undefined}
        postcode={savedPostcode}
        division={savedDivision}
        intent={hasValidSearchData ? intent : undefined}
        projectSteps={hasValidSearchData ? projectSteps : undefined}
        confidenceScore={hasValidSearchData ? confidenceScore : undefined}
      />
    </>
  );
}
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { JobDescriptionDialog } from "@/components/shared/JobDescriptionDialog";
import { getSearchData, clearSearchData } from "@/lib/searchData";

interface TradeActionsProps {
  tradeSlug: string;
  tradeName: string;
  constituencySlug?: string;
  constituencyName?: string;
  postcode?: string;
}

export function TradeActions({ tradeName, constituencySlug, constituencyName, postcode }: TradeActionsProps) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  
  // Get search data from localStorage and check for mismatch
  const searchData = getSearchData();
  const hasValidSearchData = searchData && searchData.selectedTrade === tradeName;

  // Clear search data if there's a mismatch
  React.useEffect(() => {
    console.log('TradeActions useEffect:', { searchData, tradeName, hasValidSearchData });
    if (searchData && searchData.selectedTrade && searchData.selectedTrade !== tradeName) {
      console.log('Trade mismatch detected, clearing data:', { saved: searchData.selectedTrade, current: tradeName });
      clearSearchData();
    }
  }, [tradeName, searchData]);

  const handleContinue = () => {
    // Get fresh search data
    const currentSearchData = getSearchData();
    
    // Only proceed if the trade matches
    if (currentSearchData && currentSearchData.selectedTrade && currentSearchData.selectedTrade !== tradeName) {
      console.log('Continue button: Trade mismatch detected, clearing data');
      clearSearchData();
      return; // Don't open dialog with mismatched data
    }
    
    // Save additional location data if available
    if (constituencyName || postcode) {
      const updatedSearchData = {
        ...currentSearchData,
        postcode: postcode || currentSearchData?.postcode,
        division: constituencyName || currentSearchData?.division,
        selectedTrade: tradeName
      };
      
      // Update localStorage with additional data
      if (updatedSearchData) {
        localStorage.setItem('white-river-search-data', JSON.stringify({
          ...updatedSearchData,
          timestamp: Date.now()
        }));
      }
    }
    
    setShowDialog(true);
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
        postcode={postcode || searchData?.postcode}
        division={constituencyName || searchData?.division}
      />
    </>
  );
}
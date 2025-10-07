"use client";

import { useRouter } from "next/navigation";

interface TradeActionsProps {
  tradeSlug: string;
  tradeName: string;
}

export function TradeActions({ tradeSlug, tradeName }: TradeActionsProps) {
  const router = useRouter();

  const handleGetQuotes = () => {
    // Implement logic for getting quotes
    console.log("Get free quotes clicked for", tradeSlug);
  };

  const handleBrowseAll = () => {
    router.push(`/${tradeSlug}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-6">
      <button
        onClick={handleGetQuotes}
        className="flex-1 px-8 py-4 bg-gray-900 text-white text-lg font-medium rounded-xl hover:bg-gray-700 transition-colors shadow-sm"
      >
        Get free quotes
      </button>
      <button
        onClick={handleBrowseAll}
        className="flex-1 px-8 py-4 bg-white text-gray-900 text-lg font-medium rounded-xl border border-gray-300 hover:border-gray-500 transition-colors shadow-sm"
      >
        Browse all {tradeName.toLowerCase()}
      </button>
    </div>
  );
}
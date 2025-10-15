"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getConstituencyFromPostcode } from "@/lib/postcodes";
import { saveSearchData } from "@/lib/searchData";
import { trades } from "@/data/trades";

interface PostcodeSearchProps {
  tradeSlug: string;
}

export function PostcodeSearch({ tradeSlug }: PostcodeSearchProps) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = value.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      const constituency = await getConstituencyFromPostcode(trimmed);
      
      // Get trade name from slug
      const trade = trades.find(t => t.slug === tradeSlug);
      const tradeName = trade?.name || tradeSlug;
      
      // Save search data with postcode and division information
      saveSearchData({
        problemDescription: '',
        aiAnalysis: '',
        selectedTrade: tradeName,
        postcode: trimmed,
        division: constituency.name
      });
      
      router.push(`/${tradeSlug}/${constituency.slug}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Postcode lookup failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="pt-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          inputMode="text"
          autoComplete="postal-code"
          placeholder="Enter your postcode (e.g. SW1A 1AA)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder:text-gray-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-black text-white font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Finding area...
            </span>
          ) : (
            "Find local pros"
          )}
        </button>
      </div>
      {error ? (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      ) : null}
    </form>
  );
}



import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getConstituencyFromPostcode } from '@/lib/postcodes';
import { trades } from '@/data/trades';
import { saveSearchData, clearSearchData } from '@/lib/searchData';

interface LocationStepProps {
  selectedTrade: string;
  tradeIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  problemDescription?: string;
  aiAnalysis?: string;
}

export function LocationStep({ selectedTrade, tradeIcon: Icon, problemDescription, aiAnalysis }: LocationStepProps) {
  const router = useRouter();
  const [postcode, setPostcode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear search data if the selected trade doesn't match the saved trade
  React.useEffect(() => {
    const savedData = localStorage.getItem('white-river-search-data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.selectedTrade && parsed.selectedTrade !== selectedTrade) {
          clearSearchData();
        }
      } catch (e) {
        // If there's an error parsing, clear the data
        console.warn('[LocationStep] failed to parse saved data', e);
        clearSearchData();
      }
    }
  }, [selectedTrade]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postcode.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const t0 = performance.now();
      console.log("[LocationStep] submit", { selectedTrade, postcode });
      const constituency = await getConstituencyFromPostcode(postcode);
      console.log("[LocationStep] constituency resolved", constituency, `in ${Math.round(performance.now()-t0)}ms`);
      
      // Save search data with postcode and division information
      // Always save postcode and division, even if no problem description
      saveSearchData({
        problemDescription: problemDescription || '',
        aiAnalysis: aiAnalysis || '',
        selectedTrade: selectedTrade,
        postcode: postcode,
        division: constituency.name
      });
      
      // Look up the trade by its display name and use its canonical slug
      const tradeSlug = trades.find(t => t.name === selectedTrade)?.slug
        || selectedTrade.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      
      // Redirect to the trade/constituency page
      const target = `/${tradeSlug}/${constituency.slug}`;
      console.log("[LocationStep] navigating to", target);
      router.push(target);
    } catch (error) {
      console.error("[LocationStep] error", error);
      setError(error instanceof Error ? error.message : 'Failed to find your constituency');
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
            <Icon className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-900 font-medium">{selectedTrade}</span>
          </div>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 tracking-[-0.01em] mb-3">Where are you located?</h2>
          <p className="text-base text-gray-500">Enter your postcode to find local trades in your area.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="space-y-6">
              <div>
                <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-2">
                  Postcode
                </label>
                <input
                  id="postcode"
                  autoFocus
                  type="text"
                  value={postcode}
                  onChange={(e) => {
                    setPostcode(e.target.value);
                    setError(null);
                  }}
                  className={`w-full px-4 py-3 text-base text-gray-900 placeholder:text-gray-500 bg-white rounded-lg border ${
                    error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200/60 focus:border-gray-300 focus:ring-black/5'
                  } focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="e.g. SW1A 1AA"
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-500">
                <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                </div>
                Your postcode is only used to match you with local trades
              </div>
            </div>
          </div>

          <div className="pt-4 pb-8">
            <button 
              type="submit"
              disabled={isLoading || !postcode.trim()}
              className="w-full py-4 bg-black text-white text-base font-medium rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Connecting...' : 'Connect to your area'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
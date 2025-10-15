"use client";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

interface ConstituencyData {
  constituency_name: string;
  region_name: string;
}

interface ConstituencyCardsProps {
  tradeSlug: string;
  tradeName: string;
}

const INITIAL_SHOW_COUNT = 8;

export function ConstituencyCards({ tradeSlug }: ConstituencyCardsProps) {
  const [constituenciesByRegion, setConstituenciesByRegion] = useState<Record<string, ConstituencyData[]>>({});
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    async function fetchConstituencies() {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
      );

      const { data: constituencies } = await supabase
        .from("constituencies_with_regions")
        .select("constituency_name, region_name")
        .order("region_name", { ascending: true })
        .order("constituency_name", { ascending: true });

      const constituenciesList = (constituencies ?? []) as ConstituencyData[];

      // Group constituencies by region
      const grouped = constituenciesList.reduce((acc, constituency) => {
        const region = constituency.region_name;
        if (!acc[region]) {
          acc[region] = [];
        }
        acc[region].push(constituency);
        return acc;
      }, {} as Record<string, ConstituencyData[]>);

      setConstituenciesByRegion(grouped);
      setLoading(false);
    }

    fetchConstituencies();
  }, []);

  const regions = Object.keys(constituenciesByRegion).sort();

  const toggleRegion = (region: string) => {
    setExpandedRegions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(region)) {
        newSet.delete(region);
      } else {
        newSet.add(region);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="mt-8">
        <div className="bg-white rounded-[16px] p-6 sm:p-8 lg:p-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading constituencies...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="bg-white rounded-[16px] p-6 sm:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
          </div>

          <div className="space-y-8">
            {regions.map((region) => {
              const constituencies = constituenciesByRegion[region];
              const isExpanded = expandedRegions.has(region);
              const showAll = isDesktop || isExpanded || constituencies.length <= INITIAL_SHOW_COUNT;
              const displayedConstituencies = showAll ? constituencies : constituencies.slice(0, INITIAL_SHOW_COUNT);
              const hasMore = !isDesktop && constituencies.length > INITIAL_SHOW_COUNT;

              return (
                <div key={region} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    {region}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {displayedConstituencies.map((constituency) => {
                      const constituencySlug = constituency.constituency_name
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^\w\-]/g, '');
                      
                      return (
                        <Link
                          key={constituency.constituency_name}
                          href={`/${tradeSlug}/${constituencySlug}`}
                          className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group border border-gray-200 hover:border-indigo-200"
                        >
                          <div>
                            <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                              {constituency.constituency_name}
                            </h4>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  {hasMore && (
                    <div className="pt-2">
                      <button
                        onClick={() => toggleRegion(region)}
                        className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                      >
                        {isExpanded 
                          ? `Show less (${constituencies.length - INITIAL_SHOW_COUNT} hidden)` 
                          : `Show all ${constituencies.length} local divisions`
                        }
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

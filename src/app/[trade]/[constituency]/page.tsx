import { use } from "react";
import { Navigation } from "@/components/home/Navigation";
import { getConstituencyBySlug } from "@/lib/getConstituencyData";
import { trades, homeServices } from "@/data/trades";

// Combine all work categories
const allWorkCategories = [...trades, ...homeServices];
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { TradeActions } from "@/components/trade/TradeActions";
import MapComponent from "@/components/map/MapComponent";
import { JobBanner } from "@/components/shared/JobBanner";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { supabase } from "@/lib/supabaseClient";

type CompanyCardRow = {
  CompanyName: string;
  "RegAddress.PostCode": string | null;
  IncorporationDate: string | null;
  constituency_name: string;
  latitude: number | null;
  longitude: number | null;
};

type Props = {
  params: Promise<{
    trade: string;
    constituency: string;
  }>;
};

export default function TradePage({ params }: Props) {
  const resolvedParams = use(params);
  const tradeSlug = resolvedParams.trade;
  const constituencySlug = resolvedParams.constituency;

  const constituencyData = use(getConstituencyBySlug(constituencySlug));
  if (!constituencyData) notFound();

  const trade = allWorkCategories.find((t) => t.slug === tradeSlug);
  if (!trade) notFound();

  const Icon = trade.icon;
  // Only fetch companies for roofing trade (only trade with company data available)

  const companiesResult = tradeSlug === 'roofing' ? use(
    (async () => {
      console.time('[trade page] fetch companies')
      if (!supabase) {
        console.warn('[trade page] Supabase not configured, skipping companies fetch')
        return { data: [] }
      }
      const res = await supabase
        .from("roofing_companies_enriched")
        .select('CompanyName, "RegAddress.PostCode", IncorporationDate, constituency_name, latitude, longitude')
        .ilike("constituency_name", constituencyData.name)
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .order("IncorporationDate", { ascending: true, nullsFirst: false })
        .limit(20)
      console.timeEnd('[trade page] fetch companies')
      if (res.error) {
        console.error('[trade page] supabase error', res.error)
      } else {
        console.log('[trade page] companies loaded', res.data?.length ?? 0)
      }
      return res
    })()
  ) : { data: [] };

  const companies = (companiesResult?.data ?? []) as CompanyCardRow[];

  // Fetch total count for the message
  const totalCountResult = tradeSlug === 'roofing' ? use(
    (async () => {
      console.time('[trade page] fetch total count')
      if (!supabase) {
        console.warn('[trade page] Supabase not configured, skipping count fetch')
        return { count: 0 }
      }
      const res = await supabase
        .from("roofing_companies_enriched")
        .select('*', { count: 'exact', head: true })
        .ilike("constituency_name", constituencyData.name)
      console.timeEnd('[trade page] fetch total count')
      if (res.error) console.error('[trade page] count error', res.error)
      else console.log('[trade page] total count', res.count)
      return res
    })()
  ) : { count: 0 };

  const totalCount = totalCountResult?.count ?? 0;

  // Get trade-specific override data if available
  const tradeOverrides = constituencyData.overrides?.tradeOverrides?.[tradeSlug];
  
  const breadcrumbItems = [
    { label: trade.name, href: `/${tradeSlug}` },
    { label: constituencyData.name },
  ];


  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      <Navigation />
      <div className="flex-1 p-4">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Content Container */}
          <div className="bg-white rounded-[16px] flex items-center">
            <div className="px-6 sm:px-8 lg:px-16 py-12 lg:py-20 w-full">
              <div className="space-y-8 lg:space-y-10">
                <Breadcrumbs 
                  items={breadcrumbItems} 
                  icon={<Icon className="w-4 h-4 text-gray-600" />}
                />

                {/* Title */}
                <div className="space-y-6">
                  <h1 className="text-4xl sm:text-5xl lg:text-[72px] leading-[1.1] font-normal tracking-[-0.02em] text-gray-900">
                    {trade.name} in {constituencyData.name}
                  </h1>
                </div>

                <p className="mt-4 lg:mt-6 text-lg lg:text-xl text-gray-600 leading-relaxed max-w-[95%] lg:max-w-[90%]">
                  {tradeOverrides?.intro ||
                    constituencyData.overrides?.shortDescription ||
                    `Find trusted ${trade.name.toLowerCase()} in ${constituencyData.name}. We'll match you with experienced professionals who understand local properties and requirements.`}
                </p>

                {/* Company count message for trades with company data */}
                {tradeSlug === 'roofing' && totalCount > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 font-medium">
                      We&apos;ve found {totalCount.toLocaleString()} companies in {constituencyData.name}
                    </p>
                  </div>
                )}

                {/* Areas Covered - Show if override data available */}
                {tradeOverrides?.areasCovered && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Areas covered</h3>
                    <div className="flex flex-wrap gap-2">
                      {tradeOverrides.areasCovered.map((area: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <TradeActions 
                  tradeSlug={trade.slug}
                  tradeName={trade.name}
                  constituencySlug={constituencySlug}
                  constituencyName={constituencyData?.name}
                />
              </div>
            </div>
          </div>

          {/* Right Map Container */}
          <div className="bg-[#e8eaed] rounded-[16px] overflow-hidden min-h-[400px] lg:sticky lg:top-4">
            <MapComponent constituency={constituencyData} companies={companies} />
          </div>
        </div>

        {/* Full Width Additional Content - Show if override data available */}
        {tradeOverrides && (
          <div className="mt-8">
            <div className="bg-white rounded-[16px] p-6 sm:p-8 lg:p-12">
              <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Services Section */}
                {tradeOverrides.services && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">Common services</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {tradeOverrides.services.map((service: string, index: number) => (
                        <div key={index} className="flex items-center space-x-3 text-gray-700">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                          <span>{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* When to Call */}
                {tradeOverrides.whenToCall && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">When to call a {trade.name.toLowerCase()}</h2>
                    <p className="text-gray-600 leading-relaxed">{tradeOverrides.whenToCall}</p>
                  </div>
                )}

                {/* What to Expect */}
                {tradeOverrides.whatToExpect && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">What to expect</h2>
                    <p className="text-gray-600 leading-relaxed">{tradeOverrides.whatToExpect}</p>
                  </div>
                )}

                {/* Pricing Insight */}
                {tradeOverrides.pricingInsight && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">Pricing insight</h2>
                    <p className="text-gray-600 leading-relaxed">{tradeOverrides.pricingInsight.summary}</p>
                    {tradeOverrides.pricingInsight.tips && tradeOverrides.pricingInsight.tips.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-gray-900">Money-saving tips</h3>
                        <ul className="space-y-2">
                          {tradeOverrides.pricingInsight.tips.map((tip: string, index: number) => (
                            <li key={index} className="flex items-start space-x-3 text-gray-600">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Nearby Areas */}
                {tradeOverrides.nearbyAreas && tradeOverrides.nearbyAreas.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">Nearby areas</h2>
                    <div className="flex flex-wrap gap-3">
                      {tradeOverrides.nearbyAreas.map((area: { name: string; slug: string }, index: number) => (
                        <a
                          key={index}
                          href={`/${tradeSlug}/${area.slug}`}
                          className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
                        >
                          {area.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Trades */}
                {tradeOverrides.relatedTrades && tradeOverrides.relatedTrades.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900">Related services</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {tradeOverrides.relatedTrades.map((relatedTrade: { tradeName: string; slug: string; reason: string }, index: number) => (
                        <a
                          key={index}
                          href={`/${relatedTrade.slug}`}
                          className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2">{relatedTrade.tradeName}</h3>
                              <p className="text-sm text-gray-600">{relatedTrade.reason}</p>
                            </div>
                            <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 ml-3" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* Local Companies Carousel - Removed per request */}

        {/* Job Banner */}
        <div className="mt-8">
          <JobBanner 
            tradeName={trade.name}
            divisionName={constituencyData?.name}
          />
        </div>

      </div>
    </div>
  );
}
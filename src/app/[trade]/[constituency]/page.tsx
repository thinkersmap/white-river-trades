import { use } from "react";
import { Navigation } from "@/components/home/Navigation";
import { getConstituencyBySlug } from "@/lib/getConstituencyData";
import { trades } from "@/data/trades";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { TradeActions } from "@/components/trade/TradeActions";
import MapComponent from "@/components/map/MapComponent";

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

  const trade = trades.find((t) => t.slug === tradeSlug);
  if (!trade) notFound();

  const Icon = trade.icon;

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
                <Breadcrumbs items={breadcrumbItems} />

                {/* Trade Icon */}
                <div className="space-y-6">
                  <div className="inline-block p-3 bg-gray-100 rounded-xl shadow-sm">
                    <Icon className="w-8 h-8 text-gray-600" />
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-[72px] leading-[1.1] font-normal tracking-[-0.02em] text-gray-900">
                    {trade.name} in {constituencyData.name}
                  </h1>
                </div>

                <p className="mt-4 lg:mt-6 text-lg lg:text-xl text-gray-600 leading-relaxed max-w-[95%] lg:max-w-[90%]">
                  {constituencyData.overrides?.shortDescription ||
                    `Find trusted ${trade.name.toLowerCase()} in ${constituencyData.name}. We'll match you with experienced professionals who understand local properties and requirements.`}
                </p>

                <TradeActions 
                  tradeSlug={trade.slug}
                  tradeName={trade.name}
                />

                {/* Stats */}
                <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 pt-6">
                  <div>
                    <div className="text-3xl sm:text-4xl lg:text-[48px] leading-none font-normal text-gray-900">
                      100+
                    </div>
                    <div className="mt-2 sm:mt-3 text-sm sm:text-[15px] text-gray-500 font-medium">
                      {trade.name} specialists<br />in {constituencyData.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl lg:text-[48px] leading-none font-normal text-gray-900">
                      500+
                    </div>
                    <div className="mt-2 sm:mt-3 text-sm sm:text-[15px] text-gray-500 font-medium">
                      Verified reviews<br />for local {trade.name.toLowerCase()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Map Container */}
          <div className="bg-[#e8eaed] rounded-[16px] overflow-hidden min-h-[400px] lg:sticky lg:top-4">
            <MapComponent constituency={constituencyData} />
          </div>
        </div>
      </div>
    </div>
  );
}
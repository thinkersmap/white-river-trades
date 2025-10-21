import Link from "next/link";
import { Navigation } from "@/components/home/Navigation";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { getConstituencyBySlug } from "@/lib/getConstituencyData";
import MapComponent from "@/components/map/MapComponent";
import { ProjectClient } from "./ProjectClient";
import { ProjectCTA } from "./ProjectCTA";

type Props = {
  params: Promise<{
    constituency: string;
  }>;
};

export default async function ProjectPage({ params }: Props) {
  const resolvedParams = await params;
  
  try {
    // Load constituency data on the server
    const constituencyData = await getConstituencyBySlug(resolvedParams.constituency);
    
    if (!constituencyData) {
      return (
        <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
          <Navigation />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
              <p className="text-gray-600 mb-6">We couldn&apos;t find the project for this location.</p>
              <Link
                href="/"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Over
              </Link>
            </div>
          </div>
        </div>
      );
    }

    const breadcrumbItems = [
      { label: 'Project' },
      { label: constituencyData.name }
    ];

    return (
      <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
        <Navigation />
        <div className="flex-1 p-4">
          <div className="max-w-[120rem] mx-auto">
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              {/* Left Content Container */}
              <div className="bg-white rounded-[16px] flex items-center">
                <div className="px-6 sm:px-8 lg:px-16 py-12 lg:py-20 w-full">
                  <div className="space-y-8 lg:space-y-10">
                    <Breadcrumbs items={breadcrumbItems} />

                    {/* Project Header */}
                    <div className="space-y-6">
                      <h1 className="text-4xl sm:text-5xl lg:text-[72px] leading-[1.1] font-normal tracking-[-0.02em] text-gray-900">
                        Your Project in {constituencyData.name}
                      </h1>
                    </div>

                    <p className="mt-4 lg:mt-6 text-lg lg:text-xl text-gray-600 leading-relaxed max-w-[95%] lg:max-w-[90%]">
                      We&apos;ll guide you through each step of your project. 
                      Each phase will be handled by the right professionals, ensuring quality and efficiency.
                    </p>

                    {/* Client Component for Interactive Parts */}
                    <ProjectClient constituencyData={constituencyData} />
                  </div>
                </div>
              </div>

              {/* Right Content Container - Constituency Map */}
              <div className="bg-[#e8eaed] rounded-[16px] overflow-hidden min-h-[400px] lg:sticky lg:top-4">
                <MapComponent constituency={constituencyData} />
              </div>
            </div>

            {/* Enhanced Process Section - Mobile Optimized */}
            <div className="bg-white rounded-[16px] p-4 sm:p-6 lg:p-12">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                    How Your Project Works
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                    We&apos;ve designed a streamlined process that ensures your project runs smoothly from start to finish. 
                    Here&apos;s exactly what happens at each stage.
                  </p>
                </div>

                {/* Enhanced Steps - Mobile Optimized */}
                <div className="space-y-6 sm:space-y-8 lg:space-y-12">
                  {/* Step 1 - Mobile Optimized */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3">Project Assessment & Planning</h3>
                        <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed mb-4">
                          We&apos;ll review your project details, assess requirements, and create a comprehensive plan with timelines, costs, and step-by-step breakdown.
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                          <span className="px-2 sm:px-3 py-1 bg-blue-200 text-blue-800 text-xs sm:text-sm font-medium rounded-full">Initial consultation</span>
                          <span className="px-2 sm:px-3 py-1 bg-blue-200 text-blue-800 text-xs sm:text-sm font-medium rounded-full">Requirements analysis</span>
                          <span className="px-2 sm:px-3 py-1 bg-blue-200 text-blue-800 text-xs sm:text-sm font-medium rounded-full">Cost estimation</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 - Mobile Optimized */}
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3">Team Assembly & Coordination</h3>
                        <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed mb-4">
                          We&apos;ll connect you with the right specialists for each phase, coordinate schedules, and ensure all professionals are aligned with your project goals.
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                          <span className="px-2 sm:px-3 py-1 bg-purple-200 text-purple-800 text-xs sm:text-sm font-medium rounded-full">Expert matching</span>
                          <span className="px-2 sm:px-3 py-1 bg-purple-200 text-purple-800 text-xs sm:text-sm font-medium rounded-full">Schedule coordination</span>
                          <span className="px-2 sm:px-3 py-1 bg-purple-200 text-purple-800 text-xs sm:text-sm font-medium rounded-full">Team briefing</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 - Mobile Optimized */}
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3">Phase-by-Phase Execution</h3>
                        <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed mb-4">
                          Qualified professionals will carry out the work with regular updates, quality checks, and seamless handoffs between phases.
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                          <span className="px-2 sm:px-3 py-1 bg-green-200 text-green-800 text-xs sm:text-sm font-medium rounded-full">Regular updates</span>
                          <span className="px-2 sm:px-3 py-1 bg-green-200 text-green-800 text-xs sm:text-sm font-medium rounded-full">Quality control</span>
                          <span className="px-2 sm:px-3 py-1 bg-green-200 text-green-800 text-xs sm:text-sm font-medium rounded-full">Progress tracking</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 - Mobile Optimized */}
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3">Final Review & Support</h3>
                        <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed mb-4">
                          We&apos;ll ensure everything meets your expectations, provide final quality checks, and offer ongoing support for any future needs.
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                          <span className="px-2 sm:px-3 py-1 bg-orange-200 text-orange-800 text-xs sm:text-sm font-medium rounded-full">Final inspection</span>
                          <span className="px-2 sm:px-3 py-1 bg-orange-200 text-orange-800 text-xs sm:text-sm font-medium rounded-full">Warranty support</span>
                          <span className="px-2 sm:px-3 py-1 bg-orange-200 text-orange-800 text-xs sm:text-sm font-medium rounded-full">Future maintenance</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Call to Action */}
                <ProjectCTA constituencyData={constituencyData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading project data:', error);
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Project</h1>
            <p className="text-gray-600 mb-6">Something went wrong. Please try again.</p>
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Over
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

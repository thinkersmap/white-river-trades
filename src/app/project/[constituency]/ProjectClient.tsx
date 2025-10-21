"use client";

import { useState, useEffect } from "react";
import { getSearchData, SearchData } from "@/lib/searchData";
import { fbqTrack } from "@/lib/fbpixel";
import { JobDescriptionDialog } from "@/components/shared/JobDescriptionDialog";
import { ProjectStep } from "@/types/search";

interface ProjectClientProps {
  constituencyData: {
    name: string;
    slug: string;
  };
}

export function ProjectClient({ constituencyData }: ProjectClientProps) {
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [projectSteps, setProjectSteps] = useState<ProjectStep[]>([]);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    // Load search data on the client side
    const savedSearchData = getSearchData();
    setSearchData(savedSearchData);

    // Get project steps from search data
    if (savedSearchData?.projectSteps) {
      setProjectSteps(savedSearchData.projectSteps);
    }

    // Track project page view
    fbqTrack('ProjectPageView', {
      content_name: constituencyData.name,
      content_category: 'project',
      constituency: constituencyData.name,
    });
  }, [constituencyData.name]);

  const handleStartProject = () => {
    // Track project start
    fbqTrack('ProjectStart', {
      content_name: 'project_workflow_started',
      content_category: 'project',
      constituency: constituencyData.name,
    });

    // Open the job description dialog
    setShowDialog(true);
  };


  return (
    <>
      {/* Project Overview */}
      {searchData?.overview && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Your Project</h3>
          <p className="text-blue-800 leading-relaxed">{searchData.overview}</p>
        </div>
      )}

      {/* Project Steps Preview */}
      {projectSteps.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">What We&apos;ll Do</h3>
          <div className="space-y-3">
            {projectSteps.slice(0, 2).map((step, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{step.stepName}</h4>
                  <p className="text-sm text-gray-600 mt-1">{step.stepDescription}</p>
                </div>
              </div>
            ))}
            {projectSteps.length > 2 && (
              <div className="text-center text-sm text-gray-500">
                +{projectSteps.length - 2} more phases
              </div>
            )}
          </div>
        </div>
      )}

      {/* Start Project Button */}
      <div className="pt-6">
        <button
          onClick={handleStartProject}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Start Your Project
        </button>
      </div>

      {/* Job Description Dialog */}
      <JobDescriptionDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        tradeName="Project Management"
        problemDescription={searchData?.problemDescription}
        aiAnalysis={searchData?.aiAnalysis}
        postcode={searchData?.postcode}
        division={constituencyData.name}
        intent="project"
        projectSteps={searchData?.projectSteps}
        confidenceScore={searchData?.confidenceScore}
      />
    </>
  );
}

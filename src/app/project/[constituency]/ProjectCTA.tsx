"use client";

import { useState } from "react";
import { fbqTrack } from "@/lib/fbpixel";
import { JobDescriptionDialog } from "@/components/shared/JobDescriptionDialog";

interface ProjectCTAProps {
  constituencyData: {
    name: string;
    slug: string;
  };
}

export function ProjectCTA({ constituencyData }: ProjectCTAProps) {
  const [showDialog, setShowDialog] = useState(false);

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
      <div className="text-center mt-8 sm:mt-12 lg:mt-16">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 sm:p-6 lg:p-8 border border-blue-200">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Ready to Start Your Project?</h3>
          <p className="text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg px-4">
            Begin your project journey with expert guidance and professional care. We&apos;ll handle every detail so you can focus on the results.
          </p>
          <button 
            onClick={handleStartProject}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base sm:text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto"
          >
            Start Your Project
          </button>
        </div>
      </div>

      {/* Job Description Dialog */}
      <JobDescriptionDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        tradeName="Project Management"
        division={constituencyData.name}
        intent="project"
      />
    </>
  );
}

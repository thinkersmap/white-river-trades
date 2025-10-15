"use client";

import { useState } from "react";
import { Dialog } from '@headlessui/react';
import { DialogHeader } from './DialogHeader';
import { constituenciesMeta } from '@/data/constituencies-meta';

interface JobDescriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tradeName: string;
  problemDescription?: string;
  aiAnalysis?: string;
  postcode?: string;
  division?: string;
}

export function JobDescriptionDialog({ 
  isOpen, 
  onClose, 
  tradeName, 
  problemDescription,
  aiAnalysis,
  postcode,
  division
}: JobDescriptionDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    problem: problemDescription || "",
    location: postcode || "",
    division: division || "",
    urgency: "medium",
    timeline: "",
    contactInfo: {
      name: "",
      email: "",
      phone: ""
    }
  });
  
  // State for inline editing
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  
  // State for problem input when no data exists
  const [problemInput, setProblemInput] = useState("");
  
  // State for field validation messages
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  
  // State for loading indicators
  const [isLoading, setIsLoading] = useState(false);
  
  // State for form submission
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // State for boundary data
  const [boundaryData, setBoundaryData] = useState<{geometry: {type: string, coordinates: number[][][] | number[][][][]}} | null>(null);
  const [boundaryLoading, setBoundaryLoading] = useState(false);
  
  

  // Dynamically determine which steps to show based on missing information
  const getAvailableSteps = () => {
    const steps = [];
    
    // Always start with summary
    steps.push({ id: "summary", title: "Job Summary" });
    
    // Add steps for missing mandatory information
    if (!postcode && !division) {
      steps.push({ id: "location", title: "Location" });
    }
    
    // Always show contact as the final step
    steps.push({ id: "contact", title: "Contact" });
    
    return steps;
  };

  const steps = getAvailableSteps();

  // Helper functions for inline editing
  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const saveEdit = async () => {
    if (editingField === 'problem') {
      setProblemInput(editValue);
      // Clear error when saving
      if (fieldErrors.problem) {
        setFieldErrors(prev => ({ ...prev, problem: '' }));
      }
      setEditingField(null);
      setEditValue("");
    } else if (editingField === 'location') {
      setIsLoading(true);
      // Clear any previous location errors
      setFieldErrors(prev => ({ ...prev, location: '' }));
      
      try {
        const response = await fetch(`/api/postcode?postcode=${encodeURIComponent(editValue)}`);
        const data = await response.json();
        
        if (data.success && data.constituency) {
          setFormData(prev => ({ 
            ...prev, 
            location: editValue,
            division: data.constituency.name 
          }));
        } else {
          // Show error if postcode lookup failed
          setFieldErrors(prev => ({ 
            ...prev, 
            location: 'Invalid postcode. Please check and try again.' 
          }));
          return; // Don't close editing mode if there's an error
        }
      } catch (error) {
        console.error('Error fetching postcode data:', error);
        setFieldErrors(prev => ({ 
          ...prev, 
          location: 'Error looking up postcode. Please try again.' 
        }));
        return; // Don't close editing mode if there's an error
      } finally {
        setIsLoading(false);
      }
      
      setEditingField(null);
      setEditValue("");
    } else if (editingField === 'additional') {
      setAdditionalInfo(editValue);
      setEditingField(null);
      setEditValue("");
    }
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };



  const handleNext = () => {
    const currentStepData = steps[currentStep];
    
    // Clear previous errors
    setFieldErrors({});
    
    // Validate mandatory fields based on current step
    if (currentStepData?.id === 'summary') {
      if (!problemDescription && !problemInput.trim()) {
        setFieldErrors({ problem: 'Please add a problem description before continuing' });
        return; // Don't advance if no problem description
      }
    }
    
    if (currentStepData?.id === 'location') {
      if (!formData.location.trim()) {
        setFieldErrors({ location: 'Please enter a location before continuing' });
        return; // Don't advance if location is empty
      }
    }
    
    if (currentStepData?.id === 'contact') {
      if (!formData.contactInfo.name.trim()) {
        setFieldErrors({ name: 'Please enter your name before continuing' });
        return; // Don't advance if name is empty
      }
      if (!formData.contactInfo.email.trim()) {
        setFieldErrors({ email: 'Please enter your email before continuing' });
        return; // Don't advance if email is empty
      }
      if (!formData.contactInfo.phone.trim()) {
        setFieldErrors({ phone: 'Please enter your phone number before continuing' });
        return; // Don't advance if phone is empty
      }
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Function to load constituency boundary data
  const loadBoundaryData = async (constituencyName: string) => {
    if (!constituencyName) return;
    
    setBoundaryLoading(true);
    try {
      // Find the constituency by name
      const constituency = constituenciesMeta.find(c => 
        c.name.toLowerCase() === constituencyName.toLowerCase()
      );
      
      if (!constituency) {
        console.warn('Constituency not found:', constituencyName);
        return;
      }
      
      // Load the GeoJSON file
      const response = await fetch(`/data/constituencies/${constituency.slug}.geojson`);
      if (!response.ok) {
        throw new Error('Failed to load boundary data');
      }
      
      const geojson = await response.json();
      setBoundaryData(geojson);
    } catch (error) {
      console.error('Error loading boundary data:', error);
    } finally {
      setBoundaryLoading(false);
    }
  };

  // Function to convert GeoJSON coordinates to SVG path
  const convertGeoJSONToSVGPath = (geometry: {type: string, coordinates: number[][][] | number[][][][]}, width: number = 160, height: number = 160) => {
    if (!geometry || !geometry.coordinates) return '';
    
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    // Find bounding box
    const processCoordinates = (coords: number[] | number[][] | number[][][] | number[][][][]) => {
      if (Array.isArray(coords[0])) {
        (coords as number[][] | number[][][] | number[][][][]).forEach(processCoordinates);
      } else if (coords.length >= 2) {
        const [x, y] = coords as number[];
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    };
    
    processCoordinates(geometry.coordinates);
    
    if (minX === Infinity) return '';
    
    // Calculate scale and offset
    const scaleX = width / (maxX - minX);
    const scaleY = height / (maxY - minY);
    const scale = Math.min(scaleX, scaleY) * 0.8; // 0.8 for padding
    const offsetX = (width - (maxX - minX) * scale) / 2;
    const offsetY = (height - (maxY - minY) * scale) / 2;
    
    // Convert coordinates to SVG path
    const convertRing = (ring: number[][]) => {
      return ring.map(([x, y]) => {
        const svgX = (x - minX) * scale + offsetX;
        const svgY = height - ((y - minY) * scale + offsetY); // Flip Y axis
        return `${svgX},${svgY}`;
      }).join(' ');
    };
    
    if (geometry.type === 'Polygon') {
      const rings = geometry.coordinates as number[][][];
      return rings.map((ring: number[][], index: number) => {
        const path = convertRing(ring);
        return index === 0 ? `M ${path} Z` : `M ${path} Z`;
      }).join(' ');
    } else if (geometry.type === 'MultiPolygon') {
      return (geometry.coordinates as number[][][][]).map((polygon: number[][][]) => {
        return polygon.map((ring: number[][], index: number) => {
          const path = convertRing(ring);
          return index === 0 ? `M ${path} Z` : `M ${path} Z`;
        }).join(' ');
      }).join(' ');
    }
    
    return '';
  };

  const handleSubmit = () => {
    // Clear previous errors
    setFieldErrors({});
    
    // Validate all required fields before submission
    const errors: {[key: string]: string} = {};
    
    // Check problem description
    if (!problemDescription && !problemInput.trim()) {
      errors.problem = 'Please add a problem description before submitting';
    }
    
    // Check location (if not pre-filled)
    if (!postcode && !division && !formData.location.trim()) {
      errors.location = 'Please enter a location before submitting';
    }
    
    // Check contact information
    if (!formData.contactInfo.name.trim()) {
      errors.name = 'Please enter your name before submitting';
    }
    if (!formData.contactInfo.email.trim()) {
      errors.email = 'Please enter your email before submitting';
    }
    if (!formData.contactInfo.phone.trim()) {
      errors.phone = 'Please enter your phone number before submitting';
    }
    
    // If there are validation errors, show them and don't submit
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    // Handle form submission
    console.log("Job description submitted:", formData);
    setIsSubmitted(true);
    
    // Load boundary data for the constituency
    const constituencyName = formData.division || division;
    if (constituencyName) {
      loadBoundaryData(constituencyName);
    }
  };

  const renderSuccessScreen = () => {
    return (
      <div className="p-6 sm:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Main Status */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Finding {tradeName.toLowerCase()} professionals
            </h1>
            <p className="text-gray-600">
              We&apos;re contacting qualified companies in {formData.division || division}
            </p>
          </div>

          {/* Current Status Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">We&apos;ll call you within 24 hours</h3>
                <p className="text-sm text-gray-600">Keep your phone nearby - we&apos;ll confirm your job details</p>
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>

          {/* Simple Job Summary */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Your Job</h3>
            <div className="space-y-3">
              {/* Service - stacked on mobile, inline on sm+ */}
              <div className="sm:flex sm:items-center sm:justify-between">
                <span className="text-gray-700">Service</span>
                <div className="mt-1 sm:mt-0 font-medium text-gray-900">{tradeName}</div>
              </div>
              {/* Location - stacked on mobile, inline on sm+ */}
              <div className="sm:flex sm:items-center sm:justify-between">
                <span className="text-gray-700">Location</span>
                <div className="mt-1 sm:mt-0 font-medium text-gray-900">{formData.location || postcode || formData.division || division}</div>
              </div>
              {(problemDescription || problemInput) && (
                <div className="pt-3 border-t border-gray-100">
                  <span className="text-gray-700 text-sm">Description</span>
                  <p className="text-sm text-gray-900 mt-1">
                    &ldquo;{problemDescription || problemInput}&rdquo;
                  </p>
                </div>
              )}
              
              <div className="pt-3 border-t border-gray-100">
                <span className="text-gray-700 text-sm">Contact</span>
                <div className="mt-1 space-y-1">
                  <p className="text-sm font-medium text-gray-900">{formData.contactInfo.name}</p>
                  <p className="text-sm text-gray-900">{formData.contactInfo.email}</p>
                  <p className="text-sm text-gray-900">{formData.contactInfo.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* What happens next */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">What happens next?</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">We call you to confirm details</p>
                  <p className="text-xs text-gray-600">Usually within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-gray-600">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Companies send quotes</p>
                  <p className="text-xs text-gray-600">You&apos;ll receive 2-3 detailed quotes</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-gray-600">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Choose and book</p>
                  <p className="text-xs text-gray-600">Compare quotes and book your preferred company</p>
                </div>
              </div>
            </div>
          </div>

          {/* Example Quote Link */}
          <div className="text-center mt-6">
            <a
              href="/example-quote"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>See example quote</span>
            </a>
          </div>
        </div>
      </div>
    );
  };


  const renderStep = () => {
    const currentStepData = steps[currentStep];
    if (!currentStepData) return null;

    switch (currentStepData.id) {


      case "summary":
        return (
          <div className="p-4 sm:p-6 space-y-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 tracking-[-0.01em] mb-3">
                  Job Summary
                </h2>
                <p className="text-base text-gray-700">
                  Here&apos;s what we understand about your project
                </p>
              </div>

              <div className="space-y-6">
                {/* Problem Card - show if we have data or allow adding */}
                {(problemDescription || problemInput) ? (
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">Your Problem</h4>
                          {editingField !== 'problem' && (
                            <button
                              onClick={() => startEditing('problem', problemDescription || problemInput)}
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                        {editingField === 'problem' ? (
                          <div className="space-y-3">
                            <textarea
                              value={editValue}
                              onChange={(e) => {
                                setEditValue(e.target.value);
                                // Clear error when user starts typing
                                if (fieldErrors.problem) {
                                  setFieldErrors(prev => ({ ...prev, problem: '' }));
                                }
                              }}
                              className={`w-full h-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-500 ${
                                fieldErrors.problem 
                                  ? 'border-red-300 focus:ring-red-500' 
                                  : 'border-gray-300 focus:ring-blue-500'
                              }`}
                              placeholder="Describe your problem in detail..."
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={saveEdit}
                                disabled={!editValue.trim()}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-900 leading-relaxed">&ldquo;{problemDescription || problemInput}&rdquo;</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`bg-gray-50 rounded-lg p-6 border ${fieldErrors.problem ? 'border-red-300' : 'border-gray-200 border-dashed'}`}>
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">Your Problem</h4>
                        <p className="text-gray-600 text-sm mb-3">Describe what&apos;s wrong or what you need done</p>
                        {fieldErrors.problem && (
                          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{fieldErrors.problem}</p>
                          </div>
                        )}
                        {editingField === 'problem' ? (
                          <div className="space-y-3">
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-500"
                              placeholder="Describe your problem in detail..."
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={saveEdit}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEditing('problem', '')}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-2 rounded hover:bg-blue-50 transition-colors"
                          >
                            + Add problem description
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}



                {/* AI Analysis Card - only show if we have data from homepage */}
                {aiAnalysis && (
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">AI Analysis</h4>
                        <p className="text-gray-700 leading-relaxed text-sm">{aiAnalysis}</p>
                      </div>
                    </div>
                  </div>
                )}


                {/* Trade Card */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Selected Service</h4>
                      <p className="text-gray-700">{tradeName}</p>
                    </div>
                  </div>
                </div>

                {/* Location Card - Show if we have any location data */}
                {(formData.location || formData.division) && (
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">Location</h4>
                          <button
                            onClick={() => startEditing('location', formData.location)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                        {editingField === 'location' ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => {
                                setEditValue(e.target.value);
                                // Clear error when user starts typing
                                if (fieldErrors.location) {
                                  setFieldErrors(prev => ({ ...prev, location: '' }));
                                }
                              }}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 placeholder:text-gray-500 ${
                                fieldErrors.location 
                                  ? 'border-red-300 focus:ring-red-500' 
                                  : 'border-gray-300 focus:ring-blue-500'
                              }`}
                              placeholder="Enter postcode or address"
                              disabled={isLoading}
                            />
                            {fieldErrors.location && (
                              <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-600">{fieldErrors.location}</p>
                              </div>
                            )}
                            <div className="flex space-x-2">
                              <button
                                onClick={saveEdit}
                                disabled={isLoading || !editValue.trim()}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                              >
                                {isLoading ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Looking up...
                                  </>
                                ) : (
                                  'Save'
                                )}
                              </button>
                              <button
                                onClick={cancelEdit}
                                disabled={isLoading}
                                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-900 space-y-1">
                            {formData.location && (
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500 uppercase tracking-wide">Postcode:</span>
                                <span className="font-mono text-sm bg-white px-2 py-1 rounded border text-gray-900">
                                  {formData.location}
                                </span>
                              </div>
                            )}
                            {formData.division && (
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500 uppercase tracking-wide">Division:</span>
                                <span className="text-sm text-gray-900">{formData.division}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Add Location if none exists */}
                {!formData.location && !formData.division && (
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 border-dashed">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">Add Location</h4>
                        <p className="text-gray-700 text-sm mb-3">Let tradespeople know where the work needs to be done.</p>
                        <button
                          onClick={() => startEditing('location', '')}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-2 rounded hover:bg-blue-50 transition-colors"
                        >
                          + Add location
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                {additionalInfo ? (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">Additional Information</h4>
                          {editingField !== 'additional' && (
                            <button
                              onClick={() => startEditing('additional', additionalInfo)}
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      {editingField === 'additional' ? (
                        <div className="space-y-3">
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-500"
                            placeholder="Add any additional details..."
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setAdditionalInfo(editValue);
                                setEditingField(null);
                                setEditValue("");
                              }}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                          <p className="text-gray-900 text-sm leading-relaxed">{additionalInfo}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 border-dashed">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-2">Additional Information</h4>
                        <p className="text-gray-600 text-sm mb-3">Add any extra details that might help tradespeople understand your project better.</p>
                        {editingField === 'additional' ? (
                          <div className="space-y-3">
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-500"
                              placeholder="Add any additional details..."
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setAdditionalInfo(editValue);
                                  setEditingField(null);
                                  setEditValue("");
                                }}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEditing('additional', '')}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-2 rounded hover:bg-blue-50 transition-colors"
                            >
                              + Add additional information
                            </button>
                          )}
                        </div>
                    </div>
                  </div>
                )}

              </div>

              <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">Ready to get quotes?</h4>
                  <p className="text-sm text-gray-600">
                    We&apos;ll connect you with verified {tradeName.toLowerCase()} professionals in your area
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "problem":
        return (
          <div className="p-4 sm:p-6 space-y-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 tracking-[-0.01em] mb-3">
                  Describe Your Problem
                </h2>
                <p className="text-base text-gray-700">
                  Tell us what&apos;s wrong or what you need done
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Problem Description</label>
                  <textarea
                    value={formData.problem}
                    onChange={(e) => setFormData(prev => ({ ...prev, problem: e.target.value }))}
                    className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none text-gray-900 placeholder:text-gray-500"
                    placeholder="Describe your problem in detail..."
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "location":
        return (
          <div className="p-4 sm:p-6 space-y-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 tracking-[-0.01em] mb-3">
                  Location Details
                </h2>
                <p className="text-base text-gray-700">
                  Where is the work needed?
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Property Address</label>
                  {fieldErrors.location && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{fieldErrors.location}</p>
                    </div>
                  )}
                  <input
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, location: e.target.value }));
                      // Clear error when user starts typing
                      if (fieldErrors.location) {
                        setFieldErrors(prev => ({ ...prev, location: '' }));
                      }
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-500 ${
                      fieldErrors.location 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-200 focus:ring-black'
                    }`}
                    placeholder="Enter full address or postcode"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "urgency":
        return (
          <div className="p-4 sm:p-6 space-y-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 tracking-[-0.01em] mb-3">
                  Timeline & Urgency
                </h2>
                <p className="text-base text-gray-700">
                  When do you need this work completed?
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">How urgent is this?</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-gray-900"
                  >
                    <option value="low">Low - Can wait a few weeks</option>
                    <option value="medium">Medium - Within a week</option>
                    <option value="high">High - Within 24-48 hours</option>
                    <option value="emergency">Emergency - Same day</option>
                  </select>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Preferred Timeline</label>
                  <input
                    type="text"
                    value={formData.timeline}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-gray-900 placeholder:text-gray-500"
                    placeholder="e.g., Next weekend, Within 2 weeks"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="p-4 sm:p-6 space-y-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 tracking-[-0.01em] mb-3">
                  Contact Information
                </h2>
                <p className="text-base text-gray-700">
                  How should tradespeople reach you?
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Full Name</label>
                  <input
                    type="text"
                    value={formData.contactInfo.name}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contactInfo: { ...prev.contactInfo, name: e.target.value }
                    }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-gray-900 placeholder:text-gray-500 ${
                      fieldErrors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Your full name"
                  />
                  {fieldErrors.name && (
                    <p className="text-red-600 text-sm mt-2">{fieldErrors.name}</p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                  <p className="text-xs text-gray-700 mb-3">Used to send you quotes and project updates</p>
                  <input
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contactInfo: { ...prev.contactInfo, email: e.target.value }
                    }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-gray-900 placeholder:text-gray-500 ${
                      fieldErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {fieldErrors.email && (
                    <p className="text-red-600 text-sm mt-2">{fieldErrors.email}</p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
                  <p className="text-xs text-gray-700 mb-3">Used to contact you and confirm job details</p>
                  <input
                    type="tel"
                    value={formData.contactInfo.phone}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contactInfo: { ...prev.contactInfo, phone: e.target.value }
                    }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-gray-900 placeholder:text-gray-500 ${
                      fieldErrors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Your phone number"
                  />
                  {fieldErrors.phone && (
                    <p className="text-red-600 text-sm mt-2">{fieldErrors.phone}</p>
                  )}
                </div>
              </div>

              <div className="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">
                      <strong>Privacy protected:</strong> Your contact details are only shared with verified tradespeople who match your requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md" aria-hidden="true" />
      
      <div className="fixed inset-0 flex flex-col">
        <Dialog.Panel className="flex flex-col w-full h-full bg-white sm:h-[calc(100vh-80px)] sm:max-w-5xl sm:mx-auto sm:my-10 sm:rounded-lg">
          {!isSubmitted ? (
            <>
          <DialogHeader
            onClose={onClose}
            onBack={currentStep > 0 ? handlePrevious : undefined}
            step={currentStep + 1}
            totalSteps={steps.length}
          />

          <div className="flex-1 overflow-y-auto">
            {renderStep()}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 sm:p-6">
            <div className="max-w-2xl mx-auto flex justify-end space-x-3">
              {currentStep === steps.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-black text-white text-base font-medium rounded-xl hover:bg-gray-900 transition-colors"
                >
                  Submit Request
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={steps[currentStep]?.id === 'location' && !formData.location.trim()}
                  className="px-8 py-3 bg-black text-white text-base font-medium rounded-xl hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </div>
            </>
          ) : (
            <>
              <DialogHeader
                onClose={onClose}
                step={1}
                totalSteps={1}
              />

              <div className="flex-1 overflow-y-auto">
                {renderSuccessScreen()}
              </div>
            </>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  </>
  );
}

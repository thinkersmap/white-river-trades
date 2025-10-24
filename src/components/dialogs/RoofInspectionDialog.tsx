"use client";

import { useState } from "react";
import { Dialog } from '@headlessui/react';
import { DialogHeader } from '../shared/DialogHeader';
import { fbqTrack } from "@/lib/fbpixel";
import { ExclamationTriangleIcon, CheckCircleIcon, ClockIcon, HomeIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

interface RoofInspectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  urgency?: "immediate" | "urgent" | "soon";
}

export function RoofInspectionDialog({ 
  isOpen, 
  onClose,
  urgency = "soon"
}: RoofInspectionDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    problem: "",
    location: "",
    division: "",
    urgency: urgency,
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
  
  // State for field validation messages
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  
  // State for loading indicators
  const [isLoading, setIsLoading] = useState(false);
  
  // State for form submission
  const [isSubmitted, setIsSubmitted] = useState(false);

  const steps = [
    { id: "summary", title: "Inspection Details" },
    { id: "location", title: "Location" },
    { id: "contact", title: "Contact" }
  ];

  // Helper functions for inline editing
  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const saveEdit = async () => {
    if (editingField === 'problem') {
      setFormData(prev => ({ ...prev, problem: editValue }));
      if (fieldErrors.problem) {
        setFieldErrors(prev => ({ ...prev, problem: '' }));
      }
      setEditingField(null);
      setEditValue("");
    } else if (editingField === 'location') {
      setIsLoading(true);
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
          setFieldErrors(prev => ({ 
            ...prev, 
            location: 'Invalid postcode. Please check and try again.' 
          }));
          return;
        }
      } catch (error) {
        console.error('Error fetching postcode data:', error);
        setFieldErrors(prev => ({ 
          ...prev, 
          location: 'Error looking up postcode. Please try again.' 
        }));
        return;
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
    setFieldErrors({});
    
    if (currentStepData?.id === 'summary') {
      if (!formData.problem.trim()) {
        setFieldErrors({ problem: 'Please describe your roof concerns before continuing' });
        return;
      }
    }
    
    if (currentStepData?.id === 'location') {
      if (!formData.location.trim()) {
        setFieldErrors({ location: 'Please enter a location before continuing' });
        return;
      }
    }
    
    if (currentStepData?.id === 'contact') {
      if (!formData.contactInfo.name.trim()) {
        setFieldErrors({ name: 'Please enter your name before continuing' });
        return;
      }
      if (!formData.contactInfo.email.trim()) {
        setFieldErrors({ email: 'Please enter your email before continuing' });
        return;
      }
      if (!formData.contactInfo.phone.trim()) {
        setFieldErrors({ phone: 'Please enter your phone number before continuing' });
        return;
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

  const handleSubmit = async () => {
    setFieldErrors({});
    
    const errors: {[key: string]: string} = {};
    
    if (!formData.problem.trim()) {
      errors.problem = 'Please describe your roof concerns before submitting';
    }
    
    if (!formData.location.trim()) {
      errors.location = 'Please enter a location before submitting';
    }
    
    if (!formData.contactInfo.name.trim()) {
      errors.name = 'Please enter your name before submitting';
    }
    if (!formData.contactInfo.email.trim()) {
      errors.email = 'Please enter your email before submitting';
    }
    if (!formData.contactInfo.phone.trim()) {
      errors.phone = 'Please enter your phone number before submitting';
    }
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const submissionData = {
        tradeName: "Roof Inspection",
        problemDescription: formData.problem,
        location: formData.location,
        division: formData.division,
        contactInfo: formData.contactInfo,
        additionalInfo,
        urgency: formData.urgency,
        timeline: formData.timeline,
        intent: 'problem',
        aiAnalysis: ''
      };

      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit lead');
      }

      setIsSubmitted(true);
      fbqTrack('Lead', {
        content_name: 'Roof Inspection',
        content_category: 'roofing',
        value: undefined,
        currency: 'GBP',
        postcode: formData.location,
        division: formData.division,
      });

    } catch (error) {
      console.error('Error submitting lead:', error);
      setFieldErrors({
        submit: 'Failed to submit your request. Please try again or contact us directly.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderSuccessScreen = () => {
    return (
      <div className="p-6 sm:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Main Status */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              We&apos;ll contact you within 24 hours
            </h1>
            <p className="text-gray-600">
              We&apos;re connecting you with reputable roofing professionals in {formData.division || formData.location}
            </p>
          </div>

          {/* Current Status Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <WrenchScrewdriverIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  We&apos;ll call you within 24 hours
                </h3>
                <p className="text-sm text-gray-600">
                  Keep your phone nearby - we&apos;ll confirm your inspection details and connect you with qualified roofers
                </p>
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>

          {/* Job Summary */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Your Inspection Request</h3>
            <div className="space-y-3">
              <div className="sm:flex sm:items-center sm:justify-between">
                <span className="text-gray-700">Service</span>
                <div className="mt-1 sm:mt-0 font-medium text-gray-900">Professional Roof Inspection</div>
              </div>
              <div className="sm:flex sm:items-center sm:justify-between">
                <span className="text-gray-700">Location</span>
                <div className="mt-1 sm:mt-0 font-medium text-gray-900">{formData.location || formData.division}</div>
              </div>
              <div className="sm:flex sm:items-center sm:justify-between">
                <span className="text-gray-700">Urgency</span>
                <div className="mt-1 sm:mt-0 font-medium text-gray-900 capitalize">{formData.urgency}</div>
              </div>
              {formData.problem && (
                <div className="pt-3 border-t border-gray-100">
                  <span className="text-gray-700 text-sm">Your Concerns</span>
                  <p className="text-sm text-gray-900 mt-1">
                    &ldquo;{formData.problem}&rdquo;
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
                  <CheckCircleIcon className="w-3 h-3 text-green-600" />
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
                  <p className="text-sm font-medium text-gray-900">We refer qualified roofers</p>
                  <p className="text-xs text-gray-600">We&apos;ll connect you with 2-3 reputable roofing companies</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-gray-600">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Schedule your inspection</p>
                  <p className="text-xs text-gray-600">Choose your preferred roofer and book your inspection</p>
                </div>
              </div>
            </div>
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
                  Describe Your Roof Concerns
                </h2>
                <p className="text-base text-gray-700">
                  Tell us what you&apos;ve noticed about your roof so we can connect you with the right professionals
                </p>
              </div>

              <div className="space-y-6">
                {/* Problem Card */}
                <div className={`bg-gray-50 rounded-lg p-6 border ${fieldErrors.problem ? 'border-red-300' : 'border-gray-200'}`}>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">What concerns you about your roof?</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Describe any issues you&apos;ve noticed, warning signs, or general concerns
                      </p>
                      {fieldErrors.problem && (
                        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-sm text-red-600">{fieldErrors.problem}</p>
                        </div>
                      )}
                      {editingField === 'problem' ? (
                        <div className="space-y-3">
                          <textarea
                            value={editValue}
                            onChange={(e) => {
                              setEditValue(e.target.value);
                              if (fieldErrors.problem) {
                                setFieldErrors(prev => ({ ...prev, problem: '' }));
                              }
                            }}
                            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-500"
                            placeholder="e.g., I've noticed water stains on my ceiling, or my roof tiles look damaged..."
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
                          onClick={() => startEditing('problem', formData.problem)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-2 rounded hover:bg-blue-50 transition-colors"
                        >
                          {formData.problem ? 'Edit description' : '+ Add roof concerns'}
                        </button>
                      )}
                      {formData.problem && (
                        <p className="text-gray-900 leading-relaxed mt-3">&ldquo;{formData.problem}&rdquo;</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Urgency Card */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ClockIcon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">How urgent is this?</h4>
                      <select
                        value={formData.urgency}
                        onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value as "immediate" | "urgent" | "soon" }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                      >
                        <option value="soon">Soon - Within a few weeks</option>
                        <option value="urgent">Urgent - Within a week</option>
                        <option value="immediate">Immediate - Within 24-48 hours</option>
                      </select>
                    </div>
                  </div>
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
                  Where is the roof inspection needed?
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <HomeIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Property Address</h4>
                      {fieldErrors.location && (
                        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-sm text-red-600">{fieldErrors.location}</p>
                        </div>
                      )}
                      {editingField === 'location' ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => {
                              setEditValue(e.target.value);
                              if (fieldErrors.location) {
                                setFieldErrors(prev => ({ ...prev, location: '' }));
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                            placeholder="Enter postcode or address"
                            disabled={isLoading}
                          />
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
                        <button
                          onClick={() => startEditing('location', formData.location)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-2 rounded hover:bg-blue-50 transition-colors"
                        >
                          {formData.location ? 'Edit location' : '+ Add location'}
                        </button>
                      )}
                      {formData.location && (
                        <div className="text-gray-900 space-y-1 mt-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 uppercase tracking-wide">Postcode:</span>
                            <span className="font-mono text-sm bg-white px-2 py-1 rounded border text-gray-900">
                              {formData.location}
                            </span>
                          </div>
                          {formData.division && (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500 uppercase tracking-wide">Area:</span>
                              <span className="text-sm text-gray-900">{formData.division}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
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
                  How should we reach you?
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-500 ${
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
                  <p className="text-xs text-gray-700 mb-3">Used to send you updates about your inspection</p>
                  <input
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contactInfo: { ...prev.contactInfo, email: e.target.value }
                    }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-500 ${
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
                  <p className="text-xs text-gray-700 mb-3">Used to contact you and confirm inspection details</p>
                  <input
                    type="tel"
                    value={formData.contactInfo.phone}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contactInfo: { ...prev.contactInfo, phone: e.target.value }
                    }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-500 ${
                      fieldErrors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Your phone number"
                  />
                  {fieldErrors.phone && (
                    <p className="text-red-600 text-sm mt-2">{fieldErrors.phone}</p>
                  )}
                </div>
              </div>

              <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircleIcon className="w-3 h-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">
                      <strong>Privacy protected:</strong> Your contact details are only shared with verified roofing professionals we refer to you.
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
                <div className="max-w-2xl mx-auto">
                  {fieldErrors.submit && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{fieldErrors.submit}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3">
                    {currentStep === steps.length - 1 ? (
                      <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-8 py-3 bg-blue-600 text-white text-base font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          'Request Inspection'
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        disabled={steps[currentStep]?.id === 'location' && !formData.location.trim()}
                        className="px-8 py-3 bg-blue-600 text-white text-base font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    )}
                  </div>
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
  );
}

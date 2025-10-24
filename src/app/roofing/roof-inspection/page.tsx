"use client";

import { Navigation } from "@/components/home/Navigation";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ExclamationTriangleIcon, CheckCircleIcon, ClockIcon, CurrencyPoundIcon, ArrowRightIcon, HomeIcon, EyeIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { RoofInspectionDialog } from "@/components/dialogs/RoofInspectionDialog";
import { useState } from "react";

export default function RoofInspectionPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const breadcrumbItems = [
    { label: "Roofing", href: "/roofing" },
    { label: "Roof Inspection" }
  ];

  const warningSigns = [
    {
      sign: "Sagging or Bowing Roof",
      description: "Visible dips or curves in your roof line indicate structural stress and potential failure",
      urgency: "immediate",
      visual: "A roof that appears to 'dip' in the middle or shows visible bowing"
    },
    {
      sign: "Cracked or Missing Tiles",
      description: "Exposed areas allow water penetration, leading to rot and structural weakening",
      urgency: "urgent",
      visual: "Gaps in tile coverage or tiles that have shifted out of place"
    },
    {
      sign: "Water Stains on Ceilings",
      description: "Brown or yellow stains indicate active leaks that are compromising structural integrity",
      urgency: "urgent",
      visual: "Discolored patches on interior ceilings, often circular or spreading"
    },
    {
      sign: "Creaking or Popping Sounds",
      description: "Structural movement sounds, especially during wind or temperature changes",
      urgency: "immediate",
      visual: "Audible sounds coming from the roof area, particularly at night"
    },
    {
      sign: "Doors and Windows Sticking",
      description: "Structural shifting can cause door frames to become misaligned",
      urgency: "soon",
      visual: "Doors that no longer close properly or windows that are difficult to open"
    },
    {
      sign: "Excessive Moss or Algae Growth",
      description: "Indicates trapped moisture that can lead to wood rot and structural failure",
      urgency: "soon",
      visual: "Thick green growth covering large areas of the roof surface"
    }
  ];

  const inspectionSteps = [
    {
      step: "Initial Visual Assessment",
      description: "Professional examination of your roof from multiple angles to identify obvious problems",
      duration: "15-20 minutes",
      whatWeCheck: [
        "Overall roof condition and age",
        "Tile or shingle integrity",
        "Gutter and flashing condition",
        "Chimney and vent pipe seals",
        "Signs of weather damage"
      ]
    },
    {
      step: "Structural Analysis",
      description: "Detailed examination of load-bearing elements and support structures",
      duration: "20-30 minutes",
      whatWeCheck: [
        "Rafter and truss condition",
        "Load distribution points",
        "Support beam integrity",
        "Connection point stability",
        "Signs of stress or movement"
      ]
    },
    {
      step: "Moisture Detection",
      description: "Advanced thermal imaging to identify hidden water damage and leaks",
      duration: "15-20 minutes",
      whatWeCheck: [
        "Hidden moisture pockets",
        "Insulation condition",
        "Vapor barrier integrity",
        "Potential leak sources",
        "Water damage extent"
      ]
    },
    {
      step: "Safety Assessment",
      description: "Evaluation of immediate safety risks and structural stability",
      duration: "10-15 minutes",
      whatWeCheck: [
        "Immediate collapse risks",
        "Safe access points",
        "Emergency repair needs",
        "Temporary support requirements",
        "Safety recommendations"
      ]
    },
    {
      step: "Detailed Report",
      description: "Comprehensive documentation with photos, findings, and recommendations",
      duration: "15-20 minutes",
      whatWeCheck: [
        "Priority repair recommendations",
        "Cost estimates for necessary work",
        "Timeline for urgent repairs",
        "Preventive maintenance schedule",
        "Warranty and guarantee information"
      ]
    }
  ];

  const pricingRanges = [
    {
      type: "Basic Inspection",
      price: "£150-£200",
      description: "Essential safety check for immediate concerns",
      includes: [
        "Visual roof assessment",
        "Basic structural check",
        "Safety evaluation",
        "Written report with photos",
        "Priority recommendations"
      ]
    },
    {
      type: "Comprehensive Inspection",
      price: "£250-£350",
      description: "Complete analysis with thermal imaging",
      includes: [
        "Full structural analysis",
        "Thermal moisture detection",
        "Detailed safety assessment",
        "Comprehensive written report",
        "Repair cost estimates",
        "12-month re-inspection guarantee"
      ]
    },
    {
      type: "Emergency Assessment",
      price: "£300-£400",
      description: "Urgent safety evaluation for immediate concerns",
      includes: [
        "Same-day inspection",
        "Immediate safety recommendations",
        "Emergency repair coordination",
        "Priority contractor referrals",
        "Insurance claim support"
      ]
    }
  ];

  const faqs = [
    {
      question: "How often should I have my roof inspected?",
      answer: "We recommend annual inspections for roofs over 10 years old, and immediate inspection if you notice any warning signs. After severe weather events, an inspection within 48 hours is crucial."
    },
    {
      question: "Can a roof really collapse without warning?",
      answer: "While complete collapses are rare, they can happen when structural damage goes undetected. Professional thermal imaging and structural analysis can identify problems months or years before they become dangerous."
    },
    {
      question: "What if the inspection reveals serious problems?",
      answer: "Professional inspectors provide immediate safety recommendations and can coordinate emergency repairs if needed. Their detailed reports help you understand the urgency and costs involved in any necessary work."
    },
    {
      question: "Is roof inspection covered by insurance?",
      answer: "Most home insurance policies don't cover routine inspections, but they often require them for claims. Professional inspection reports can support insurance claims and may help reduce your premiums."
    },
    {
      question: "How long does a roof inspection take?",
      answer: "A comprehensive inspection typically takes 1-2 hours, depending on roof size and complexity. Professional inspectors will provide a detailed timeline when they arrive and keep you informed throughout the process."
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'urgent':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'soon':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'immediate':
        return <ExclamationTriangleIcon className="w-6 h-6" />;
      case 'urgent':
        return <ExclamationTriangleIcon className="w-6 h-6" />;
      case 'soon':
        return <ClockIcon className="w-6 h-6" />;
      default:
        return <HomeIcon className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 pt-16 pb-16 sm:pt-20 sm:pb-24 lg:pt-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
          
          <div className="mt-8 sm:mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold text-gray-900 leading-tight tracking-tight">
                  Your roof could collapse
                  <span className="block text-red-600">without warning</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Every year, thousands of UK homes suffer catastrophic roof failures. What starts as a small leak can quickly escalate into complete structural collapse, leaving families homeless and facing repair bills of £50,000 or more.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button 
                  onClick={() => setIsDialogOpen(true)}
                  className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-red-600 text-white text-base sm:text-lg font-medium rounded-full hover:bg-red-700 active:bg-red-800 transition-colors duration-200 shadow-lg hover:shadow-xl touch-manipulation"
                >
                  Get Emergency Inspection
                  <ArrowRightIcon className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button 
                  onClick={() => {
                    const warningSection = document.getElementById('warning-signs');
                    warningSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-white text-gray-900 text-base sm:text-lg font-medium rounded-full border border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200 touch-manipulation"
                >
                  Learn Warning Signs
                </button>
              </div>
            </div>
            
            <div className="relative order-1 lg:order-2">
              <div className="aspect-[4/3] bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
                <ImageWithFallback
                  src="/images/roof-collapse.png"
                  alt="Roof inspection hero image"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-16 h-16 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="w-8 h-8 sm:w-12 sm:h-12 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real Tragedy Section */}
      <div className="py-12 sm:py-16 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-red-100">
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex-shrink-0 mx-auto sm:mx-0 mr-0 sm:mr-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Real Tragedy: Bradford Roof Collapse</h2>
                <p className="text-gray-700 mb-4 text-base sm:text-lg leading-relaxed">
                  In August 2020, a 47-year-old man was killed when a chimney collapsed through his roof in Bradford. 
                  His partner suffered injuries as debris fell into their bedroom. Neighbors heard a &quot;loud bang&quot; at 4:30 AM.
                </p>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  This tragic incident highlights how quickly roof failures can become life-threatening. What started as a structural issue escalated into a fatal accident in moments.
                </p>
                <a 
                  href="https://news.sky.com/story/man-47-killed-in-roof-collapse-as-neighbours-hear-loud-bang-12055126" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-red-600 hover:text-red-700 font-semibold text-base sm:text-lg transition-colors duration-200 touch-manipulation"
                >
                  Read the full Sky News report
                  <ArrowRightIcon className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Signs Section */}
      <div id="warning-signs" className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-900 tracking-tight">
              Warning Signs Your Roof Could Collapse
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Don&apos;t ignore these critical warning signs. Early detection can prevent catastrophic damage.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {warningSigns.map((sign, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 touch-manipulation"
              >
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${getUrgencyColor(sign.urgency).replace('text-', 'bg-').replace('bg-red-600', 'bg-red-100').replace('bg-orange-600', 'bg-orange-100').replace('bg-yellow-600', 'bg-yellow-100')}`}>
                      <div className="text-red-600">{getUrgencyIcon(sign.urgency)}</div>
                    </div>
                    <div className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium uppercase tracking-wide ${getUrgencyColor(sign.urgency)}`}>
                      {sign.urgency}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{sign.sign}</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{sign.description}</p>
                  </div>
                  
                  <div className="aspect-video bg-gray-50 rounded-lg sm:rounded-xl overflow-hidden relative">
                    <ImageWithFallback
                      src={`/images/roof-inspection/warning-sign-${index + 1}.png`}
                      alt={sign.sign}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Section */}
      <div className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-red-600 to-red-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 sm:space-y-12">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500 rounded-full flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                  Emergency Situations
                </h2>
              </div>
              <p className="text-xl sm:text-2xl text-red-100 leading-relaxed max-w-4xl mx-auto">
                If you notice any of these warning signs, take immediate action and contact a professional for urgent inspection.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              <div className="bg-red-500/20 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-red-400/30">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center space-x-2 sm:space-x-3">
                  <WrenchScrewdriverIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                  <span>Recommended Actions</span>
                </h3>
                <ul className="space-y-3 sm:space-y-4">
                  {[
                    "Move away from the affected area for safety",
                    "Turn off electricity to prevent fire risk", 
                    "Move valuable items to a safe location",
                    "Call emergency services if structural damage is visible",
                    "Contact a professional roofer for urgent inspection"
                  ].map((action, index) => (
                    <li key={index} className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-6 h-6 bg-red-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <span className="text-red-100 text-base sm:text-lg leading-relaxed">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-red-500/20 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-red-400/30">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center space-x-2 sm:space-x-3">
                  <EyeIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                  <span>When to Call</span>
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-red-100 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                    Call immediately if you see any of these critical signs:
                  </p>
                  <ul className="space-y-2 sm:space-y-3">
                    {[
                      "Visible roof sagging or bowing",
                      "Large sections of missing tiles", 
                      "Water pouring through ceilings",
                      "Cracks in walls or ceilings",
                      "Doors and windows sticking or jamming"
                    ].map((sign, index) => (
                      <li key={index} className="flex items-start space-x-2 sm:space-x-3">
                        <ExclamationTriangleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-200 flex-shrink-0 mt-1" />
                        <span className="text-red-100 text-sm sm:text-base">{sign}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-600/30 rounded-lg sm:rounded-xl border border-red-400/50">
                    <p className="text-white font-semibold text-base sm:text-lg">
                      Early detection and action can prevent serious damage.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inspection Process Section */}
      <div className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-900 tracking-tight">
              Professional Inspection Process
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              What to expect from a comprehensive roof inspection by qualified professionals.
            </p>
          </div>
          
          <div className="space-y-6 sm:space-y-8">
            {inspectionSteps.map((step, index) => (
              <div key={index} className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center font-semibold text-base sm:text-lg">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{step.step}</h3>
                        <div className="flex items-center space-x-2 text-gray-500 mt-1">
                          <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-sm sm:text-base">{step.duration}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base lg:text-lg">{step.description}</p>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">What they check:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {step.whatWeCheck.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                          <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 text-sm sm:text-base">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-900 tracking-tight">
              Typical Inspection Costs
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto">
              Professional roof inspection pricing varies by scope, urgency, and property size. Here&apos;s what you can typically expect to pay.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {pricingRanges.map((range, index) => (
              <div key={index} className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg">
                
                <div className="text-center space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">{range.type}</h3>
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <CurrencyPoundIcon className="w-8 h-8 text-indigo-600" />
                      <span className="text-3xl sm:text-4xl font-bold text-indigo-600">{range.price}</span>
                    </div>
                    <p className="text-gray-600 text-base sm:text-lg">{range.description}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">What&apos;s typically included:</h4>
                    <ul className="space-y-3 text-left">
                      {range.includes.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm sm:text-base">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <div className="text-center space-y-4">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Important Notes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Pricing Factors:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Property size and complexity</li>
                    <li>• Roof height and accessibility</li>
                    <li>• Urgency of inspection</li>
                    <li>• Geographic location</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What Affects Cost:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Emergency vs. scheduled inspection</li>
                    <li>• Detailed reporting requirements</li>
                    <li>• Additional services (drones, thermal imaging)</li>
                    <li>• Travel distance for contractor</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                *Actual costs may vary.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-900 tracking-tight">
              Why Professional Inspection Matters
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Don&apos;t risk your family&apos;s safety or your home&apos;s value. Professional inspections provide peace of mind and protection.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[
              "Prevent catastrophic roof failure before it happens",
              "Identify hidden water damage and structural issues", 
              "Protect your family's safety and your home's value",
              "Get peace of mind with professional assessment",
              "Save money by catching problems early",
              "Ensure insurance compliance and coverage",
              "Increase your property's market value",
              "Get expert recommendations for maintenance"
            ].map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 touch-manipulation">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Everything you need to know about roof inspections.
            </p>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 hover:bg-gray-100 transition-colors duration-200 touch-manipulation">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base lg:text-lg">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white tracking-tight">
                Ready to Protect Your Home?
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                Don&apos;t wait for disaster to strike. Find qualified roofing professionals in your area who can provide the inspection your home needs.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button 
                onClick={() => setIsDialogOpen(true)}
                className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-white text-gray-900 text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 shadow-lg hover:shadow-xl touch-manipulation"
              >
                Request Roof Inspection
                <ArrowRightIcon className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button 
                onClick={() => setIsDialogOpen(true)}
                className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-red-600 text-white text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl hover:bg-red-700 active:bg-red-800 transition-all duration-200 shadow-lg hover:shadow-xl touch-manipulation"
              >
                Get Emergency Help
                <ExclamationTriangleIcon className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            
            <div className="pt-6 sm:pt-8 border-t border-gray-700">
              <p className="text-gray-400 text-xs sm:text-sm">
                Trusted by thousands of homeowners across the UK
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Roof Inspection Dialog */}
      <RoofInspectionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        urgency="urgent"
      />
    </div>
  );
}

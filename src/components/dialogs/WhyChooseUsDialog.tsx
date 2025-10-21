"use client";

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface WhyChooseUsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cardType: 'verified' | 'handle' | 'communication' | null;
}

export function WhyChooseUsDialog({ isOpen, onClose, cardType }: WhyChooseUsDialogProps) {
  const getCardContent = () => {
    switch (cardType) {
      case 'verified':
        return {
          title: 'Verified Local Professionals',
          icon: (
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
          content: (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">What This Means for You</h4>
                <p className="text-green-800 text-sm">
                  Every tradesperson on our platform has been thoroughly vetted against official UK business databases, 
                  ensuring they are legitimate, qualified, and properly insured.
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Our Verification Process</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-green-600">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Business Registration Check</p>
                      <p className="text-sm text-gray-600">Verified against Companies House and HMRC records</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-green-600">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Insurance Verification</p>
                      <p className="text-sm text-gray-600">Public liability and professional indemnity insurance confirmed</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-green-600">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Qualification Check</p>
                      <p className="text-sm text-gray-600">Trade-specific certifications and qualifications verified</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-green-600">4</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Reference Verification</p>
                      <p className="text-sm text-gray-600">Previous customer references and work quality checked</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Your Peace of Mind</h4>
                <p className="text-gray-700 text-sm">
                  When you choose a tradesperson through White River Trades, you can be confident they meet the highest 
                  standards of professionalism and reliability. No more worrying about cowboy builders or unqualified workers.
                </p>
              </div>
            </div>
          )
        };
      
      case 'handle':
        return {
          title: 'We Handle Everything',
          icon: (
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
          content: (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Complete Project Management</h4>
                <p className="text-blue-800 text-sm">
                  From the moment you describe your problem to the final quality check, we coordinate every aspect of your project. 
                  You just sit back and watch it all come together.
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">What We Handle for You</h4>
                <div className="grid gap-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Problem Analysis</p>
                      <p className="text-sm text-gray-700">We understand exactly what needs to be done and identify the right specialists</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Tradesperson Matching</p>
                      <p className="text-sm text-gray-700">We find the perfect professionals for your specific needs and location</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Communication & Coordination</p>
                      <p className="text-sm text-gray-700">We handle all scheduling, updates, and coordination between you and the tradespeople</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Quality Assurance</p>
                      <p className="text-sm text-gray-700">We ensure work meets our high standards and your expectations</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Your Time is Valuable</h4>
                <p className="text-gray-700 text-sm">
                  Instead of spending hours researching tradespeople, making calls, and coordinating schedules, 
                  you can focus on what matters most to you while we handle all the details.
                </p>
              </div>
            </div>
          )
        };
      
      case 'communication':
        return {
          title: 'Fast, Reliable Communication',
          icon: (
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
          content: (
            <div className="space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 mb-2">24-Hour Response Promise</h4>
                <p className="text-orange-800 text-sm">
                  We understand that home problems can&apos;t wait. That&apos;s why we guarantee to call you within 24 hours 
                  of your request to get your project moving quickly.
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Our Communication Process</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-orange-600">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Immediate Acknowledgment</p>
                      <p className="text-sm text-gray-600">We confirm receipt of your request within minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-orange-600">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Personal Call Within 24 Hours</p>
                      <p className="text-sm text-gray-600">Your dedicated agent calls to discuss your project in detail</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-orange-600">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Regular Updates</p>
                      <p className="text-sm text-gray-600">We keep you informed throughout the entire process</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-orange-600">4</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Direct Access</p>
                      <p className="text-sm text-gray-600">You can always reach your agent directly for questions or concerns</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Multiple Contact Methods</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Phone calls</li>
                    <li>• SMS updates</li>
                    <li>• Email confirmations</li>
                    <li>• WhatsApp messaging</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">What You Can Expect</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Clear timelines</li>
                    <li>• Transparent pricing</li>
                    <li>• Progress updates</li>
                    <li>• Quality check-ins</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">No More Waiting in the Dark</h4>
                <p className="text-gray-700 text-sm">
                  Unlike other services where you might wait days or weeks for a response, we&apos;re committed to getting 
                  your project started quickly with clear, regular communication every step of the way.
                </p>
              </div>
            </div>
          )
        };
      
      default:
        return null;
    }
  };

  const cardContent = getCardContent();

  if (!cardContent) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      {cardContent.icon}
                    </div>
                    <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                      {cardContent.title}
                    </Dialog.Title>
                  </div>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                <div className="p-6 max-h-96 overflow-y-auto">
                  {cardContent.content}
                </div>
                
                <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

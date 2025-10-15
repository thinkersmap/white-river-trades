"use client";

export default function ExampleQuotePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Example Quote</h1>
          <p className="text-sm sm:text-base text-gray-600">What you&apos;ll receive from verified professionals</p>
        </div>

        {/* Professional Quote Document */}
        <div className="bg-white shadow-lg">
          {/* Quote Header with Company Info */}
          <div className="bg-slate-700 text-white p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">QUOTE</h1>
                <div className="text-slate-200">
                  <p className="text-base sm:text-lg font-semibold">ABC Plumbing Services Ltd.</p>
                  <p className="text-xs sm:text-sm">123 Trade Street, London, SW1A 1AA</p>
                  <p className="text-xs sm:text-sm">020 7123 4567 • info@abcplumbing.co.uk</p>
                </div>
              </div>
              <div className="sm:text-right">
                <div className="bg-white text-slate-700 p-3 sm:p-4 rounded-lg">
                  <p className="text-xs sm:text-sm font-medium">Quote #</p>
                  <p className="text-xl sm:text-2xl font-bold">WR-2024-001</p>
                  <p className="text-xs sm:text-sm mt-1 sm:mt-2">Quote Date: 15/03/2024</p>
                  <p className="text-xs sm:text-sm">Valid Until: 22/03/2024</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bill To Section */}
          <div className="p-4 sm:p-8 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-slate-700 mb-3">Bill To:</h2>
                <div className="text-gray-700">
                  <p className="font-medium text-base sm:text-lg">Sarah Johnson</p>
                  <p className="text-sm sm:text-base">2847 Innovation Boulevard</p>
                  <p className="text-sm sm:text-base">London, SW1A 1AA</p>
                  <p className="mt-2 text-sm sm:text-base">sarah.johnson@example.com</p>
                  <p className="text-sm sm:text-base">(020) 9876-5432</p>
                </div>
              </div>
              <div className="sm:text-right">
                <div className="bg-slate-50 p-3 sm:p-4 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600">Service Type</p>
                  <p className="font-semibold text-base sm:text-lg">Plumbing Repair</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services Table */}
          <div className="p-4 sm:p-8">
            <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-4">Services & Materials</h3>
            <div className="overflow-x-auto">
              <div className="min-w-full border border-gray-200 rounded-lg">
                {/* Table Header */}
                <div className="bg-slate-700 text-white">
                  <div className="grid grid-cols-12 gap-1 sm:gap-4 p-2 sm:p-4 text-xs sm:text-sm font-semibold">
                    <div className="col-span-1 text-center">#</div>
                    <div className="col-span-7 sm:col-span-6">Description</div>
                    <div className="col-span-1 text-center">Qty</div>
                    <div className="col-span-2 text-right">Unit Price</div>
                    <div className="col-span-1 text-right">Total</div>
                  </div>
                </div>
                
                {/* Table Rows */}
                <div className="divide-y divide-gray-200">
                  <div className="grid grid-cols-12 gap-1 sm:gap-4 p-2 sm:p-4 text-xs sm:text-sm hover:bg-gray-50">
                    <div className="col-span-1 flex justify-center">
                      <span className="bg-slate-100 text-slate-700 px-1 sm:px-2 py-1 rounded-full text-xs font-medium">1</span>
                    </div>
                    <div className="col-span-7 sm:col-span-6 min-w-0">
                      <p className="font-medium text-xs sm:text-sm truncate">Tap Replacement & Installation</p>
                      <p className="text-gray-600 text-xs truncate">High-quality mixer tap with ceramic disc technology</p>
                    </div>
                    <div className="col-span-1 text-center">1</div>
                    <div className="col-span-2 text-right">£180.00</div>
                    <div className="col-span-1 text-right font-medium">£180.00</div>
                  </div>
                  
                  <div className="grid grid-cols-12 gap-1 sm:gap-4 p-2 sm:p-4 text-xs sm:text-sm hover:bg-gray-50">
                    <div className="col-span-1 flex justify-center">
                      <span className="bg-slate-100 text-slate-700 px-1 sm:px-2 py-1 rounded-full text-xs font-medium">2</span>
                    </div>
                    <div className="col-span-7 sm:col-span-6 min-w-0">
                      <p className="font-medium text-xs sm:text-sm truncate">Washers & Seals Replacement</p>
                      <p className="text-gray-600 text-xs truncate">Premium rubber washers and O-rings</p>
                    </div>
                    <div className="col-span-1 text-center">1</div>
                    <div className="col-span-2 text-right">£25.00</div>
                    <div className="col-span-1 text-right font-medium">£25.00</div>
                  </div>
                  
                  <div className="grid grid-cols-12 gap-1 sm:gap-4 p-2 sm:p-4 text-xs sm:text-sm hover:bg-gray-50">
                    <div className="col-span-1 flex justify-center">
                      <span className="bg-slate-100 text-slate-700 px-1 sm:px-2 py-1 rounded-full text-xs font-medium">3</span>
                    </div>
                    <div className="col-span-7 sm:col-span-6 min-w-0">
                      <p className="font-medium text-xs sm:text-sm truncate">Plumbing System Inspection</p>
                      <p className="text-gray-600 text-xs truncate">Comprehensive check of water pressure and connections</p>
                    </div>
                    <div className="col-span-1 text-center">1</div>
                    <div className="col-span-2 text-right">£45.00</div>
                    <div className="col-span-1 text-right font-medium">£45.00</div>
                  </div>
                  
                  <div className="grid grid-cols-12 gap-1 sm:gap-4 p-2 sm:p-4 text-xs sm:text-sm hover:bg-gray-50">
                    <div className="col-span-1 flex justify-center">
                      <span className="bg-slate-100 text-slate-700 px-1 sm:px-2 py-1 rounded-full text-xs font-medium">4</span>
                    </div>
                    <div className="col-span-7 sm:col-span-6 min-w-0">
                      <p className="font-medium text-xs sm:text-sm truncate">Labor & Installation</p>
                      <p className="text-gray-600 text-xs truncate">Professional installation and testing</p>
                    </div>
                    <div className="col-span-1 text-center">2</div>
                    <div className="col-span-2 text-right">£75.00</div>
                    <div className="col-span-1 text-right font-medium">£150.00</div>
                  </div>
                  
                  <div className="grid grid-cols-12 gap-1 sm:gap-4 p-2 sm:p-4 text-xs sm:text-sm hover:bg-gray-50">
                    <div className="col-span-1 flex justify-center">
                      <span className="bg-slate-100 text-slate-700 px-1 sm:px-2 py-1 rounded-full text-xs font-medium">5</span>
                    </div>
                    <div className="col-span-7 sm:col-span-6 min-w-0">
                      <p className="font-medium text-xs sm:text-sm truncate">Clean Up & Disposal</p>
                      <p className="text-gray-600 text-xs truncate">Removal of old parts and site cleanup</p>
                    </div>
                    <div className="col-span-1 text-center">1</div>
                    <div className="col-span-2 text-right">£20.00</div>
                    <div className="col-span-1 text-right font-medium">£20.00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description of Work */}
          <div className="px-4 sm:px-8 pb-6">
            <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-3">Description of Work:</h3>
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                This comprehensive plumbing repair includes the replacement of your faulty kitchen tap with a high-quality mixer tap featuring ceramic disc technology. Our certified plumber will install new washers and seals, perform a complete system inspection, and ensure all connections are properly sealed and tested. The work includes cleanup and disposal of old parts, with a 12-month warranty on all labor and materials.
              </p>
            </div>
          </div>

          {/* Totals Section */}
          <div className="px-4 sm:px-8 pb-6 sm:pb-8">
            <div className="flex justify-end">
              <div className="w-full sm:w-80">
                <div className="space-y-2">
                  <div className="flex justify-between py-2">
                    <span className="text-sm sm:text-base text-gray-600">Subtotal:</span>
                    <span className="font-medium text-sm sm:text-base">£420.00</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm sm:text-base text-gray-600">VAT (20%):</span>
                    <span className="font-medium text-sm sm:text-base">£84.00</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2">
                    <div className="flex justify-between py-2">
                      <span className="text-base sm:text-lg font-semibold text-slate-700">Total Estimate:</span>
                      <span className="text-xl sm:text-2xl font-bold text-slate-700">£504.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-slate-50 px-4 sm:px-8 py-4 sm:py-6 border-t border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-4">Terms & Conditions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">Payment Terms:</h4>
                <p>Payment due within 14 days of completion</p>
                <p>Bank transfer preferred</p>
                <p>Cheques payable to: ABC Plumbing Services Ltd.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Warranty:</h4>
                <p>12 months on all work and materials</p>
                <p>Free call-back for warranty issues</p>
                <p>Fully insured and Gas Safe registered</p>
              </div>
            </div>
          </div>

          {/* Availability & Contact */}
          <div className="px-4 sm:px-8 py-4 sm:py-6 bg-blue-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">Availability</h3>
                <div className="flex items-center space-x-2 text-blue-800">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-sm sm:text-base">Available tomorrow (March 16, 2024)</span>
                </div>
                <p className="text-blue-700 text-xs sm:text-sm mt-1">Flexible scheduling between 8 AM - 6 PM</p>
              </div>
              <div className="sm:text-right">
                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-blue-800 mb-3">
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>2.1 miles away</span>
                  </div>
                </div>
                <button className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Book This Quote
                </button>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="px-4 sm:px-8 py-4 sm:py-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end space-y-4 sm:space-y-0">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Customer Signature:</p>
                <div className="w-full sm:w-48 border-b border-gray-400 h-6 sm:h-8"></div>
              </div>
              <div className="sm:text-right">
                <p className="text-xs sm:text-sm text-gray-600">Authorized by:</p>
                <p className="font-medium text-sm sm:text-base">Mike Thompson</p>
                <p className="text-xs text-gray-500">Certified Plumber</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Note */}
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-yellow-800 text-sm sm:text-base">
            <strong>Note:</strong> This is an example of the type of professional quote you&apos;ll receive. Actual quotes will be tailored to your specific job requirements and may include additional details.
          </p>
        </div>

        {/* Back Button */}
        <div className="mt-6 sm:mt-8 text-center">
          <button 
            onClick={() => window.close()}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 text-sm sm:text-base font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}

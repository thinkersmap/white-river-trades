export function Navigation() {
  return (
    <div className="bg-white">
      <nav className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
        <div className="flex items-center gap-8 lg:gap-14">
          <div className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900">White River Trades</div>
          <div className="hidden md:flex items-center gap-6 lg:gap-9">
            <a href="#" className="text-[15px] text-gray-700 hover:text-gray-900 transition-colors">Solutions</a>
            <a href="#" className="text-[15px] text-gray-700 hover:text-gray-900 transition-colors">Industries</a>
            <a href="#" className="text-[15px] text-gray-700 hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#" className="text-[15px] text-gray-700 hover:text-gray-900 transition-colors">Resources</a>
            <a href="#" className="text-[15px] text-gray-700 hover:text-gray-900 transition-colors">Company</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="md:hidden text-gray-700 hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <a
            href="#"
            className="hidden md:block px-6 lg:px-7 py-2.5 bg-black text-white text-[15px] rounded-full hover:bg-gray-900 transition-all"
          >
            Get Started
          </a>
        </div>
      </nav>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  
  return (
    <div className="bg-white">
      <nav className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 lg:gap-4">
          <Image
            src="/images/logo.png"
            alt="White River Trades logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
            priority
          />
          <div className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900">White River Trades</div>
        </Link>
        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-gray-700 hover:text-gray-900"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(v => !v)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div className="md:hidden px-4 sm:px-8 pb-4">
          <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <Link href="/privacy" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-gray-800 hover:bg-gray-50">Privacy</Link>
            <Link href="/terms" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-gray-800 hover:bg-gray-50 border-t border-gray-100">Terms</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-gray-800 hover:bg-gray-50 border-t border-gray-100">Contact</Link>
          </div>
        </div>
      )}
    </div>
  );
}

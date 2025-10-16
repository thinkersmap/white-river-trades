import Link from "next/link";
import Image from "next/image";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="White River Trades logo" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
            <span className="text-lg font-semibold text-gray-900">White River Trades</span>
          </Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">Back</Link>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-700 mb-6">We respect your privacy. This page outlines how we handle your data.</p>
        <div className="space-y-4 text-gray-700">
          <p>We only collect information necessary to connect you with suitable tradespeople.</p>
          <p>We do not sell your data. Your details are shared only with relevant, verified companies.</p>
          <p>Contact us if you wish to access or delete your data.</p>
        </div>
      </div>
    </main>
  );
}



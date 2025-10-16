import Link from "next/link";
import Image from "next/image";

export default function TermsPage() {
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
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-700 mb-6">Please read these terms carefully before using our service.</p>
        <div className="space-y-4 text-gray-700">
          <p>White River Trades connects customers with tradespeople. We are not a party to any contract between you and any service provider.</p>
          <p>You agree to provide accurate information and to use the service lawfully.</p>
          <p>We may update these terms; continued use indicates acceptance of any changes.</p>
        </div>
      </div>
    </main>
  );
}



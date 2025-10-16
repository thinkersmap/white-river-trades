import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-3">
            <img src="/images/logo.png" alt="White River Trades logo" className="h-8 w-8 rounded-full object-cover" />
            <span className="text-lg font-semibold text-gray-900">White River Trades</span>
          </Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">Back</Link>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">Contact</h1>
        <p className="text-gray-700 mb-6">Reach out and we’ll get back to you.</p>
        <div className="space-y-2 text-gray-700">
          <p>Email: hello@wrmarketingservices.com</p>
          <p>Phone: announced later...</p>
        </div>
      </div>
    </main>
  );
}



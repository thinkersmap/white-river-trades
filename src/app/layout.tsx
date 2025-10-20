import type { Metadata } from "next";
import Script from "next/script";
import { FacebookPixel } from "@/components/shared/FacebookPixel";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "White River Trades - Find Local Tradespeople Near You",
  description: "Connect with trusted local tradespeople for roofing, plumbing, electrical work and more. Get matched with experienced professionals in your area.",
  keywords: "local trades, tradespeople, roofing, plumbing, electrical, handyman, local contractors",
  authors: [{ name: "White River Trades" }],
  openGraph: {
    title: "White River Trades - Find Local Tradespeople Near You",
    description: "Connect with trusted local tradespeople for roofing, plumbing, electrical work and more. Get matched with experienced professionals in your area.",
    url: "https://whiterivertrades.com",
    siteName: "White River Trades",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "White River Trades - Local Tradespeople",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "White River Trades - Find Local Tradespeople Near You",
    description: "Connect with trusted local tradespeople for roofing, plumbing, electrical work and more.",
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y6EGDVC67V"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-Y6EGDVC67V');
          `}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1758547738164043');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{display: 'none'}}
            src="https://www.facebook.com/tr?id=1758547738164043&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FacebookPixel />
        {children}
      </body>
    </html>
  );
}

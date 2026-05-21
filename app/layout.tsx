import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://jgec-pyq.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'JGEC PYQ - Previous Year Question Papers | Download Free',
    template: '%s | JGEC PYQ',
  },
  description:
    'Download free JGEC (Jalpaiguri Government Engineering College) previous year question papers (PYQ) for all branches — CSE, IT, ECE, EE, ME, CE — and all semesters. Internal & semester exam papers.',
  keywords: [
    'JGEC PYQ',
    'JGEC previous year questions',
    'JGEC question papers',
    'JGEC previous year question papers',
    'Jalpaiguri Government Engineering College',
    'JGEC CSE question papers',
    'JGEC IT question papers',
    'JGEC ECE question papers',
    'JGEC EE question papers',
    'JGEC ME question papers',
    'JGEC CE question papers',
    'JGEC semester papers',
    'JGEC internal papers',
    'JGEC exam papers download',
    'JGEC PYQ download',
    'engineering question papers',
    'West Bengal engineering college papers',
  ],
  authors: [{ name: 'JGEC PYQ Team' }],
  creator: 'JGEC PYQ',
  publisher: 'JGEC PYQ',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: BASE_URL,
    siteName: 'JGEC PYQ',
    title: 'JGEC PYQ - Previous Year Question Papers | Download Free',
    description:
      'Download free JGEC previous year question papers for all branches and semesters. Access CSE, IT, ECE, EE, ME, CE exam papers.',
    images: [
      {
        url: '/jgec.png',
        width: 512,
        height: 512,
        alt: 'JGEC PYQ - Previous Year Question Papers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JGEC PYQ - Previous Year Question Papers',
    description:
      'Download free JGEC previous year question papers for all branches and semesters.',
    images: ['/jgec.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  // TODO: Add your Google Search Console verification code here
  // verification: {
  //   google: 'your-google-site-verification-code',
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

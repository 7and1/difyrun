import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'DifyRun - Free Dify AI Workflow Templates & MCP Server Library',
    template: '%s | DifyRun',
  },
  description:
    'Discover 100+ free Dify workflow templates. Download DSL files for RAG, AI Agents, MCP Servers, and automation. Compatible with Dify v1.6+.',
  keywords: [
    'Dify',
    'Dify AI',
    'Dify workflow',
    'Dify templates',
    'Dify DSL',
    'Dify MCP',
    'MCP Server',
    'RAG pipeline',
    'AI workflow',
    'LLM automation',
  ],
  authors: [{ name: 'DifyRun' }],
  creator: 'DifyRun',
  publisher: 'DifyRun',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://difyrun.com'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'DifyRun',
    title: 'DifyRun - Free Dify AI Workflow Templates & MCP Server Library',
    description:
      'Discover 100+ free Dify workflow templates. Download DSL files for RAG, AI Agents, MCP Servers, and automation.',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'DifyRun - Dify Workflow Templates',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DifyRun - Free Dify AI Workflow Templates',
    description: 'Discover 100+ free Dify workflow templates.',
    images: ['/og-default.png'],
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
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

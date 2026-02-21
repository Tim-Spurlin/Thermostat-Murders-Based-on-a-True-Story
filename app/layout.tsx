import type { Metadata } from 'next';
import { Inter, Playfair_Display, JetBrains_Mono, Share_Tech_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Long Island Crossbow Incident | Forensic Analysis',
  description: 'A forensic analysis of Thermoregulatory Fear of Harm Mood Disorder and the Samy Sedhom case.',
};

import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} ${shareTechMono.variable}`}>
      <body className="bg-slate-950 text-slate-200 antialiased selection:bg-red-900/30 selection:text-red-200">
        {children}
        <GoogleAnalytics gaId="G-5HC9TGBNSJ" />
      </body>
    </html>
  );
}

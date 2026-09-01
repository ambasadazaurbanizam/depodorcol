import type { Metadata } from 'next';
import './globals.css';

const title = 'Muzej javnog prevoza Beograda | Belgrade Museum of Public Transport';
const description = 'The digital-first museum of Belgrade’s public transport, urban mobility and everyday city life. Future home: historic Dorćol Depot.';

export const metadata: Metadata = {
  title,
  description,
  applicationName: 'Belgrade Museum of Public Transport',
  keywords: [
    'Belgrade Museum of Public Transport',
    'Muzej javnog prevoza Beograda',
    'Dorćol Depot',
    'public transport history Belgrade',
  ],
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title,
    description,
    type: 'website',
    locale: 'en_GB',
    alternateLocale: ['sr_RS'],
  },
  twitter: { card: 'summary', title, description },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
      {/* Analytics integration point: add an approved provider only after consent and privacy review. */}
    </html>
  );
}

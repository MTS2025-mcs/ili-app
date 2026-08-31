import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BF360',
  description: 'Scopri quanto la tua azienda dipende da te.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}

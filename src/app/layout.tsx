import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import './globals.css';

const notoSans = Noto_Sans({
  variable: '--font-noto-sans',
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'JMS - Square Group | Job Management System',
  description: 'Project Management & Financial Reconciliation System for Square Group on Arito Enterprise Solutions.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${notoSans.variable} h-full antialiased`}
      style={{ fontFamily: 'var(--font-noto-sans), "Noto Sans", sans-serif' }}
    >
      <body 
        suppressHydrationWarning 
        className="h-full bg-[#f0f5fc] text-slate-900 antialiased selection:bg-blue-600 selection:text-white"
        style={{ fontFamily: 'var(--font-noto-sans), "Noto Sans", sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}

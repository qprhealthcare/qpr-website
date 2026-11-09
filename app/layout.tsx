import './globals.css';
import type { Metadata } from 'next';
import { Montserrat, Open_Sans } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Quick\'s Priority Resources | Compassionate Support for People Living with Brain Injury and Disabilities',
  description:
    'Quick\'s Priority Resources provides individualized home and community-based services for people of all ages affected by traumatic brain injury (TBI) and disabilities. Where your family is our top priority.',
  keywords: ['Quick\'s Priority Resources', 'traumatic brain injury', 'TBI support', 'brain injury services', 'disabilities', 'disability support', '1915(i) program', 'family care', 'community support'],
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Quick\'s Priority Resources | Where Your Family Is Our Top Priority',
    description: 'Trusted care. Stronger communities.',
    images: ['/assets/images/QPR_Family_Care_Logo_(1).png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${openSans.variable}`}>{children}</body>
    </html>
  );
}

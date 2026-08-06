import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'cyun@portfolio:~$',
  description:
    'Christopher Yun — full stack developer. An interactive terminal-style portfolio.',
  keywords: ['developer', 'portfolio', 'terminal', 'programming'],
};

export const viewport: Viewport = {
  themeColor: '#0b0f0c',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={jetbrainsMono.className}>
        {children}
      </body>
    </html>
  );
}

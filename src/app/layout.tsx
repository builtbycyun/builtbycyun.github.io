import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// Mono carries the terminal chrome: prompts, tool calls, results, status line.
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

// Sans carries what the agent actually says. Paragraphs of monospace are the
// single biggest reason a transcript is hard to read.
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'christopher-yun — claude',
  description:
    'Christopher Yun — full stack developer. A portfolio that runs like a Claude Code session: scroll to send the next prompt, then take the prompt yourself.',
  keywords: ['developer', 'portfolio', 'claude code', 'software engineer', 'full stack'],
};

export const viewport: Viewport = {
  themeColor: '#1b1a17',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${plexSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import Layout from './layout/Index';
import { Toaster } from 'sonner';
import {
  CustomCursor,
  PostHogProvider,
  SmoothScroll,
  ThemeProvider,
} from '@/components';
import { Analytics } from '@vercel/analytics/next';

const siteUrl = 'https://muqtadirat.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Muqtadirat Yussuff | Frontend Developer',
  description:
    'Frontend developer portfolio — considered interfaces, sharp interactions, and code that lasts. React, Next.js, and more.',
  openGraph: {
    title: 'Muqtadirat Yussuff | Frontend Developer',
    description:
      'Frontend developer portfolio — considered interfaces, sharp interactions, and code that lasts.',
    url: siteUrl,
    siteName: 'Muqtadirat Yussuff',
    type: 'website',
    images: [{ url: '/logo.svg', alt: 'Muqtadirat' }],
  },
  twitter: {
    card: 'summary',
    title: 'Muqtadirat Yussuff | Frontend Developer',
    description:
      'Frontend developer portfolio — considered interfaces, sharp interactions, and code that lasts.',
  },
  icons: {
    icon: [{ url: '/logo.svg', type: 'image/svg+xml' }],
  },
};

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var dark = stored
      ? stored === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`font-roboto`}>
        <PostHogProvider>
          <ThemeProvider>
            <SmoothScroll>
              <Toaster position="top-center" richColors closeButton />
              <Layout>
                <CustomCursor />
                {children}
                <Analytics />
              </Layout>
            </SmoothScroll>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}

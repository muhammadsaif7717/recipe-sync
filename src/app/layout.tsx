import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import TanstackProvider from '@/providers/TanstackProvider';
import { Toaster } from 'sonner';
import AuthProvider from '@/providers/AuthProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Recipe Sync',
  description: 'Sync your recipes across multiple platforms effortlessly.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute='class' defaultTheme='light' enableSystem>
          <TanstackProvider>
            <AuthProvider>
              <Navbar />
              {children}
              <Footer />
              <Toaster />
            </AuthProvider>
          </TanstackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

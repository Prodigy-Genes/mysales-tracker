import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Business-Sales Tracker',
  description: 'Real-time sales and expense analytics powered by prodigygenes magic🌟.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <AuthProvider>
          <main className="container mx-auto p-4">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

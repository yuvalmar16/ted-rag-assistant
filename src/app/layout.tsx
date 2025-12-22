import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TED RAG Assistant',
  description: 'AI Assistant for TED Talks',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-200 antialiased min-h-screen selection:bg-red-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
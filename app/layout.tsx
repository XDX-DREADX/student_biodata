import './globals.css';
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { ThemeToggle } from '@/components/ThemeToggle';

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Biodata Peserta Didik',
  description: 'Lengkapi atau lihat informasi data diri',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans antialiased min-h-screen relative overflow-x-hidden flex justify-center items-center`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Abstract Background Shapes */}
          <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none bg-background">
            <div className="absolute rounded-full blur-[80px] opacity-50 shape-anim -top-[10%] -left-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,hsl(var(--primary))_0%,transparent_70%)] [animation-delay:0s]" />
            <div className="absolute rounded-full blur-[80px] opacity-50 shape-anim -bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-[radial-gradient(circle,#8b5cf6_0%,transparent_70%)] [animation-delay:-5s]" />
            <div className="absolute rounded-full blur-[80px] opacity-50 shape-anim top-[40%] left-[60%] w-[400px] h-[400px] bg-[radial-gradient(circle,#3b82f6_0%,transparent_70%)] [animation-delay:-10s]" />
          </div>

          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>

          <main className="w-full max-w-[500px] p-5 z-10 flex flex-col min-h-screen justify-center">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

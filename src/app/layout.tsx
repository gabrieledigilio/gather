import { Inter } from "next/font/google";
import { AmbientBackground } from "@/components/layout/ambient-background";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Gather — Events nearby, picked for you",
  description:
    "AI-powered event discovery for builders — hackathons, dev meetups, and workshops picked for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full font-sans">
        <ThemeProvider>
          <AmbientBackground />
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}

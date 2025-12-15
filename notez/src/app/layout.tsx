import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Script from "next/script";

const outfit = Outfit({ subsets: ["latin"] });

// OG Image metadata for social sharing
export const metadata: Metadata = {
  title: "AI Notes",
  description: "Capture Your Thoughts with AI-Powered Precision. AI is revolutionizing the way we take notes by automatically summarizing content, identifying key concepts, and organizing information.",
  metadataBase: new URL("https://ai-notez.fun"),
  openGraph: {
    title: "AI Notes",
    description: "Capture Your Thoughts with AI-Powered Precision. AI is revolutionizing the way we take notes by automatically summarizing content, identifying key concepts, and organizing information.",
    url: "https://ai-notez.fun/",
    siteName: "AI Notes",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Notes - Capture Your Thoughts with AI-Powered Precision",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Notes",
    description: "Capture Your Thoughts with AI-Powered Precision. AI is revolutionizing the way we take notes by automatically summarizing content, identifying key concepts, and organizing information.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5657915193947723"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        </head>
        <body className={outfit.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

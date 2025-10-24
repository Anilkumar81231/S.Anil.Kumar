// frontend/app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";
import "./globals.css";

// ✅ Import chat widget wrapper (client-side only)
import ChatWidgetWrapper from "@/components/ChatWidgetWrapper.client";

export const metadata: Metadata = {
  title: "Anil - Full Stack Developer",
  description:
    "Portfolio of Anil - Full Stack Developer passionate about building clean, scalable, and user-friendly web applications.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* ✅ Main page content */}
            {children}

            {/* ✅ Global Chat Widget - stays visible on scroll */}
            <ChatWidgetWrapper />
          </ThemeProvider>
        </Suspense>

        {/* ✅ Vercel analytics */}
        <Analytics />
      </body>
    </html>
  );
}

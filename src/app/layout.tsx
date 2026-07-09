import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import AuthProvider from "@/components/AuthProvider";

import Script from "next/script";

export const metadata: Metadata = {
  title: "Tagverse CRM | Digital Marketing Command Centre",
  description: "Unified CRM for managing leads, pipeline, revenue, content, and team operations for digital marketing agencies.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body>
        {/* Blocking script: runs before paint to prevent theme flash */}
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var saved = localStorage.getItem('crm-theme') || 'light';
                var resolved = saved;
                if (saved === 'system') {
                  resolved = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                }
                if (resolved === 'light') {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              })();
            `,
          }}
        />
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

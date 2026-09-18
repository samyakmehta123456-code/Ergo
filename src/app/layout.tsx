import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Ergo - Student Task Workspace",
  description: "A clean, modern student task management workspace.",
  manifest: "/manifest.json",
  icons: {
    icon: "/manifest.json",
    apple: "/manifest.json",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="antialiased min-h-screen bg-ergo-bg text-ergo-text">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

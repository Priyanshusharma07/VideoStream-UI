import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "@/styles/globals.css";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { AppLayout } from "@/components/layout/AppLayout";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "CINEVIEW — Watch & Stream", template: "%s | CINEVIEW" },
  description: "High-fidelity cinematic video streaming and live-content platform.",
  themeColor: "#080a0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} dark`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
      </head>
      <body className="font-body-md bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container antialiased">
        <ToastProvider>
          <AppLayout>{children}</AppLayout>
        </ToastProvider>
      </body>
    </html>
  );
}


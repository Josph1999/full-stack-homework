import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppWrapper } from "@/components/app-wrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Collaborative Dashboard",
  description: "Cross-tab collaboration with real-time sync",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}

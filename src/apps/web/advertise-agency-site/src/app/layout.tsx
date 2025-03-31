import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import {Providers} from "@/app/providers";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Рекламное агентство Рекламастер",
  description: "Изготовление вывесок, согласование в архитектуре, брендирование, полиграфия",
};

export default function RootLayout({
  children,
}: {
    children: React.ReactNode;
}) {
  return (
    <html lang="ru"
          suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-full`}
      >
        <Providers>
            <Header />
            <Navigation />
            <main className="flex-grow">{children}</main>
            <Footer />
        </Providers>
      </body>
    </html>
  );
}

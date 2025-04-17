import type { Metadata } from "next";
import {Geist, Geist_Mono} from "next/font/google";
import Header from "@/components/header/Header";
import DesktopNavigation from "@/components/navigation/DesktopNavigation";
import {Providers} from "@/app/providers";
import Footer from "@/components/footer/Footer";
import {Breadcrumbs} from "@/components/misc/Breadcrumbs";
import {Container} from "@/components/container/Container";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import React from "react";
import TailwindKeeper from "@/components/misc/TailwindKeeper";

import "../styles/globals.css";
import {fetchNavigationLinks} from "@/libs/api/navLinksApi";

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

export default async function RootLayout({
  children,
}: {
    children: React.ReactNode;
}) {
    const navLinks = await fetchNavigationLinks();

    return (
        <html lang="ru"
              suppressHydrationWarning>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-full`}
          >
            <Providers>
                <Header />
                <DesktopNavigation navLinks={navLinks} />
                <MobileNavigation navLinks={navLinks} />
                <Breadcrumbs />
                <main className="flex-grow">
                    <Container>
                        {children}
                    </Container>
                </main>
                <Footer />
                <TailwindKeeper />
            </Providers>
          </body>
        </html>
      );
}

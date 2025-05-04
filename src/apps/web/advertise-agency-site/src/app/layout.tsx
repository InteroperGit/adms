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
import {getSiteGlobalData} from "@/libs/api/globalApi";
import {NavigationLink} from "@/types/navigation";
import {SiteGlobal} from "@/types/siteGlobal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
    const siteGlobal: SiteGlobal = await getSiteGlobalData();
    return {
        title: siteGlobal?.seo?.title,
        description: siteGlobal?.seo?.description,
    };
}

export default async function RootLayout({
  children,
}: {
    children: React.ReactNode;
}) {
    let navLinks: NavigationLink[];

    try {
        navLinks = await fetchNavigationLinks();
    }
    catch (error) {
        console.error(error);

        return (
            <html lang="ru"
                  suppressHydrationWarning>
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-full`}
                >
                    <div className="min-h-screen flex items-center justify-center text-center p-4">
                        <h1 className="text-xl text-red-600">Сервис временно недоступен. Попробуйте позже.</h1>
                    </div>
                </body>
            </html>
        );
    }

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

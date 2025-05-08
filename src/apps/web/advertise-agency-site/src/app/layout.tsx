import React from "react";
import {Geist, Geist_Mono} from "next/font/google";
import Header from "@/components/header/Header";
import DesktopNavigation from "@/components/navigation/DesktopNavigation";
import {Providers} from "@/app/providers";
import Footer from "@/components/footer/Footer";
import {Breadcrumbs} from "@/components/misc/Breadcrumbs";
import {Container} from "@/components/container/Container";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import TailwindKeeper from "@/components/misc/TailwindKeeper";

import {fetchNavigationLinks} from "@/libs/api/navLinksApi";
import {getSiteGlobalData} from "@/libs/api/globalApi";
import {NavigationLink} from "@/types/navigation";
import {SiteGlobal} from "@/types/siteGlobal";

import "../styles/globals.css";
import {SocialLink} from "@/types/socialLink";
import {getSocialLinks} from "@/libs/api/socialLinkApi";
import {ServiceCategory} from "@/types/service";
import {getServiceCategories} from "@/libs/api/servicesApi";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Генерирует метаданные страницы на основе глобальных данных сайта.
 * Используется для установки title и description для страницы.
 *
 * @returns {Promise<{ title: string, description: string }>} - Объект с метаданными,
 * содержащий title и description для страницы, полученные из глобальных данных сайта.
 *
 * Пример использования:
 * const metadata = await generateMetadata();
 */
export const generateMetadata = async () => {
    const siteGlobal: SiteGlobal = await getSiteGlobalData();
    return {
        title: siteGlobal?.seo?.title,
        description: siteGlobal?.seo?.description,
    };
}

/**
 * Корневой компонент, который определяет глобальную структуру страницы, включая
 * хедер, навигацию, хлебные крошки, основное содержимое и футер.
 *
 * @param {React.ReactNode} children - Содержимое страницы, которое будет рендериться
 * внутри контейнера.
 *
 * @returns {JSX.Element} - Разметка страницы, которая включает все необходимые
 * компоненты для структуры сайта.
 *
 * Пример использования:
 * <RootLayout>{children}</RootLayout>
 */
const RootLayout = async ({
  children,
}: {
    children: React.ReactNode;
}) => {
    let navLinks: NavigationLink[];
    let socialLinks: SocialLink[];
    let serviceCategories: ServiceCategory[];

    try {
        navLinks = await fetchNavigationLinks();
        socialLinks = await getSocialLinks();
        serviceCategories = await getServiceCategories("header");
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
                    <Footer
                        socialLinks={socialLinks}
                        serviceCategories={serviceCategories}
                        navigationLinks={navLinks}
                    />
                    <TailwindKeeper />
                </Providers>
            </body>
        </html>
    );
}

export default RootLayout;
import {FaVk, FaTelegram, FaWhatsapp} from "react-icons/fa"
import Logo from "@/components/misc/Logo";
import FooterSocialIcons from "@/components/footer/FooterSocialIcons";
import FooterContacts from "@/components/footer/FooterContacts";
import FooterNavigationLinks from "@/components/footer/FooterNavigationLinks";
import FooterServicesLinks from "@/components/footer/FooterServicesLinks";
import React, {JSX} from "react";
import {SocialIcon, SocialLink} from "@/types/socialLink";
import {ServiceCategory} from "@/types/service";
import {NavigationLink} from "@/types/navigation";
import {cn} from "@/libs/utils";
import {ContactItem} from "@/types/contacts";

const getSocialIcons = (socialLinks: SocialLink[]): SocialIcon[] => {
    const icons: Record<string, { icon: JSX.Element, color: string}> = {
        "vkontakte": {
            icon: <FaVk className="h-9 w-9" />,
            color: "hover:text-[#4680C2]"
        },
        "whatsapp": {
            icon: <FaWhatsapp className="h-9 w-9" />,
            color: "hover:text-[#25D366]"
        },
        "telegram": {
            icon: <FaTelegram className="h-9 w-9" />,
            color: "hover:text-[#2AABEE]"
        }
    }

    return socialLinks.map((item: SocialLink) => ({
        icon: icons[item.slug]?.icon ?? <></>,
        color: icons[item.slug]?.color ?? "hover:text-[#000000]",
        link: item
    } as SocialIcon))
}

interface FooterProps {
    socialLinks: SocialLink[];
    serviceCategories: ServiceCategory[];
    navigationLinks: NavigationLink[];
    contacts: ContactItem[];
}

/**
 * Компонент футера, который отображает контактную информацию, ссылки на социальные сети,
 * ссылки на страницы компании и услуги, а также копирайт.
 *
 * @returns {JSX.Element} - Разметка футера, включая лого, социальные сети, ссылки на компанию,
 * услуги и контакты, а также копирайт.
 *
 * Пример использования:
 * <Footer />
 */
const Footer = async ({
    socialLinks,
    serviceCategories,
    navigationLinks,
    contacts
}: FooterProps): Promise<JSX.Element> => {
    let socialIcons: SocialIcon[];

    try {
        socialIcons = getSocialIcons(socialLinks);
    }
    catch (error) {
        console.error(error);
        return <div className="text-red-500">Произошла ошибка при загрузке данных.</div>;
    }

    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gray-50 dark:bg-gray-900 border-t p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grud-cols-4 gap-8">
                {/* Лого */}
                <div className="space-y-4">
                    <Logo />
                    <p className="text-gray-600 dark:text-gray-400">
                        Профессиональные решения для вашего бизнеса
                    </p>
                </div>

                {/* Пустая ячейка */}
                <div className="space-y-4"></div>

                {/* Социальные сети с икноками */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Мы в социальных сетях:
                    </h3>
                    <FooterSocialIcons socialIcons={socialIcons} className="mt-4" />
                </div>

                {/* Ссылки Компания */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Компания
                    </h3>
                    <FooterNavigationLinks navigationLinks={navigationLinks} />
                </div>

                {/* Ссылки Услуги */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Услуги
                    </h3>
                    <FooterServicesLinks serviceCategories={serviceCategories} />
                </div>

                {/* Контакты */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Контакты
                    </h3>
                    <FooterContacts
                        contacts={contacts}
                        className="mt-4"
                    />
                </div>
            </div>

            {/* Копирайт */}
            <div
                className={cn("border-t border-gray-200 dark:border-gray-800",
                    "mt-12 pt-8 text-center",
                    "text-gray-500 dark:text-gray-400 text-sm")}>
                © {currentYear} Рекламастер. Все права защищены.
            </div>
        </footer>
    )
}

export default Footer;
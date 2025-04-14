import { useEffect, useState } from "react";
import {ServiceCategory} from "@/types/service";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

/**
 * Кастомный хук для получения списка категорий услуг из Strapi API.
 * Инкапсулирует логику загрузки данных и управление состоянием.
 */
export default function useServiceCategories() {
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${STRAPI_URL}/api/service-categories`)
        .then(res => res.json())
        .then(categories => setCategories(categories.data))
        .finally(() => {
            setLoading(false)
        });
    }, []);

    return { categories, loading };
}
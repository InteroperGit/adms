import {Category} from "@/types/category";

export interface ProjectPreview {
    id: number;
    title: string;
    category: Category;
    client: string;
    year: string;
    imageUrl: string;
    slug: string;
    description?: string;
};
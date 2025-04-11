import {ServiceCategory} from "@/types/service";

export interface ProjectPreview {
    id: number;
    title: string;
    category: ServiceCategory;
    client: string;
    year: string;
    imageUrl: string;
    slug: string;
    description?: string;
}
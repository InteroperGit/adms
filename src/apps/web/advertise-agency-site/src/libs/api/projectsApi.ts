import {projects} from "@/data/projectsData";
import {Article} from "@/types/article";

export function getAllProjects(): Promise<Article[]> {
    return Promise.resolve(projects);
}

export const getProjectBySlug = (requestSlug: string): Promise<Article | undefined> => {
    return Promise.resolve(projects.find(({ slug }) => requestSlug === slug));
}
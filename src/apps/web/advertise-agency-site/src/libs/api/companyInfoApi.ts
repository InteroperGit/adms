import {companyProductionImages, companyStats} from "@/data/companyData";

export function getCompanyStats(): Promise<string[]> {
    return Promise.resolve(companyStats);
}

export function getCompanyProductionImages(): Promise<string[]> {
    return Promise.resolve(companyProductionImages);
}
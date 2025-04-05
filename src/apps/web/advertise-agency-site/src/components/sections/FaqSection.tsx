import React from "react";
import { cn } from "@/libs/utils";
import {faqData} from "@/data/faq-data";

interface FaqSectionProps {
    className?: string;
}

const FaqSection = ({ className }: FaqSectionProps) => {
    return (
        <div className={cn(`${className}`)}>
            <h2 className={cn("text-2xl font-bold mb-6 dark:text-gray-200")}>Частые вопросы</h2>
            <div className={cn("space-y-6")}>
                {faqData.map((item, i) => (
                    <div key={i} className={cn("border-b dark:border-gray-700 pb-4")}>
                        <h3 className={cn("font-bold mb-2 dark:text-gray-200")}>{item.q}</h3>
                        <p className={cn("text-gray-600 dark:text-gray-400")}>{item.a}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FaqSection;

// components/GoogleReviewsEmbed.tsx
"use client"

import React from "react"
import {cn} from "@/libs/utils";

interface GoogleReviewsProps {
    companySrc: string;
    className?: string;
}

export const GoogleReviews = ({ companySrc, className }: GoogleReviewsProps) => {
    return (
        <div className={cn(className ? className : "w-full max-w-5xl mx-auto p-4")}>
            <iframe
                src={`${companySrc}`}
                width="100%"
                height="1200"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl border-0 shadow"
            />
        </div>
    )
}

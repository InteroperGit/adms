import {ImageMeta} from "@/types/image";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {cn} from "@/libs/utils";
import ContentImage from "@/components/image/ContentImage";

interface ImageSliderProps {
    images: ImageMeta[];
    interval?: number;
}

export default function ImageSlider({ images, interval = 5000 }: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const nextImage = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images]);

    const startTimer = useCallback(() => {
        timerRef.current = setInterval(nextImage, interval);
    }, [nextImage, interval]);

    const resetTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        startTimer();
    };

    useEffect(() => {
        startTimer();
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [images, startTimer]);

    return (
        <div className="relative h-80 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={cn(
                        "absolute inset-0 transition-opacity duration-500",
                        "flex items-center justify-center",
                        index === currentIndex ? "opacity-100" : "opacity-0"
                    )}
                >
                    <ContentImage
                        image={image}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
            ))}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setCurrentIndex(index);
                            resetTimer();
                        }}
                        className={cn(
                            "w-3 h-3 rounded-full transition-colors",
                            index === currentIndex
                                ? "bg-orange-500"
                                : "bg-white/50 hover:bg-white/80"
                        )}
                        aria-label={`Показать фото ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};
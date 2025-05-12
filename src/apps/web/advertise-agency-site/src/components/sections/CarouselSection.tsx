"use client"

import React, {useState, useEffect, useRef, useCallback, JSX} from 'react'
import { cn } from '@/libs/utils'
import { motion, AnimatePresence } from 'framer-motion'
import Link from "next/link"
import { PromotionItem } from "@/types/promotionItem"
import ContentImage from "@/components/image/ContentImage";

interface CarouselSectionProps {
    promotions: PromotionItem[]
    autoScrollInterval?: number
    className?: string
}

// Иконки вынесены в отдельные компоненты для читаемости
const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
)

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
)

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
)

const slideVariants = {
    enter: (direction: string) => ({
        x: direction === 'right' ? 1000 : -1000,
        opacity: 0
    }),
    center: {
        x: 0,
        opacity: 1,
        transition: {
            x: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                bounce: 0.2
            },
            opacity: { duration: 0.2 }
        }
    },
    exit: (direction: string) => ({
        x: direction === 'right' ? -1000 : 1000,
        opacity: 0,
        transition: { duration: 0.3 }
    })
}

const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
}

interface SlideTransitionWrapperProps {
    currentSlide: number;
    direction: 'left' | 'right';
    children: React.ReactNode;
}

// Подкомпонент для анимации слайдов
const SlideTransitionWrapper: React.FC<SlideTransitionWrapperProps> = ({ currentSlide, direction, children }) => (
    <AnimatePresence custom={direction} initial={false}>
        <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
        >
            {children}
        </motion.div>
    </AnimatePresence>
)

interface NavigationButtonsProps {
    isHovered: boolean;
    prevSlide: () => void;
    nextSlide: () => void;
}

// Подкомпонент для навигационных кнопок
const NavigationButtons: React.FC<NavigationButtonsProps> = ({ isHovered, prevSlide, nextSlide }) => {
    return (
        <AnimatePresence>
            {isHovered && (
                <>
                    <motion.button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
                        aria-label="Предыдущий слайд"
                        variants={buttonVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.2 }}
                    >
                        <div className={cn(
                            "bg-white/80 hover:bg-white",
                            "dark:bg-gray-700/80 dark:hover:bg-gray-600",
                            "text-gray-800 dark:text-white",
                            "rounded-full w-10 h-10 flex items-center justify-center",
                            "shadow-md transition-colors"
                        )}>
                            <ChevronLeftIcon />
                        </div>
                    </motion.button>

                    <motion.button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
                        aria-label="Следующий слайд"
                        variants={buttonVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.2 }}
                    >
                        <div className={cn(
                            "bg-white/80 hover:bg-white",
                            "dark:bg-gray-700/80 dark:hover:bg-gray-600",
                            "text-gray-800 dark:text-white",
                            "rounded-full w-10 h-10 flex items-center justify-center",
                            "shadow-md transition-colors"
                        )}>
                            <ChevronRightIcon />
                        </div>
                    </motion.button>
                </>
            )}
        </AnimatePresence>
    )
}

interface TransitionLinkButtonProps {
    url: string;
    isVisible: boolean;
}

const TransitionLinkButton: React.FC<TransitionLinkButtonProps> = ({ url, isVisible }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-6 right-6 z-20"
                >
                    <Link
                        href={url}
                        className={cn(
                            "px-4 py-2 rounded-lg",
                            "bg-orange-500 hover:bg-orange-600 text-white",
                            "font-medium shadow-md",
                            "flex items-center gap-2",
                            "transition-colors duration-200"
                        )}
                    >
                        Перейти
                        <ArrowRightIcon />
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

interface SlideIndicatorProps {
    promotions: PromotionItem[];
    currentSlide: number;
    onClick: (index: number) => void;
}

// Подкомпонент для индикаторов слайдов
const SlideIndicator: React.FC<SlideIndicatorProps> = ({ promotions, currentSlide, onClick }) => (
    <div className="flex justify-center mt-4 gap-2">
        {promotions.map((_, index) => (
            <button
                key={index}
                onClick={() => onClick(index)}
                className={cn(
                    "w-3 h-3 rounded-full cursor-pointer transition-colors",
                    index === currentSlide
                        ? "bg-orange-500"
                        : "bg-gray-300 dark:bg-gray-600"
                )}
                aria-label={`Перейти к слайду ${index + 1}`}
            />
        ))}
    </div>
)

interface CarouselSlideProps {
    currentPromo: any; // Типы пропсов можно уточнить в зависимости от структуры данных
}

const CarouselSlide: React.FC<CarouselSlideProps> = ({ currentPromo }) => {
    return (
        <div
            className={cn(
                "absolute inset-0",
                "bg-white dark:bg-gray-700 rounded-lg",
                "shadow-sm dark:shadow-none",
                "border border-gray-200 dark:border-gray-600",
                "overflow-hidden h-full w-full"
            )}
        >
            <ContentImage
                image={currentPromo.cover}
                className="absolute inset-0 w-full h-full object-cover"
                priority
            />
            <div
                className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/70 ",
                    "via-black/30 to-transparent flex flex-col justify-end p-6"
                )}
            >
                <h3 className="text-white font-bold text-xl">{currentPromo.title}</h3>
                <p className="text-gray-200">{currentPromo.description}</p>
            </div>
        </div>
    )
}

/**
 * TransitionLinkButton — компонент, который отображает анимированную кнопку
 * для перехода по заданной ссылке. Кнопка появляется при наведении на слайд
 * и исчезает, когда пользователь уводит курсор. Анимация плавного появления
 * и скрытия кнопки осуществляется с помощью `AnimatePresence` и `motion.div`
 * из `framer-motion`.
 *
 * Этот компонент полезен для добавления переходов с анимацией в слайдерах или
 * других местах, где требуется интерактивная кнопка для перехода между страницами.
 */
const CarouselSection: React.FC<CarouselSectionProps> = ({
                                                             promotions,
                                                             autoScrollInterval = 5000,
                                                             className
                                                         }): JSX.Element => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [direction, setDirection] = useState<'left'|'right'>('right')
    const [isHovered, setIsHovered] = useState(false)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const nextSlide = useCallback(() => {
        setDirection('right')
        setCurrentSlide((prev) => (prev + 1) % promotions.length)
        resetTimer()
    }, [promotions]);

    const prevSlide = useCallback(() => {
        setDirection('left')
        setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length)
        resetTimer()
    }, [promotions]);

    const resetTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
        }
        timerRef.current = setTimeout(nextSlide, autoScrollInterval)
    }, [autoScrollInterval, nextSlide]);

    const currentPromo = promotions[currentSlide]

    useEffect(() => {
        resetTimer()
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [currentSlide, resetTimer])

    return (
        <section
            className={cn(
                "pb-6 rounded-lg relative overflow-hidden",
                "border border-gray-200 dark:border-gray-700",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative h-96 w-full">
                <SlideTransitionWrapper currentSlide={currentSlide} direction={direction}>
                    <CarouselSlide currentPromo={currentPromo} />
                </SlideTransitionWrapper>

                {/* Навигационные кнопки */}
                <NavigationButtons isHovered={isHovered} prevSlide={prevSlide} nextSlide={nextSlide} />

                {/* Кнопка для перехода */}
                <TransitionLinkButton
                    url={currentPromo.articleUrl}
                    isVisible={isHovered && !!currentPromo.articleUrl}
                />
            </div>

            {/* Индикаторы слайдов */}
            <SlideIndicator promotions={promotions} currentSlide={currentSlide} onClick={setCurrentSlide} />
        </section>
    )
}

export default CarouselSection
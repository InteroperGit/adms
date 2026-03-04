// src/components/ui/BackButton.tsx
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface BackButtonProps {
    label?: string
    className?: string
}

export function BackButton({ label = 'Вернуться назад', className }: BackButtonProps) {
    const navigate = useNavigate()

    return (
        <button
            onClick={() => navigate(-1)}
            className={`inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900 ${className ?? ''}`}
        >
            <ArrowLeft size={16} />
            {label}
        </button>
    )
}

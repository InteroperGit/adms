import {
  CircleDollarSign,
  Clock,
  UserRound,
  LineChart,
  Building2,
  Handshake,
  type LucideIcon,
} from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { ADVANTAGES } from '@/lib/constants'

const ICON_MAP: Record<string, LucideIcon> = {
  CircleDollarSign,
  Clock,
  UserRound,
  LineChart,
  Building2,
  Handshake,
}

export function Advantages() {
  return (
    <section
      id="advantages"
      className="relative overflow-hidden py-24 md:py-32"
      style={{ backgroundColor: 'hsl(var(--foreground))' }}
    >
      {/* Decorative blurred circles */}
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />

      <Container className="relative">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80">
            Почему мы
          </div>
          <h2 className="mb-4 text-white">
            Почему клиенты выбирают{' '}
            <span className="text-primary">Рекламастер</span>
          </h2>
          <p className="text-white/60">
            Мы не просто подрядчик — мы берём на себя ответственность за
            результат и выстраиваем долгосрочные отношения.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGES.map((item, index) => {
            const Icon = ICON_MAP[item.icon]
            return (
              <div
                key={item.title}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-primary/40 hover:bg-white/10"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon size={20} />
                  </div>
                  <span
                    style={{ fontFamily: 'var(--font-heading)' }}
                    className="text-3xl font-bold text-white/10"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/55">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

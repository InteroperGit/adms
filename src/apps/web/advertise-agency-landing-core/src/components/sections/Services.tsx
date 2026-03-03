import {
  Lightbulb,
  MonitorSmartphone,
  Megaphone,
  LayoutTemplate,
  BarChart3,
  Share2,
  type LucideIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Container } from '@/components/layout/Container'
import { services } from '@/lib/services'

const ICON_MAP: Record<string, LucideIcon> = {
  Lightbulb,
  MonitorSmartphone,
  Megaphone,
  LayoutTemplate,
  BarChart3,
  Share2,
}

export function Services() {
  return (
    <section id="services" className="bg-muted py-24 md:py-32">
      <Container>
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            Услуги
          </div>
          <h2 className="mb-4">Что мы делаем</h2>
          <p className="text-muted-foreground">
            Полный цикл рекламных услуг под одной крышей — от стратегии до
            финального размещения и аналитики.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = ICON_MAP[service.icon]
            return (
              <Card
                key={service.title}
                className="group border-border bg-white transition-shadow duration-300 hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon size={22} />
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

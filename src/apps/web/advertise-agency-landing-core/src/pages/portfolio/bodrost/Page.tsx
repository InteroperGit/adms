import { ArrowLeft, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/Container'
import { TESTIMONIALS } from '@/lib/constants'
import { cn } from '@/lib/utils'

const testimonial = TESTIMONIALS.find((t) => t.id === 1)!

export function Page() {
  return (
    <div className="min-h-screen bg-white font-sans text-foreground">
      {/* Page header */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-sm">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <a href="/" className="text-xl font-bold tracking-tight text-primary">
              Рекламастер
            </a>
            <a
              href="/#portfolio"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft size={16} />
              Назад к портфолио
            </a>
          </div>
        </Container>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-400 to-rose-500 py-24 text-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-6 border-0 bg-white/20 text-white backdrop-blur-sm">
              Брендинг
            </Badge>
            <h1 className="mb-4 text-3xl font-bold leading-tight md:text-5xl">
              Ребрендинг сети кофеен «Бодрость»
            </h1>
            <p className="text-base text-white/80 md:text-lg">
              Новый фирменный стиль, айдентика и коммуникационная платформа для сети из 40 кофеен
              по всей России
            </p>
          </div>
        </Container>
      </section>

      {/* Overview grid */}
      <section className="border-b border-border py-16">
        <Container>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {[
              { label: 'Клиент', value: 'Сеть кофеен «Бодрость»' },
              { label: 'Категория', value: 'Брендинг' },
              { label: 'Год', value: '2023' },
              { label: 'Услуги', value: 'Логотип, Айдентика, Гайдлайн' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {label}
                </p>
                <p className="font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Challenge */}
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold md:text-3xl">Задача</h2>
            <p className="leading-relaxed text-muted-foreground">
              Сеть кофеен «Бодрость» выросла с 5 до 40 точек за три года, но визуальный стиль
              оставался разрозненным — каждая точка выглядела по-своему. Клиент поставил задачу
              создать единую сильную идентичность, которая работала бы на всех носителях: от
              упаковки и стаканчиков до вывесок и digital-рекламы. Важно было сохранить теплоту и
              «домашность» бренда, добавив современный и профессиональный характер.
            </p>
          </div>
        </Container>
      </section>

      {/* Solution */}
      <section className="bg-muted/40 py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-10 text-2xl font-bold md:text-3xl">Решение</h2>
            <div className="grid gap-4 sm:grid-cols-3 sm:gap-8">
              {[
                {
                  title: 'Логотип',
                  description:
                    'Разработали знак на основе чашки с паром, стилизованным под латинскую «Б». Чистые линии, уверенный характер — работает в любом размере.',
                },
                {
                  title: 'Система айдентики',
                  description:
                    'Создали полную систему: типографику, цветовую палитру, паттерны и правила применения на упаковке, форме персонала и навигации.',
                },
                {
                  title: 'Брендгайд',
                  description:
                    '120-страничное руководство по бренду охватывает все сценарии использования — от печатных материалов до digital и наружной рекламы.',
                },
              ].map(({ title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border bg-white p-6 shadow-sm"
                >
                  <div className="mb-3 h-1 w-10 rounded-full bg-gradient-to-r from-orange-400 to-rose-500" />
                  <h3 className="mb-2 font-semibold">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Results */}
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-10 text-2xl font-bold md:text-3xl">Результаты</h2>
            <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
              {[
                {
                  metric: '+28%',
                  label: 'выручка',
                  description: 'в первый квартал после ребрендинга в новых точках',
                },
                {
                  metric: '40',
                  label: 'точек',
                  description: 'единый фирменный стиль внедрён по всей сети',
                },
                {
                  metric: '3 мес.',
                  label: 'реализации',
                  description: 'от брифа до финального гайдлайна',
                },
              ].map(({ metric, label, description }) => (
                <div
                  key={metric}
                  className={cn(
                    'rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 p-6 text-white'
                  )}
                >
                  <p className="text-4xl font-bold leading-none">{metric}</p>
                  <p className="mt-1 text-sm font-medium uppercase tracking-widest text-white/70">
                    {label}
                  </p>
                  <p className="mt-3 text-sm text-white/80">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonial */}
      <section className="bg-muted/40 py-16">
        <Container>
          <div className="mx-auto max-w-2xl">
            <blockquote className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mb-6 text-lg leading-relaxed text-foreground">
                «{testimonial.text}»
              </p>
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white',
                    testimonial.avatarColor
                  )}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </blockquote>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              Готовы к похожему результату?
            </h2>
            <p className="mb-8 text-muted-foreground">
              Расскажите о вашем проекте — мы предложим стратегию и назовём стоимость.
            </p>
            <Button asChild size="lg" className="rounded-full px-8">
              <a href="/#contact">Обсудить ваш проект</a>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  )
}

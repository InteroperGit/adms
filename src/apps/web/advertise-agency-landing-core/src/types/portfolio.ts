export interface PortfolioCase {
  slug: string
  title: string
  category: string
  description: string
  gradient: string
  tags: string[]
  meta: { title: string; description: string; ogUrl?: string; ogImage?: string }
  overview: { client: string; year: string; services: string }
  challenge: string
  solution: Array<{ title: string; description: string }>
  results: Array<{ metric: string; label: string; description: string }>
  testimonialId?: number
  images?: { preview?: string; og?: string; gallery?: string[] }
}

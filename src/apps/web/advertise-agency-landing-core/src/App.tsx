import './index.css'
import { Header } from '@/components/sections/Header'
import { Carousel } from '@/components/sections/Carousel'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Services } from '@/components/sections/Services'
import { Portfolio } from '@/components/sections/Portfolio'
import { Advantages } from '@/components/sections/Advantages'
import { Testimonials } from '@/components/sections/Testimonials'
import { CallToAction } from '@/components/sections/CallToAction'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/sections/Footer'
import { CookieBanner } from "./components/banners/CookieBanner"
import {ScrollToTop} from "@/components/ui/ScrollToTop.tsx";

function App() {
  return (
    <>
      <Header />
      <main>
        <Carousel />
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Advantages />
        <CallToAction />
        <Testimonials />
        <Contact />
      </main>
        <Footer />
        <ScrollToTop navSelector="#main-nav" />
        <CookieBanner />
    </>
  )
}

export default App

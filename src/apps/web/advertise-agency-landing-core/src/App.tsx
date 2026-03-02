import './index.css'
import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Services } from '@/components/sections/Services'
import { Portfolio } from '@/components/sections/Portfolio'
import { Advantages } from '@/components/sections/Advantages'
import { Testimonials } from '@/components/sections/Testimonials'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Advantages />
        <Testimonials />
        {/* Sections will be composed here */}
      </main>
    </>
  )
}

export default App

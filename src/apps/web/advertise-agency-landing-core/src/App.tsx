import './index.css'
import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        {/* Sections will be composed here */}
      </main>
    </>
  )
}

export default App

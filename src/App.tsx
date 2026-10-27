import { LazyMotion, domAnimation } from 'motion/react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import TraditionStrip from './components/sections/TraditionStrip'
import Tradition from './components/sections/Tradition'
import Memories from './components/sections/Memories'
import Participation from './components/sections/Participation'
import Location from './components/sections/Location'
import Committee from './components/sections/Committee'
import Supporters from './components/sections/Supporters'
import Closing from './components/sections/Closing'
import EventPoster from './components/sections/EventPoster'
import Queen from './components/sections/Queen'
import AmbientSound from './components/experience/AmbientSound'
import FallingPetals from './components/decorations/FallingPetals'
import { useReveal } from './hooks/useReveal'
import { useInputMethod } from './hooks/useInputMethod'
import { useSectionNavigation } from './hooks/useSectionNavigation'

export default function App() {
  const page = useReveal()
  useSectionNavigation()
  useInputMethod()
  return (
    <LazyMotion features={domAnimation}>
      <div ref={page}>
        <a href="#contenido" className="skip-link">Ir al contenido</a>
        <Header/>
        <main id="contenido">
          <Hero/>
          <Supporters/>
          <EventPoster/>
          <Queen/>
          <TraditionStrip/>
          <Tradition/>
          <Memories/>
          <Participation/>
          <Location/>
          <Committee/>

          <Closing/>
        </main>
        <Footer/>
        <FallingPetals/>
        <AmbientSound/>
      </div>
    </LazyMotion>
  )
}







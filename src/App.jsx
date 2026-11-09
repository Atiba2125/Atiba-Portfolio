import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Work from './components/Work.jsx'
import Services from './components/Services.jsx'
import Stack from './components/Stack.jsx'
import Experience from './components/Experience.jsx'
import Contact from './components/Contact.jsx'
import { Cursor } from './components/ui.jsx'

export default function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Cursor />
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Work />
        <Services />
        <Stack />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

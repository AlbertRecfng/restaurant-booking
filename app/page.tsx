import Navbar from './components/layout/Navbar/Navbar'
import Footer from './components/layout/Footer/Footer'
import Hero from './components/sections/Hero/Hero'
import About from './components/sections/About/About'
import Schedule from './components/sections/Schedule/Schedule'
import Menu from './components/sections/Menu/Menu'
import Cta from './components/sections/Cta/Cta'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />
      <Hero />
      <About />
      <Schedule />
      <Menu />
      <Cta />
      <Footer /> 
    </main>
  )
}
import Button from '../../ui/Button/Button'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <p className={styles.eyebrow}>Ресторан высокой кухни</p>
      <h1 className={styles.title}>Vel<em>our</em></h1>
      <p className={styles.subtitle}>Изысканность в каждой детали</p>
      <div className={styles.divider} />
      <Button href="/booking">Забронировать стол</Button>
      <p className={styles.scrollHint}>↓ &nbsp; прокрутите вниз</p>
    </section>
  )
}
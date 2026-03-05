import Button from '../../ui/Button/Button'
import styles from './Cta.module.css'

export default function Cta() {
  return (
    <section className={styles.section} id="booking">
      <p className={styles.label}>Забронировать</p>
      <h2 className={styles.title}>Ваш вечер<br />начинается <em>здесь</em></h2>
      <p className={styles.subtitle}>Выберите столик и время — мы позаботимся об остальном</p>
      <Button href="/booking">Выбрать столик</Button>
    </section>
  )
}
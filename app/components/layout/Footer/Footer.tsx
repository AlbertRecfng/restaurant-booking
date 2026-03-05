import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Link href="/" className={styles.logo}>Velour</Link>
      <p className={styles.text}>© Проект сделан в целях обучения</p>
    </footer>
  )
}
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '../../auth-provider'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <Link href="/" className={styles.logo}>Velour</Link>
      <ul className={styles.links}>
        <li><Link href="/#about">О нас</Link></li>
        <li><Link href="/#schedule">Расписание</Link></li>
        <li><Link href="/#menu">Меню</Link></li>
        <li><Link href="/booking">Забронировать</Link></li>
      </ul>
      {user ? (
        <Link href="/profile" className={styles.profileBtn}>
          Мой аккаунт
        </Link>
      ) : (
        <Link href="/auth" className={styles.authBtn}>Войти</Link>
      )}
    </nav>
  )
}
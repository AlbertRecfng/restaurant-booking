'use client'

import { useState } from 'react'
import styles from './Menu.module.css'

const menuItems = [
  { category: 'Закуски', items: [
    { name: 'Тартар из говядины', price: '3 200 ₸' },
    { name: 'Фуа-гра с бриошью', price: '4 800 ₸' },
    { name: 'Устрицы Fines de Claire', price: '2 900 ₸' }
  ]},
  { category: 'Основные блюда', items: [
    { name: 'Филе миньон', price: '8 500 ₸' },
    { name: 'Дорадо на соли', price: '6 200 ₸' },
    { name: 'Утиная грудка', price: '5 900 ₸' }
  ]},
  { category: 'Десерты', items: [
    { name: 'Крем-брюле', price: '1 800 ₸' },
    { name: 'Тарт Татен', price: '2 100 ₸' },
    { name: 'Шоколадный фондан', price: '2 400 ₸' }
  ]},
]

export default function Menu() {
  const [active, setActive] = useState(0)

  return (
    <section className={styles.section} id="menu">
      <p className={styles.label}>Наше меню</p>
      <h2 className={styles.title}>Кулинарное<br /><em>путешествие</em></h2>
      <div className={styles.tabs}>
        {menuItems.map((cat, i) => (
          <button
            key={i}
            className={`${styles.tab} ${active === i ? styles.active : ''}`}
            onClick={() => setActive(i)}
          >
            {cat.category}
          </button>
        ))}
      </div>
      <div className={styles.items}>
        {menuItems[active].items.map((item, i) => (
          <div key={i} className={styles.item}>
            <span className={styles.name}>{item.name}</span>
            <span className={styles.dots} />
            <span className={styles.price}>{item.price}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
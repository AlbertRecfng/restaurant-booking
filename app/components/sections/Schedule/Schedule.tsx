import styles from './Schedule.module.css'

const schedule = [
  { day: 'Пн — Чт', time: '18:00 — 23:00' },
  { day: 'Пятница', time: '18:00 — 00:00' },
  { day: 'Суббота', time: '16:00 — 00:00' },
  { day: 'Воскресенье', time: '16:00 — 22:00' },
]

export default function Schedule() {
  return (
    <section className={styles.section} id="schedule">
      <div className={styles.inner}>
        <p className={styles.label}>Часы работы</p>
        <h2 className={styles.title}>Расписание</h2>
        <div className={styles.grid}>
          {schedule.map((item, i) => (
            <div key={i} className={styles.item}>
              <p className={styles.day}>{item.day}</p>
              <p className={styles.time}>{item.time}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
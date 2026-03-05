import styles from './About.module.css'

export default function About() {
  return (
    <section className={styles.section} id="about">
      <p className={styles.label}>О ресторане</p>
      <h2 className={styles.title}>Место, где время<br /><em>замедляется</em></h2>
      <div className={styles.grid}>
        <div>
          <div className={styles.goldLine} />
          <p className={styles.text}>
            Velour — это пространство, где высокая кухня встречается с камерной атмосферой.
            Каждое блюдо создаётся из отборных продуктов, каждый вечер — как отдельная история.
            Мы верим, что ужин должен быть не просто едой, а событием, которое запоминается.
          </p>
        </div>
        <div className={styles.stats}>
          <div><p className={styles.statNumber}>12</p><p className={styles.statLabel}>Столиков</p></div>
          <div><p className={styles.statNumber}>8</p><p className={styles.statLabel}>Лет опыта</p></div>
          <div><p className={styles.statNumber}>40+</p><p className={styles.statLabel}>Позиций в меню</p></div>
          <div><p className={styles.statNumber}>1</p><p className={styles.statLabel}>Звезда Michelin</p></div>
        </div>
      </div>
    </section>
  )
}
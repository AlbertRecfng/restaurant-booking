import styles from './Table.module.css'

interface TableProps {
  number: number
  capacity: number
  isBooked: boolean
  isSelected: boolean
  onClick: () => void
}

export default function Table({ number, capacity, isBooked, isSelected, onClick }: TableProps) {
  return (
    <div
      className={`
        ${styles.table}
        ${isBooked ? styles.booked : styles.free}
        ${isSelected ? styles.selected : ''}
      `}
      onClick={!isBooked ? onClick : undefined}
    >
      <span className={styles.number}>{number}</span>
      <span className={styles.capacity}>{capacity} чел</span>
    </div>
  )
}
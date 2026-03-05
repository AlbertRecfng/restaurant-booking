import { useState } from 'react'
import Button from '../../../components/ui/Button/Button'
import styles from './BookingPanel.module.css'

interface TableData {
  id: string
  number: number
  capacity: number
}

interface BookingPanelProps {
  table: TableData | null
  onBook: (time: string, duration: number, price: number) => void
}

const DURATION_OPTIONS = [
  { hours: 1, price: 2000, label: '1 час' },
  { hours: 2, price: 4000, label: '2 часа' },
  { hours: 3, price: 4000, label: '3 часа' }
]

export default function BookingPanel({ table, onBook }: BookingPanelProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedDuration, setSelectedDuration] = useState(DURATION_OPTIONS[1])

  if (!table) {
    return (
      <div className={styles.panel}>
        <p className={styles.hint}>Выберите столик<br />на схеме зала</p>
      </div>
    )
  }

  const handleBook = () => {
    if (selectedTime) {
      onBook(selectedTime, selectedDuration.hours, selectedDuration.price)
    }
  }

  return (
    <div className={styles.panel}>
      <p className={styles.label}>Выбранный столик</p>
      <h2 className={styles.tableNumber}>№ {table.number}</h2>
      <p className={styles.capacity}>Вместимость: {table.capacity} чел</p>

      <div className={styles.divider} />

      <p className={styles.label}>Выберите время</p>
      <div className={styles.times}>
        {['18:00', '19:00', '20:00', '21:00', '22:00'].map((time) => (
          <button 
            key={time} 
            className={`${styles.timeBtn} ${selectedTime === time ? styles.selected : ''}`}
            onClick={() => setSelectedTime(time)}
          >
            {time}
          </button>
        ))}
      </div>

      <div className={styles.divider} />

      <p className={styles.label}>Выберите продолжительность</p>
      <div className={styles.durations}>
        {DURATION_OPTIONS.map((option) => (
          <button 
            key={option.hours}
            className={`${styles.durationBtn} ${selectedDuration.hours === option.hours ? styles.selected : ''}`}
            onClick={() => setSelectedDuration(option)}
          >
            {option.label} - {option.price.toLocaleString('kz-KZ')}₸
          </button>
        ))}
      </div>

      <div className={styles.divider} />

      <div className={styles.totalPrice}>
        Итого: <span>{selectedDuration.price.toLocaleString('kz-KZ')}₸</span>
      </div>

      <Button onClick={handleBook} disabled={!selectedTime}>
        Забронировать
      </Button>
    </div>
  )
}
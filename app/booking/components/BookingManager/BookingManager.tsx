import { useState } from 'react'
import { createBooking } from '../../utils/bookingUtils'

interface BookingManagerProps {
  selectedId: string | null
  onBookingComplete: () => void
}

export default function BookingManager({ selectedId, onBookingComplete }: BookingManagerProps) {
  const [isBooking, setIsBooking] = useState(false)

  const handleBook = async (time: string) => {
    if (!selectedId) {
      console.error('Не выбран столик')
      alert('Пожалуйста, выберите столик')
      return
    }

    setIsBooking(true)
    
    try {
      const result = await createBooking(selectedId, time)
      
      if (result.success) {
        alert('Столик успешно забронирован!')
        onBookingComplete()
      } else {
        alert(`Ошибка при бронировании: ${result.error}`)
      }
    } finally {
      setIsBooking(false)
    }
  }

  return {
    handleBook,
    isBooking
  }
}

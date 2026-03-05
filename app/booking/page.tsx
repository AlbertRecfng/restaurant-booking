'use client'

import { useState } from 'react'
import { useBookings } from './hooks/useBookings'
import { useAuth } from '../components/auth-provider'
import FloorMap from './components/FloorMap/FloorMap'
import BookingPanel from './components/BookingPanel/BookingPanel'
import Navbar from '../components/layout/Navbar/Navbar'
import styles from './page.module.css'

export default function BookingPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { tables, bookedIds, loading, refetchBookings } = useBookings()
  const { user } = useAuth()

  const handleBookingComplete = () => {
    refetchBookings()
    setSelectedId(null)
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.content}>
        </div>
      </div>
    )
  }

  const selectedTable = tables.find((t) => t.id === selectedId) ?? null

  const handleBook = async (time: string, duration: number, price: number) => {
    if (!selectedId) {
      console.error('Не выбран столик')
      alert('Пожалуйста, выберите столик')
      return
    }

    if (!user) {
      alert('Пожалуйста, войдите для бронирования')
      return
    }

    const { createBooking } = await import('./utils/bookingUtils')
    const result = await createBooking(selectedId, time, duration, price, user)
    
    if (result.success) {
      alert('Столик успешно забронирован!')
      handleBookingComplete()
    } else {
      alert(`Ошибка при бронировании: ${result.error}`)
    }
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.content}>
        <FloorMap
          tables={tables}
          bookedIds={bookedIds}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <BookingPanel
          table={selectedTable}
          onBook={handleBook}
        />
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../components/auth-provider'
import { createClient } from '../../lib/supabase'
import styles from './user-bookings.module.css'

interface Booking {
  id: string
  table_id: string
  table_number?: number
  status: string
  time_start: string
  time_end: string
  price: number
  created_at: string
  user_id: string
  tables?: {
    number: number
  }
}

export default function UserBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchBookings = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            tables!inner(
              number
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setBookings(data || [])
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [user])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#51cf66'
      case 'cancelled':
        return '#ff6b6b'
      case 'completed':
        return '#b8985a'
      default:
        return '#e8dcc8'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активно'
      case 'cancelled':
        return 'Отменено'
      case 'completed':
        return 'Завершено'
      default:
        return status
    }
  }

  if (!user) return null

  return (
    <div className={styles.bookingsContainer}>
      <h3 className={styles.sectionTitle}>Ваши бронирования</h3>
      
      {loading ? (
        <div className={styles.loading}>Загрузка...</div>
      ) : bookings.length === 0 ? (
        <div className={styles.emptyState}>
          <p>У вас пока нет бронирований</p>
          <a href="/booking" className={styles.bookingLink}>
            Забронировать столик
          </a>
        </div>
      ) : (
        <div className={styles.bookingsList}>
          {bookings.map((booking) => (
            <div key={booking.id} className={styles.bookingCard}>
              <div className={styles.bookingInfo}>
                <div className={styles.bookingHeader}>
                  <span className={styles.tableNumber}>
                    Стол #{booking.tables?.number || booking.table_id?.slice(0, 8)}
                  </span>
                  <span 
                    className={styles.status}
                    style={{ color: getStatusColor(booking.status) }}
                  >
                    {getStatusText(booking.status)}
                  </span>
                </div>
                
                <div className={styles.bookingDetails}>
                  <p className={styles.detail}>
                    <span className={styles.label}>Время начала:</span>
                    {formatDate(booking.time_start)}
                  </p>
                  <p className={styles.detail}>
                    <span className={styles.label}>Время окончания:</span>
                    {formatDate(booking.time_end)}
                  </p>
                  <p className={styles.detail}>
                    <span className={styles.label}>Стоимость:</span>
                    {booking.price} ₽
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

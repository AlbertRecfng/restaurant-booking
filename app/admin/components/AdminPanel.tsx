'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../components/auth-provider'
import { getAllBookings, cancelBooking, cleanupOldCancelledBookings, BookingWithDetails } from '../actions/adminActions'
import Navbar from '../../components/layout/Navbar/Navbar'
import styles from '../page.module.css'

export default function AdminPanel() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<BookingWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    setLoading(true)
    try {
      await cleanupOldCancelledBookings()
      
      const result = await getAllBookings()
      if (result.success && result.data) {
        setBookings(result.data)
      } else {
        console.error('Ошибка загрузки бронирований:', result.error)
      }
    } catch (error) {
      console.error('Ошибка загрузки бронирований:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    setActionLoading(bookingId)
    try {
      const result = await cancelBooking(bookingId)
      if (result.success) {
        alert('Бронирование успешно отменено!')
        await loadBookings()
      } else {
        alert(`Ошибка при отмене бронирования: ${result.error}`)
      }
    } catch (error) {
      console.error('Ошибка отмены бронирования:', error)
      alert('Произошла ошибка при отмене бронирования')
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.errorState}>
            <h2 className={styles.errorTitle}>Доступ запрещен</h2>
            <p className={styles.errorMessage}>У вас нет прав для доступа к админ-панели</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>Загрузка...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Админ-панель</h1>
          <p className={styles.subtitle}>Управление бронированием столиков</p>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>
              Активные бронирования ({bookings.length})
            </h2>
          </div>

          {bookings.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Нет активных бронирований</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Стол</th>
                    <th>Клиент</th>
                    <th>Время начала</th>
                    <th>Время окончания</th>
                    <th>Цена</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <div>
                          <div className={styles.tableNumber}>
                            Стол #{booking.tables?.number || 'N/A'}
                          </div>
                          <div className={styles.tableCapacity}>
                            {booking.tables?.capacity || 0} мест
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className={styles.clientName}>
                            {booking.users?.login || 'Гость'}
                          </div>
                          <div className={styles.clientEmail}>
                            {booking.users?.email || 'Нет email'}
                          </div>
                        </div>
                      </td>
                      <td>
                        {formatDate(booking.time_start)}
                      </td>
                      <td>
                        {formatDate(booking.time_end)}
                      </td>
                      <td className={styles.price}>
                        {booking.price} Т
                      </td>
                      <td>
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={actionLoading === booking.id}
                          className={styles.cancelButton}
                        >
                          {actionLoading === booking.id ? (
                            <div className={styles.loading}>
                              <div className={styles.spinner}></div>
                              Отмена...
                            </div>
                          ) : (
                            'Отменить'
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className={styles.refreshContainer}>
          <button
            onClick={loadBookings}
            className={styles.refreshButton}
          >
            Обновить список
          </button>
        </div>
      </div>
    </div>
  )
}

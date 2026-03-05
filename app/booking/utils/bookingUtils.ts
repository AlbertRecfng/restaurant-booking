import { createClient } from '../../lib/supabase'

export interface BookingData {
  table_id: string
  status: string
  user_id: string | null
  time_start: string
  time_end: string
  price: number
}

export interface User {
  id: string
  email: string
  login: string
  role: string
}

export async function createBooking(
  tableId: string, 
  time: string, 
  duration: number, 
  price: number,
  user?: User | null
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    console.log('Попытка бронирования:', { tableId, time, duration, price })
    
    const [startHours, startMinutes] = time.split(':').map(Number)
    const now = new Date()
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHours + duration, startMinutes)
    
    const endTimeString = endDate.toISOString()
    
    console.log('Выбранное время:', time)
    console.log('Продолжительность:', duration, 'часов')
    console.log('Рассчитанное время окончания (ISO):', endTimeString)

    const bookingData: BookingData = {
      table_id: tableId,
      status: 'active',
      user_id: user?.id || null,
      time_start: new Date(`${new Date().toDateString()} ${time}`).toISOString(),
      time_end: endTimeString,
      price: price
    }

    console.log('Данные для вставки:', bookingData)

    const { data, error } = await supabase.from('bookings').insert(bookingData)

    if (error) {
      console.error('Ошибка вставки в bookings:', error)
      console.error('Детали ошибки:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return { success: false, error: error.message }
    } else {
      console.log('Бронирование успешно:', data)
      return { success: true }
    }
  } catch (err) {
    console.error('Неожиданная ошибка:', err)
    console.error('Тип ошибки:', typeof err)
    console.error('Сообщение:', (err as Error)?.message)
    console.error('Стек:', (err as Error)?.stack)
    return { success: false, error: `Произошла непредвиденная ошибка: ${(err as Error)?.message || 'Неизвестная ошибка'}` }
  }
}

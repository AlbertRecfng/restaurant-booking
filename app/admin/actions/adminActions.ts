import { createClient } from '../../lib/supabase'

export interface BookingWithDetails {
  id: string
  table_id: string
  status: string
  user_id: string | null
  time_start: string
  time_end: string
  price: number
  tables?: {
    number: number
    capacity: number
  }
  users?: {
    login: string
    email: string
  }
}

export async function getAllBookings(): Promise<{ success: boolean; data?: BookingWithDetails[]; error?: string }> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        tables (
          number,
          capacity
        ),
        users (
          login,
          email
        )
      `)
      .eq('status', 'active')
      .order('time_start', { ascending: false })

    if (error) {
      console.error('Ошибка получения бронирований:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data || [] }
  } catch (err) {
    console.error('Неожиданная ошибка:', err)
    return { success: false, error: `Произошла непредвиденная ошибка: ${(err as Error)?.message || 'Неизвестная ошибка'}` }
  }
}

export async function cleanupOldCancelledBookings(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()
    
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('status', 'cancelled')
      .lt('updated_at', oneHourAgo)

    if (error) {
      console.error('Ошибка очистки старых бронирований:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('Неожиданная ошибка:', err)
    return { success: false, error: `Произошла непредвиденная ошибка: ${(err as Error)?.message || 'Неизвестная ошибка'}` }
  }
}

export async function cancelBooking(bookingId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('bookings')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)

    if (error) {
      console.error('Ошибка отмены бронирования:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('Неожиданная ошибка:', err)
    return { success: false, error: `Произошла непредвиденная ошибка: ${(err as Error)?.message || 'Неизвестная ошибка'}` }
  }
}

export async function getBookedTables(): Promise<{ success: boolean; data?: string[]; error?: string }> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('bookings')
      .select('table_id')
      .eq('status', 'active')

    if (error) {
      console.error('Ошибка получения забронированных столов:', error)
      return { success: false, error: error.message }
    }

    const bookedTableIds = data ? data.map(booking => booking.table_id) : []
    return { success: true, data: bookedTableIds }
  } catch (err) {
    console.error('Неожиданная ошибка:', err)
    return { success: false, error: `Произошла непредвиденная ошибка: ${(err as Error)?.message || 'Неизвестная ошибка'}` }
  }
}

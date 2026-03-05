import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase'

interface TableData {
  id: string
  number: number
  capacity: number
  x: number
  y: number
}

export function useBookings() {
  const [tables, setTables] = useState<TableData[]>([])
  const [bookedIds, setBookedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  async function loadTables() {
    const supabase = createClient()
    const { data } = await supabase.from('tables').select('*')
    if (data) {
      console.log('Структура таблицы tables:', data[0])
      setTables(data)
    }
  }

  async function loadBookings() {
    const supabase = createClient()
    const { data } = await supabase.from('bookings').select('table_id').eq('status', 'active')
    if (data) setBookedIds(data.map((b) => b.table_id))
  }

  useEffect(() => {
    async function loadData() {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error('Отсутствуют переменные окружения Supabase')
        alert('Ошибка: не настроены переменные окружения Supabase. Проверьте файл .env.local')
        setLoading(false)
        return
      }
      
      await loadTables()
      await loadBookings()
      setLoading(false)
    }
    loadData()
  }, [])

  return {
    tables,
    bookedIds,
    loading,
    refetchBookings: loadBookings
  }
}

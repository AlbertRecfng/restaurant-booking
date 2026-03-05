-- Проверяем структуру таблицы tables
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tables' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Если у таблицы tables нет поля number, добавляем его
ALTER TABLE public.tables 
ADD COLUMN IF NOT EXISTS number INTEGER;

-- Создаем внешнюю связь между bookings и tables
ALTER TABLE public.bookings 
ADD CONSTRAINT IF NOT EXISTS bookings_table_id_fkey 
FOREIGN KEY (table_id) REFERENCES public.tables(id);

-- Обновляем RLS для работы с JOIN
DROP POLICY IF EXISTS "Allow read for own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.bookings;

CREATE POLICY "Allow read for own bookings with tables"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id OR auth.uid()::text = 'anonymous');

CREATE POLICY "Allow insert for authenticated users"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid()::text = 'anonymous');

-- Проверяем связи
SELECT 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'bookings';

-- Обновляем RLS политики для таблицы bookings
DROP POLICY IF EXISTS "Enable read for own user" ON public.bookings;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.bookings;
DROP POLICY IF EXISTS "Enable update for own user" ON public.bookings;

-- Создаем правильные политики для bookings
CREATE POLICY "Allow read for own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id OR auth.uid()::text = 'anonymous');

CREATE POLICY "Allow insert for authenticated users"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid()::text = 'anonymous');

CREATE POLICY "Allow update for own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Проверяем политики
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('users', 'bookings');

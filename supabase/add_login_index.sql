-- Добавляем уникальный индекс для login
CREATE UNIQUE INDEX IF NOT EXISTS users_login_unique_idx ON public.users(login);

-- Обновляем RLS политику для чтения (чтобы можно было искать по login)
DROP POLICY IF EXISTS "Enable read for all users" ON public.users;
CREATE POLICY "Enable read for authenticated users"
  ON public.users FOR SELECT
  USING (auth.role() = 'authenticated');

-- Обновляем политику для вставки
DROP POLICY IF EXISTS "Enable insert for all users" ON public.users;
CREATE POLICY "Enable insert for authenticated users"
  ON public.users FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

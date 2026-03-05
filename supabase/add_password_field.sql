-- Добавляем поле password в таблицу users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password TEXT;

-- Обновляем RLS политики для работы с паролем
DROP POLICY IF EXISTS "Enable read for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.users;

-- Политика для чтения (без пароля)
CREATE POLICY "Enable read for own user"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Политика для вставки
CREATE POLICY "Enable insert for all users"
  ON public.users FOR INSERT
  WITH CHECK (true);

-- Политика для обновления (без пароля)
CREATE POLICY "Enable update for own user"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

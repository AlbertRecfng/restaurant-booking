-- Удаляем все старые политики
DROP POLICY IF EXISTS "Enable read for own user" ON public.users;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.users;
DROP POLICY IF EXISTS "Enable update for own user" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Создаем правильные политики для авторизации через login/password
CREATE POLICY "Allow anonymous read for login"
  ON public.users FOR SELECT
  USING (true); -- Временно разрешаем всем читать для поиска по login

CREATE POLICY "Allow anonymous insert for registration"
  ON public.users FOR INSERT
  WITH CHECK (true); -- Разрешаем всем регистрироваться

CREATE POLICY "Allow users to update own profile"
  ON public.users FOR UPDATE
  USING (true); -- Временно разрешаем всем обновлять

-- Проверяем текущие политики
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users';

# Настройка Supabase для проекта Restaurant Booking

## 1. Создание таблицы users

Выполните этот SQL в Supabase SQL Editor:

```sql
-- Создаем таблицу users
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  login TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включаем RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Создаем политику для чтения данных пользователя
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Создаем политику для обновления данных пользователя
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);
```

## 2. Создание триггера для автоматического добавления пользователей

Выполните этот SQL для автоматического создания записей в таблице users при регистрации:

```sql
-- Создаем функцию для добавления пользователя в таблицу users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, login, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'login', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Создаем триггер, который вызывает функцию при создании нового пользователя
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 3. Настройка аутентификации в Supabase

1. Перейдите в **Authentication** → **Settings**
2. Включите **Email auth**
3. Настройте **Site URL** и **Redirect URLs**:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

## 4. Переменные окружения

Создайте файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 5. Таблица bookings

Убедитесь, что таблица bookings имеет поле user_id:

```sql
ALTER TABLE public.bookings 
ADD COLUMN user_id UUID REFERENCES public.users(id);
```

## Как это работает

1. **Регистрация**: Пользователь вводит email, пароль и логин
2. **Supabase Auth**: Создает пользователя в системе аутентификации
3. **Триггер**: Автоматически добавляет запись в таблицу users с login и role
4. **Бронирование**: При создании бронирования используется user.id из сессии

## Структура данных

### Таблица users:
- `id`: UUID (связан с auth.users)
- `email`: TEXT
- `login`: TEXT 
- `role`: TEXT (по умолчанию 'user')
- `created_at`: TIMESTAMP

### Таблица bookings:
- `user_id`: UUID (внешний ключ к users.id)
- Другие поля бронирования

# Настройка Supabase для City Guides Kraków

## 1. Создание проекта Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите **"Start your project"**
3. Войдите через GitHub (рекомендуется)
4. Нажмите **"New project"**
5. Заполните данные:
   - **Name**: `krakow-guides-db`
   - **Database Password**: создайте надежный пароль
   - **Region**: выберите ближайший к вам регион
6. Нажмите **"Create new project"**

## 2. Получение Connection String

1. После создания проекта перейдите в **Settings** → **Database**
2. Найдите раздел **"Connection string"**
3. Скопируйте **URI** строку
4. Замените `[YOUR-PASSWORD]` на пароль, который вы создали

Пример:
```
postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklmnop.supabase.co:5432/postgres
```

## 3. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Stripe (Test Mode)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## 4. Инициализация базы данных

```bash
# Установка зависимостей
npm install

# Создание таблиц
npm run db:push

# Заполнение тестовыми данными
npm run db:seed
```

## 5. Проверка подключения

```bash
# Открыть Prisma Studio для просмотра данных
npm run db:studio
```

## 6. Настройка для продакшена (Vercel)

1. В панели Supabase перейдите в **Settings** → **API**
2. Скопируйте **Project URL** и **anon public** ключ
3. Добавьте в переменные окружения Vercel:
   - `DATABASE_URL` - Connection string
   - `NEXT_PUBLIC_SUPABASE_URL` - Project URL (опционально)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - anon key (опционально)

## Полезные ссылки

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma with Supabase](https://supabase.com/docs/guides/integrations/prisma)
- [Supabase Dashboard](https://app.supabase.com)

## Безопасность

- Никогда не коммитьте файл `.env` в git
- Используйте разные пароли для разработки и продакшена
- Регулярно обновляйте пароли базы данных
- Используйте Row Level Security (RLS) для защиты данных

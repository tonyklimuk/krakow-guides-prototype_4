# City Guides Kraków

Портал с платными цифровыми гайдами по городу Кракову. MVP маркетплейса с цифровыми продуктами, где пользователи получают доступ к гайдам только после покупки.

## Функциональность

- **Главная страница**: Презентация проекта и каталог гайдов
- **Страница гайда**: Детальный контент (доступен только после покупки)
- **Личный кабинет**: Управление покупками и профилем
- **Авторизация**: Email/пароль + OAuth (Google, Apple, Facebook)
- **Платежи**: Интеграция со Stripe (тестовый режим)

## Технический стек

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **UI**: TailwindCSS + shadcn/ui
- **Database**: Prisma ORM + PostgreSQL (Supabase)
- **Auth**: NextAuth.js
- **Payments**: Stripe Checkout
- **Deployment**: Vercel

## Установка и запуск

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd krakow-guides-prototype_4
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка Supabase

1. Создайте аккаунт на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Перейдите в **Settings** → **Database**
4. Скопируйте **Connection string** (URI)
5. Замените `[YOUR-PASSWORD]` на пароль из настроек проекта

### 4. Настройка переменных окружения

### 4.1. Генерация NextAuth Secret

```bash
# Сгенерировать секретный ключ для NextAuth
npm run generate-secret
```

Скопируйте сгенерированный ключ в файл .env
Скопируйте `.env.example` в `.env` и заполните необходимые переменные:

```bash
cp .env.example .env
```

Обязательные переменные:
- `DATABASE_URL` - Connection string Supabase PostgreSQL
- `NEXTAUTH_SECRET` - секретный ключ для NextAuth
- `NEXTAUTH_URL` - URL приложения
- `STRIPE_SECRET_KEY` - секретный ключ Stripe (тестовый)
- `STRIPE_PUBLISHABLE_KEY` - публичный ключ Stripe (тестовый)

### 5. Настройка базы данных

```bash
# Создание таблиц в PostgreSQL
npm run db:push

# Заполнение тестовыми данными
npm run db:seed
```

### 6. Запуск приложения

```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000)

## Настройка Stripe (тестовый режим)

1. Создайте аккаунт на [Stripe](https://stripe.com)
2. Перейдите в Dashboard → Developers → API keys
3. Скопируйте тестовые ключи в `.env`:
   - `STRIPE_SECRET_KEY` (sk_test_...)
   - `STRIPE_PUBLISHABLE_KEY` (pk_test_...)

### Тестовые карты Stripe

- **Успешная оплата**: 4242 4242 4242 4242
- **Отклоненная карта**: 4000 0000 0000 0002
- **Требует аутентификации**: 4000 0025 0000 3155

## Структура проекта

```
src/
├── app/                    # App Router страницы
│   ├── api/               # API routes
│   ├── auth/              # Страницы авторизации
│   ├── dashboard/         # Личный кабинет
│   ├── guide/             # Страницы гайдов
│   └── page.tsx           # Главная страница
├── components/            # React компоненты
│   ├── ui/               # shadcn/ui компоненты
│   └── PurchaseButton.tsx # Компонент покупки
├── lib/                   # Утилиты и конфигурация
│   ├── auth.ts           # NextAuth конфигурация
│   ├── prisma.ts         # Prisma клиент
│   └── stripe.ts         # Stripe утилиты
└── prisma/               # База данных
    ├── schema.prisma     # Схема Prisma
    └── seed.ts           # Тестовые данные
```

## Основные модели данных

- **User**: Пользователи системы
- **Guide**: Гайды по городу
- **Purchase**: Покупки пользователей
- **Account/Session**: Данные авторизации (NextAuth)

## Деплой на Vercel

### 1. Подготовка Supabase

1. Создайте проект на [supabase.com](https://supabase.com)
2. Скопируйте **Connection string** из Settings → Database
3. Замените `[YOUR-PASSWORD]` на пароль проекта

### 2. Настройка Vercel

1. Подключите репозиторий к Vercel
2. Добавьте переменные окружения:
   - `DATABASE_URL` - Connection string Supabase
   - `NEXTAUTH_URL` - URL вашего Vercel проекта
   - `NEXTAUTH_SECRET` - случайная строка
   - `STRIPE_SECRET_KEY` - тестовый ключ Stripe
   - `STRIPE_PUBLISHABLE_KEY` - публичный ключ Stripe
3. Деплой произойдет автоматически

### 3. Инициализация базы данных

После деплоя выполните:

```bash
# В терминале Vercel или локально с продакшен DATABASE_URL
npm run db:push
npm run db:seed
```

## Полезные команды

```bash
# Работа с базой данных
npm run db:push      # Синхронизация схемы с БД
npm run db:migrate   # Создание миграций
npm run db:seed      # Заполнение тестовыми данными
npm run db:studio    # Открыть Prisma Studio
npm run db:generate  # Генерация Prisma Client

# Разработка
npm run dev          # Запуск в режиме разработки
npm run build        # Сборка для продакшена
npm run start        # Запуск продакшен версии
npm run lint         # Проверка кода
```

## Разработка

### Добавление нового гайда

1. Добавьте запись в базу данных через Prisma Studio:
```bash
npm run db:studio
```

2. Или создайте скрипт в `prisma/seed.ts`

### Тестирование платежей

Все платежи работают в тестовом режиме. Используйте тестовые карты Stripe для проверки функциональности.

## Лицензия

MIT License
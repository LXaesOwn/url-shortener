#  URL Shortener

Сервис для сокращения ссылок с подробной статистикой переходов, геолокацией и аналитикой.

##  Возможности

- Сокращение ссылок — генерация уникальных коротких кодов
- Детальная статистика — IP, геолокация, браузер, ОС, тип устройства
- Аналитика — графики переходов по дням, распределение по браузерам и ОС
- Геолокация — определение страны и региона по IP через публичное API
- Адаптивный интерфейс — работает на всех устройствах
- REST API — удобное API для интеграции

## Технологии

### Backend
| Технология | Назначение |
|------------|------------|
| Node.js + Express | Серверная часть |
| TypeScript | Типизация |
| Prisma ORM | Работа с базой данных |
| PostgreSQL | Хранение данных |
| Zod | Валидация данных |
| http-status-codes | Консистентные HTTP статусы |
| Helmet | Безопасность (защита заголовков) |
| Compression | Сжатие ответов |
| express-rate-limit | Защита от спама (100 запросов/15 минут) |

### Frontend
| Технология | Назначение |
|------------|------------|
| React 18 | UI библиотека |
| TypeScript | Типизация |
| Redux Toolkit | Управление состоянием |
| react-hook-form | Работа с формами |
| CSS Modules | Стилизация |

##  Быстрый старт

### Требования
- Node.js 20+ (см. `.nvmrc`)
- PostgreSQL 16+
- npm или yarn

### Установка

```bash
# Клонирование репозитория
git clone https://github.com/LXaesOwn/url-shortener.git
cd url-shortener

Запуск
# Терминал 1 — База данных
pg_ctl start

# Терминал 2 — Бэкенд
cd backend
npm install
npx prisma migrate deploy
npx prisma generate
npm run dev
# Бэкенд: http://localhost:5000

# Терминал 3 — Фронтенд
cd frontend
npm install
npm start
# Фронтенд: http://localhost:3000


Команда	- Описание
npm run dev -	Запуск в режиме разработки
npm run build	- Сборка проекта
npm start	- Запуск собранного проекта
npx prisma migrate deploy	- Применение миграций БД
npx prisma  generate - Генерация Prisma Client
npx prisma studio -	Просмотр БД в браузере

API Endpoints
Метод	Эндпоинт	Описание
POST	/api/shorten	Создать короткую ссылку
GET	/api/s/:code	Редирект по короткой ссылке
GET	/api/stats/:code	Получить статистику
GET	/api/stats/all	Получить все ссылки
GET	/health	Проверка работоспособности

Пример запроса
# Создание короткой ссылки
curl -X POST http://localhost:5000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://example.com"}'
# Ответ
{
  "shareUrl": "http://localhost:5000/api/s/abc123",
  "statsUrl": "http://localhost:5000/api/stats/abc123"
}
# Переход по короткой ссылке
curl -v http://localhost:5000/api/s/abc123
# → 302 Redirect to https://example.com
# Получение статистики
curl http://localhost:5000/api/stats/abc123

Структура проета
url-shortener/
├── backend/
│   ├── src/
│   │   ├── config/          # Конфигурация (env, constants)
│   │   ├── controllers/     # HTTP контроллеры
│   │   ├── middleware/      # Middleware (auth, rate limiting)
│   │   ├── repositories/    # Репозитории (доступ к БД)
│   │   ├── routes/          # API маршруты
│   │   ├── services/        # Бизнес-логика
│   │   ├── types/           # TypeScript типы
│   │   ├── utils/           # Утилиты (logger, AppError, validation)
│   │   └── index.ts         # Точка входа
│   ├── prisma/
│   │   ├── schema.prisma    # Prisma схема
│   │   └── migrations/      # SQL миграции
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/             # API клиент
│   │   ├── components/      # React компоненты
│   │   ├── hooks/           # Кастомные хуки
│   │   ├── pages/           # Страницы
│   │   ├── store/           # Redux store
│   │   ├── types/           # TypeScript типы
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── .nvmrc                   # Версия Node.js
├── .env.example             # Пример переменных окружения
└── README.md

Статистика
Система собирает и отображает:
Общее количество переходов
География — страны и регионы посетителей
Браузеры — Chrome, Firefox, Safari, Edge
Операционные системы — Windows, macOS, Linux, iOS, Android
Тип устройства — десктоп, мобильный, планшет
Динамика переходов — по дням

Лицензия
MIT © LXaesOwn
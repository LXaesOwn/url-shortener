Сервис для сокращения ссылок с подробной статистикой переходов, геолокацией и аналитикой.

 Возможности

- Сокращение ссылок — генерация уникальных коротких кодов
- Детальная статистика — IP, геолокация, браузер, ОС, тип устройства
- Аналитика — графики переходов по дням, распределение по браузерам и ОС
- Геолокация — определение страны и региона по IP через публичное API
- Адаптивный интерфейс — работает на всех устройствах
- REST API — удобное API для интеграции

Технологии

 Backend
| Технология | Назначение |
|------------|------------|
| Node.js + Express | Серверная часть |
| TypeScript | Типизация |
| Prisma ORM | Работа с базой данных |
| PostgreSQL | Хранение данных |
| Zod | Валидация данных |
| http-status-codes | Консистентные HTTP статусы |
| Helmet | Безопасность |
| Compression | Сжатие ответов |
| express-rate-limit | Защита от спама |

Frontend
| Технология | Назначение |
|------------|------------|
| React 18 | UI библиотека |
| TypeScript | Типизация |
| Redux Toolkit | Управление состоянием |
| react-hook-form | Работа с формами |
| CSS Modules | Стилизация |
| useCopyToClipboard | Копирование в буфер обмена |

 Быстрый старт

Требования
- Node.js 20+ (см. `.nvmrc`)
- PostgreSQL 16+
- npm или yarn

Установка

```bash
git clone https://github.com/LXaesOwn/url-shortener.git
cd url-shortener
Настройка окружения
bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
Запуск
bash
pg_ctl start  
cd backend
npm install
npx prisma migrate deploy
npx prisma generate
npm run dev
cd frontend
npm install
npm start
bash
docker-compose up --build
docker-compose down
API Endpoints
Метод	Эндпоинт	Описание
POST	/api/shorten	Создать короткую ссылку
GET	/api/s/:code	Редирект по короткой ссылке
GET	/api/stats/:code	Получить статистику
GET	/health	Проверка работоспособности
Пример запроса
bash
curl -X POST http://localhost:5000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://example.com"}'
{
  "shareUrl": "http://localhost:5000/api/s/abc123",
  "statsUrl": "http://localhost:5000/api/stats/abc123"
}
Структура проекта
text
url-shortener/
├── backend/
│   ├── src/
│   │   ├── config/          # Конфигурация (env, constants)
│   │   ├── controllers/     # HTTP контроллеры
│   │   ├── middleware/      # Middleware (auth, rate limiting)
│   │   ├── models/          # Модели данных
│   │   ├── routes/          # API маршруты
│   │   ├── services/        # Бизнес-логика
│   │   ├── types/           # TypeScript типы
│   │   ├── utils/           # Утилиты (logger, AppError, validation)
│   │   └── index.ts         # Точка входа
│   ├── prisma/
│   │   ├── schema.prisma    # Prisma схема
│   │   └── migrations/      # SQL миграции
│   ├── package.json
│   └── Dockerfile
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
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .nvmrc
└── README.md
Переменные окружения
Backend (.env)
env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/url_shortener?schema=public"
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=url_shortener

BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
GEO_API_URL=http://ip-api.com/json/
GEO_API_TIMEOUT_MS=3000
Frontend (.env)
env
REACT_APP_API_URL=http://localhost:5000/api
Статистика:
Система собирает и отображает:
Общее количество переходов
География — страны и регионы посетителей
Браузеры — Chrome, Firefox, Safari, Edge
Операционные системы — Windows, macOS, Linux, iOS, Android
Тип устройства — десктоп, мобильный, планшет
Динамика переходов — по дням




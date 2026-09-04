BEGIN;

TRUNCATE stage_progress, refresh_tokens, user_badges, badges, stages, roadmaps, users RESTART IDENTITY CASCADE;

-- Юзер
INSERT INTO users (id, username, display_name, email, password_hash, role) VALUES (
  'a1b2c3d4-0000-4000-8000-000000000001',
  'devio',
  'DevIO',
  'devio@gmail.com',
  '$argon2id$v=19$m=65536,t=3,p=4$qpL0m6uFyh4kVMmRFQ5mig$cjBbZwSKp+sJ9OL+050+C31K8AShCdQKaWO6twoqqYA',
  'admin'
);

-- Дорожные карты
INSERT INTO roadmaps (id, slug, title, description, status) VALUES
  (1, 'frontend', 'Frontend', 'От HTML до продакшен-React: вёрстка, JavaScript, TypeScript, фреймворки и первый деплой.', 'active'),
  (2, 'backend',  'Backend',  'Python, FastAPI, базы данных и API: от первого эндпоинта до сервера с реальными пользователями.', 'active'),
  (3, 'devops',   'DevOps',   'Инфраструктура, CI/CD, контейнеризация и оркестрация приложений.', 'draft'),
  (4, 'mobile',   'Mobile',   'Кроссплатформенная и нативная разработка мобильных приложений.', 'draft');

-- Этапы
INSERT INTO stages (id, roadmap_id, title, description, topics, duration_weeks, position) VALUES
  -- Frontend Roadmap
  (1, 1, 'HTML',
   'Скелет любой страницы: теги, семантика, формы, доступность. Фундамент, на котором стоит всё остальное.',
   '["Базовые теги и семантика", "Формы и валидация", "Доступность (a11y)", "SEO-теги и Open Graph"]'::jsonb, 1, 1),
  (2, 1, 'CSS',
   'Стилизация и адаптивность: Flexbox, Grid, медиазапросы, CSS-переменные и анимации для создания современных интерфейсов.',
   '["Селекторы и каскад", "Flexbox & CSS Grid", "Адаптивная вёрстка & Media Queries", "CSS-переменные и анимации"]'::jsonb, 2, 2),
  (3, 1, 'JavaScript',
   'Язык интерактивности: синтаксис, DOM, асинхронность (Promises, async/await), Event Loop и работа с API.',
   '["Основы языка и ES6+", "Работа с DOM и событиями", "Асинхронность (Fetch, Promises, async/await)", "Event Loop и замыкания"]'::jsonb, 3, 3),
  (4, 1, 'TypeScript',
   'Статическая типизация поверх JS: интерфейсы, дженерики, типы. Защита от ошибок на этапе разработки.',
   '["Базовые типы и интерфейсы", "Generics & Utility Types", "Типизация API и внешних библиотек", "Конфигурация tsconfig"]'::jsonb, 2, 4),
  (5, 1, 'React',
   'Компонентный подход: JSX, хуки (useState, useEffect), управление состоянием, жизненный цикл и экосистема.',
   '["JSX и компоненты", "Основные хуки (useState, useEffect, useRef)", "Управление состоянием (Zustand/Redux)", "React Router & Формы"]'::jsonb, 3, 5),
  (6, 1, 'Next.js',
   'Fullstack React-фреймворк: SSR, SSG, файловый роутинг, оптимизация производительности и SEO из коробки.',
   '["App Router и серверные компоненты (RSC)", "Data Fetching (SSR, SSG, ISR)", "Server Actions и API Routes", "Оптимизация изображений и SEO"]'::jsonb, 2, 6),

-- Backend Roadmap
  (7, 2, 'Python',
   'Базовый язык бэкенда: переменные, структуры данных, ООП, декораторы, генераторы и работа с пакетами.',
   '["Синтаксис и встроенные структуры данных", "ООП и магические методы", "Декораторы и генераторы", "Управление окружением (uv/poetry)"]'::jsonb, 2, 1),
  (8, 2, 'Linux & Terminal',
   'Уверенная работа с командной строкой: права доступа, управление процессами, SSH и bash-скрипты.',
   '["Базовые команды и навигация", "Права доступа и пользователи", "Управление процессами и фоновые задачи", "SSH и основы Bash-скриптов"]'::jsonb, 1, 2),
  (9, 2, 'Git',
   'Контроль версий: ветвление, коммиты, слияния, разрешение конфликтов и командная работа через GitHub/GitLab.',
   '["Коммиты и история (log, diff)", "Ветвление и слияние (merge, rebase)", "Разрешение конфликтов", "Командный workflow (PR / Code Review)"]'::jsonb, 1, 3),
  (10, 2, 'SQL',
   'Язык запросов к данным: выборки, фильтрация, JOIN-ы, агрегатные функции, индексы и транзакции.',
   '["Основы SELECT, INSERT, UPDATE, DELETE", "Связи и JOIN-ы (INNER, LEFT, RIGHT)", "Агрегатные функции и GROUP BY", "Индексы и транзакции (ACID)"]'::jsonb, 2, 4),
  (11, 2, 'FastAPI',
   'Современный веб-фреймворк: асинхронные эндпоинты, валидация через Pydantic, автоматическая Swagger-документация.',
   '["Маршрутизация и Request/Response", "Валидация данных с Pydantic", "Dependency Injection (Зависимости)", "Обработка ошибок и Middleware"]'::jsonb, 2, 5),
  (12, 2, 'PostgreSQL',
   'Реляционная БД: проектирование схем, внешние ключи, ORM (SQLAlchemy / SQLModel), миграции и оптимизация.',
   '["Проектирование схем и нормализация", "SQLAlchemy / Async ORM", "Миграции базы данных (Alembic)", "Сложные запросы и оптимизация"]'::jsonb, 2, 6),
  (13, 2, 'Docker',
   'Контейнеризация: написание Dockerfile, изолированные окружения, мульти-контейнерные сборки с Docker Compose.',
   '["Основы контейнеров и образов", "Написание оптимального Dockerfile", "Docker Compose для мультисервисов", "Volumes и сети в Docker"]'::jsonb, 2, 7),
  (14, 2, 'Deploy',
   'Вывод приложения в продакшен: настройка Nginx/Caddy, CI/CD пайплайны, системные службы и мониторинг.',
   '["Аренда VPS и первоначальная настройка", "Reverse Proxy (Nginx / Caddy) + SSL", "Systemd и фоновые процессы", "Базовый CI/CD (GitHub Actions)"]'::jsonb, 2, 8);

-- Достижения (Badges)
INSERT INTO badges (id, code, title, description, condition, tier, icon, sort_order, is_active) VALUES
  ('b1000000-0000-4000-8000-000000000001', 'first_step', 'Первый шаг', 'Пройдите ваш первый этап обучения.', 'Пройден 1 этап', 'common', 'footprints', 1, true),
  ('b1000000-0000-4000-8000-000000000002', 'streak_3', 'В ритме', 'Занимайтесь 3 дня подряд.', 'Стрик 3 дня', 'common', 'flame', 2, true),
  ('b1000000-0000-4000-8000-000000000003', 'frontend_master', 'Фронтендер', 'Полностью закройте роадмап Frontend.', 'Пройдены все этапы Frontend', 'rare', 'layout', 3, true),
  ('b1000000-0000-4000-8000-000000000004', 'backend_master', 'Бэкендер', 'Полностью закройте роадмап Backend.', 'Пройдены все этапы Backend', 'rare', 'server', 4, true),
  ('b1000000-0000-4000-8000-000000000005', 'fullstack_legend', 'Легенда Fullstack', 'Завершите оба направления: Frontend и Backend.', 'Завершены Frontend и Backend', 'legend', 'trophy', 5, true);

-- Прогресс
INSERT INTO stage_progress (user_id, stage_id, completed_at) VALUES
  ('a1b2c3d4-0000-4000-8000-000000000001', 1, now() - interval '2 days'),
  ('a1b2c3d4-0000-4000-8000-000000000001', 2, now() - interval '1 day'),
  ('a1b2c3d4-0000-4000-8000-000000000001', 3, now());

-- Выдача начальных ачивок пользователю
INSERT INTO user_badges (id, user_id, badge_id, earned_at) VALUES
  ('a1b2c3d4-0000-4000-8000-000000000001', 'a1b2c3d4-0000-4000-8000-000000000001', 'b1000000-0000-4000-8000-000000000001', now() - interval '2 days'),
  ('a1b2c3d4-0000-4000-8000-000000000002', 'a1b2c3d4-0000-4000-8000-000000000001', 'b1000000-0000-4000-8000-000000000002', now());

COMMIT;

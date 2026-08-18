BEGIN;

-- Если колонка description ещё не добавлена в схему таблицы:
-- ALTER TABLE stages ADD COLUMN IF NOT EXISTS description TEXT;

TRUNCATE stage_progress, refresh_tokens, stages, roadmaps, users RESTART IDENTITY CASCADE;

-- Юзер: dev@devio.kg / secret123 (argon2-хеш от secret123)
INSERT INTO users (id, email, password_hash, role) VALUES (
  'a1b2c3d4-0000-4000-8000-000000000001',
  'dev@devio.kg',
  '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHRzb21lc2FsdA$Rl0eUnBWKYbnBqC+rWmiJLl0osw2xAgZzhZa8T/E8Vw',
  'user'
);

INSERT INTO roadmaps (id, slug, title, description) VALUES
  (1, 'frontend', 'Frontend', 'От HTML до продакшен-React: вёрстка, JavaScript, TypeScript, фреймворки и первый деплой.'),
  (2, 'backend',  'Backend',  'Python, FastAPI, базы данных и API: от первого эндпоинта до сервера с реальными пользователями.');

INSERT INTO stages (id, roadmap_id, title, description, position) VALUES
  -- Frontend
  (1, 1, 'HTML', 'Скелет любой страницы: теги, семантика, формы, доступность. Фундамент, на котором стоит всё остальное.', 1),
  (2, 1, 'CSS', 'Стилизация и адаптивность: Flexbox, Grid, медиазапросы, CSS-переменные и анимации для создания современных интерфейсов.', 2),
  (3, 1, 'JavaScript', 'Язык интерактивности: синтаксис, DOM, асинхронность (Promises, async/await), Event Loop и работа с API.', 3),
  (4, 1, 'TypeScript', 'Статическая типизация поверх JS: интерфейсы, дженерики, типы. Защита от ошибок на этапе разработки.', 4),
  (5, 1, 'React', 'Компонентный подход: JSX, хуки (useState, useEffect), управление состоянием, жизненный цикл и экосистема.', 5),
  (6, 1, 'Next.js', 'Fullstack React-фреймворк: SSR, SSG, файловый роутинг, оптимизация производительности и SEO из коробки.', 6),

  -- Backend
  (7, 2, 'Python', 'Базовый язык бэкенда: переменные, структуры данных, ООП, декораторы, генераторы и работа с пакетами.', 1),
  (8, 2, 'Linux & Terminal', 'Уверенная работа с командной строкой: права доступа, управление процессами, SSH и bash-скрипты.', 2),
  (9, 2, 'Git', 'Контроль версий: ветвление, коммиты, слияния, разрешение конфликтов и командная работа через GitHub/GitLab.', 3),
  (10, 2, 'SQL', 'Язык запросов к данным: выборки, фильтрация, JOIN-ы, агрегатные функции, индексы и транзакции.', 4),
  (11, 2, 'FastAPI', 'Современный веб-фреймворк: асинхронные эндпоинты, валидация через Pydantic, автоматическая Swagger-документация.', 5),
  (12, 2, 'PostgreSQL', 'Реляционная БД: проектирование схем, внешние ключи, ORM (SQLAlchemy / SQLModel), миграции и оптимизация.', 6),
  (13, 2, 'Docker', 'Контейнеризация: написание Dockerfile, изолированные окружения, мульти-контейнерные сборки с Docker Compose.', 7),
  (14, 2, 'Deploy', 'Вывод приложения в продакшен: настройка Nginx/Caddy, CI/CD пайплайны, системные службы и мониторинг.', 8);

-- Прогресс: HTML/CSS/JS пройдены, стрик 3 дня (сегодня/вчера/позавчера)
INSERT INTO stage_progress (user_id, stage_id, completed_at) VALUES
  ('a1b2c3d4-0000-4000-8000-000000000001', 1, now() - interval '2 days'),
  ('a1b2c3d4-0000-4000-8000-000000000001', 2, now() - interval '1 day'),
  ('a1b2c3d4-0000-4000-8000-000000000001', 3, now());

COMMIT;
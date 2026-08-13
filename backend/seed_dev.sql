BEGIN;

TRUNCATE stage_progress, refresh_tokens, stages, roadmaps, users RESTART IDENTITY CASCADE;

-- Юзер: dev@devio.kg / secret123 (argon2-хеш от secret123)
INSERT INTO users (id, email, password_hash, role) VALUES (
  'a1b2c3d4-0000-4000-8000-000000000001',
  'dev@devio.kg',
  '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHRzb21lc2FsdA$Rl0eUnBWKYbnBqC+rWmiJLl0osw2xAgZzhZa8T/E8Vw',
  'user'
);

INSERT INTO roadmaps (slug, title, description) VALUES
  ('frontend', 'Frontend', 'От HTML до продакшен-React: вёрстка, JavaScript, TypeScript, фреймворки и первый деплой.'),
  ('backend',  'Backend',  'Python, FastAPI, базы данных и API: от первого эндпоинта до сервера с реальными пользователями.');

INSERT INTO stages (roadmap_id, title, position) VALUES
  (1, 'HTML', 1), (1, 'CSS', 2), (1, 'JavaScript', 3),
  (1, 'TypeScript', 4), (1, 'React', 5), (1, 'Next.js', 6),
  (2, 'Python', 1), (2, 'Linux & Terminal', 2), (2, 'Git', 3),
  (2, 'SQL', 4), (2, 'FastAPI', 5), (2, 'PostgreSQL', 6),
  (2, 'Docker', 7), (2, 'Deploy', 8);

-- Прогресс: HTML/CSS/JS пройдены, стрик 3 дня (сегодня/вчера/позавчера)
INSERT INTO stage_progress (user_id, stage_id, completed_at) VALUES
  ('a1b2c3d4-0000-4000-8000-000000000001', 1, now() - interval '2 days'),
  ('a1b2c3d4-0000-4000-8000-000000000001', 2, now() - interval '1 day'),
  ('a1b2c3d4-0000-4000-8000-000000000001', 3, now());

COMMIT;
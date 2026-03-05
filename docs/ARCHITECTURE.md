# Architecture — Calendar Telegram Bot

Цель документа: зафиксировать структуру проекта, зоны ответственности и правила зависимостей.
Это помогает не превращать репозиторий в “свалку” по мере роста функционала.

---

## Высокоуровневая схема

Telegram Update → `bot/` → `flows/` → (`services/` + `db/`) → ответ в Telegram

- `bot/` — принимает апдейты (команды/кнопки/сообщения), отвечает пользователю.
- `flows/` — реализует сценарии (wizard): шаги, переходы, черновики.
- `services/` — чистая прикладная логика (генерация `.ics`, парсинг дат, правила домена).
- `db/` — работа с БД через Prisma (репозитории, CRUD).
- `config/` — чтение/валидация env и базовые настройки.

---

## Структура каталогов

```text
src/
  main.ts              # точка входа: запуск бота, регистрация middleware/handlers
  bot/                 # Telegram слой (Telegraf): handlers, keyboards, messages
  flows/               # сценарии (wizard/use cases): create template, generate .ics, etc.
  services/            # чистая логика: ics, date-time, domain rules
  db/                  # prisma client + репозитории + транзакции
  config/              # env, константы, настройки
prisma/
  schema.prisma
  migrations/
docs/
  ARCHITECTURE.md
  DECISIONS.md
  ROADMAP.md
scripts/
  check-lockfiles.cjs
dist/                  # build output (не коммитим)
```

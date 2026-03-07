# Flows

Flows — это сценарии (use cases / wizard), которые ведут пользователя по шагам и возвращают результат.
Flow **не должен** зависеть от Telegram UI (Telegraf `ctx`), и **не должен** отправлять сообщения напрямую.

## Общая схема

Telegram update → `bot/` → `flows/` → (`services/` + `db/`) → `bot/` отправляет сообщение/файл

- `bot/` — адаптер Telegram (handlers, keyboards, message formatting, отправка файла)
- `flows/` — “мозг сценария”: шаги, черновик, переходы, валидация
- `services/` — чистая логика (генерация `.ics`, парсинг дат)
- `db/` — Prisma/репозитории (для FR-2 пока можно не использовать)

---

## FR-2. Создание события и файла `.ics` (wizard)

### Файлы, которые участвуют

### `src/bot/`

- `handlers/events.ts`
  - action `ev:create` — старт мастера
  - обработка текста пользователя на шагах
  - отправка `.ics` через `ctx.replyWithDocument(...)`
- `ui/keyboards.ts`
  - кнопки: `Назад`, `Отмена`, `Пропустить`
  - варианты напоминаний
- `ui/messages.ts` (опционально)
  - шаблоны текстов шагов и ошибок

### `src/flows/`

- `createEventFlow.ts`
  - `beginCreateEvent(userId)` → что спросить на первом шаге
  - `handleCreateEventText(userId, text)` → next step / confirm / generate
  - возвращает **результат** (данные), а не делает `ctx.reply`
- `eventDraftStore.ts`
  - in-memory `Map<userId, Draft>` (позже можно заменить на БД)

### `src/services/`

- `dateTime.ts`
  - парсинг `YYYY-MM-DD HH:mm` → `Date`
  - позже: таймзона
- `icsService.ts`
  - `createIcsFile(event)` → `{ filename, content: Buffer }`
  - использует пакет `ics`, добавляет `VALARM` при необходимости

### `src/db/` (минимально)

- если понадобится таймзона пользователя — `usersRepo.ensureUser`
- для FR-2 можно стартовать без БД (мастер + файл)

---

## Правила зависимостей (кратко)

- `bot/*` может импортировать `flows/*`, но не должен импортировать `db/*` и `services/*`
- `flows/*` может импортировать `services/*` и `db/*`
- `services/*` не импортирует `bot/*`, `flows/*`, `db/*`
- `db/*` не импортирует `bot/*`, `flows/*`, `services/*`

---

## Паттерн возврата результата из flow

Flow возвращает простой объект результата, а `bot/` решает, как показать пользователю.

Пример (идея, не строго API):

- `{ kind: 'reply', text }`
- `{ kind: 'sendIcs', text, filename, content }`

Это делает flow тестируемым и упрощает развитие сценариев.

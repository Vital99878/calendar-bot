# Calendar Bot (Telegram)

Telegram-бот для генерации календарных событий в формате `.ics` и работы с **шаблонами** (сохранение/повторная генерация события с другой датой).

## Возможности

- Создание шаблона события (title/description/location/duration/remind и т.п.)
- Повторная генерация `.ics` из сохранённого шаблона с новой датой/временем
- Хранение данных в PostgreSQL

> `.ics` обычно импортируется в Apple Calendar (iOS/macOS), Google Calendar (web), и многие Android-календари.

## Стек

- Node.js (ESM)
- TypeScript
- Telegraf (Telegram Bot API)
- Prisma + PostgreSQL
- Zod (валидация пользовательского ввода и env)
- ESLint + Prettier + Husky + lint-staged
- Vitest

## Требования

- Node.js: 22+
- pnpm (через Corepack)
- PostgreSQL (локально через Docker или внешний managed)

## Быстрый старт

### 1) Установка зависимостей

```bash
corepack enable
pnpm install
```

## Заголовок коммита (первая строка)

Формат **заголовка** (обязательно):
`<тип>(<scope>)?: <краткое описание>`

Пример заголовка:
`feat(api): добавить http client`

Типы:
build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test

Scope (если указан):
tooling, repo, config, ci, app, router, api, query, mocks, shared, ui, entities, features, widgets, pages, docs

Длинна всего заголовка:
<= 100 символов

Тело коммита можно писать свободно, любым языком

import { z } from 'zod'
import { clearDraft, getDraft, startCreateEvent, updateDraft } from './eventDraftStore.js'
import { parseLocalDateTime } from '../services/dateTime.js'
import { createIcsFile } from '../services/icsService.js'

export type FlowResult =
  | { kind: 'reply'; text: string; keyboard?: 'wizard' | 'confirm' }
  | { kind: 'sendIcs'; text: string; filename: string; content: Buffer }
  | { kind: 'noop' }

const TitleSchema = z
  .string()
  .trim()
  .min(1, 'Название не должно быть пустым')
  .max(80, 'Макс 80 символов')
const DurationSchema = z.coerce
  .number()
  .int()
  .min(1, 'Минимум 1 мин')
  .max(24 * 60, 'Макс 1440 мин')

export function beginCreateEvent(userId: number): FlowResult {
  startCreateEvent(userId)
  return { kind: 'reply', text: '🗓 Введи *название* события:', keyboard: 'wizard' }
}

export function cancelCreateEvent(userId: number): FlowResult {
  clearDraft(userId)
  return { kind: 'reply', text: 'Ок, отменил создание события.' }
}

export function handleCreateEventText(userId: number, text: string): FlowResult {
  const draft = getDraft(userId)
  if (!draft) return { kind: 'noop' }

  if (draft.step === 'title') {
    const parsed = TitleSchema.safeParse(text)
    if (!parsed.success) {
      return {
        kind: 'reply',
        text: `❌ ${parsed.error.issues[0]?.message}\nПопробуй ещё раз:`,
        keyboard: 'wizard',
      }
    }
    updateDraft(userId, { title: parsed.data, step: 'start' })
    return {
      kind: 'reply',
      text: '📅 Введи *дату и время начала* в формате `YYYY-MM-DD HH:mm`:',
      keyboard: 'wizard',
    }
  }

  if (draft.step === 'start') {
    const r = parseLocalDateTime(text)
    if (!r.ok) {
      return {
        kind: 'reply',
        text: `❌ ${r.error}\nФормат: \`YYYY-MM-DD HH:mm\``,
        keyboard: 'wizard',
      }
    }
    updateDraft(userId, { startAt: r.value, step: 'duration', durationMinutes: 60 })
    return {
      kind: 'reply',
      text: '⏱ Введи *длительность* в минутах (по умолчанию 60):',
      keyboard: 'wizard',
    }
  }

  if (draft.step === 'duration') {
    // если пользователь отправил пустое (редко в TG), но оставим как идею
    const parsed = DurationSchema.safeParse(text)
    if (!parsed.success) {
      return {
        kind: 'reply',
        text: `❌ ${parsed.error.issues[0]?.message}\nНапример: 30, 60, 90`,
        keyboard: 'wizard',
      }
    }
    updateDraft(userId, { durationMinutes: parsed.data, step: 'confirm' })
    return { kind: 'reply', text: buildSummary(userId), keyboard: 'confirm' }
  }

  if (draft.step === 'confirm') {
    // на этом шаге текстом ничего не принимаем
    return { kind: 'reply', text: 'Выбери действие кнопками ниже 👇', keyboard: 'confirm' }
  }

  return { kind: 'noop' }
}

export function confirmCreateEvent(userId: number): FlowResult {
  const draft = getDraft(userId)
  if (!draft?.title || !draft.startAt || !draft.durationMinutes) {
    return { kind: 'reply', text: 'Черновик события неполный. Начни заново: /start' }
  }

  const { filename, content } = createIcsFile({
    title: draft.title,
    startAt: draft.startAt,
    durationMinutes: draft.durationMinutes,
  })

  clearDraft(userId)

  return {
    kind: 'sendIcs',
    text: '✅ Готово! Вот твой файл события `.ics`.',
    filename,
    content,
  }
}

function buildSummary(userId: number) {
  const d = getDraft(userId)
  if (!d?.title || !d.startAt || !d.durationMinutes) return 'Черновик неполный'

  const yyyy = d.startAt.getFullYear()
  const mm = String(d.startAt.getMonth() + 1).padStart(2, '0')
  const dd = String(d.startAt.getDate()).padStart(2, '0')
  const hh = String(d.startAt.getHours()).padStart(2, '0')
  const mi = String(d.startAt.getMinutes()).padStart(2, '0')

  return (
    `✅ *Проверь данные:*\n` +
    `• Название: *${escapeMd(d.title)}*\n` +
    `• Старт: \`${yyyy}-${mm}-${dd} ${hh}:${mi}\`\n` +
    `• Длительность: *${d.durationMinutes} мин*\n\n` +
    `Если всё ок — жми ✅ Подтвердить.`
  )
}

function escapeMd(s: string) {
  return s.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&')
}

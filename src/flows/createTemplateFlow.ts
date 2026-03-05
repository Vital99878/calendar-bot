import { z } from 'zod'
import { startCreateTemplate, getDraft, setTitle, clearDraft } from '../flows/templateDraftStore.js'

const TitleSchema = z
  .string()
  .trim()
  .min(1, 'Название не должно быть пустым')
  .max(80, 'Макс 80 символов')

export function beginCreateTemplate(userId: number) {
  startCreateTemplate(userId)
  return {
    text: 'Введи название шаблона одним сообщением:',
  }
}

export function handleCreateTemplateText(userId: number, text: string) {
  const draft = getDraft(userId)
  if (!draft) return null // пользователь не в этом flow

  const parsed = TitleSchema.safeParse(text)
  if (!parsed.success) {
    return {
      text: `❌ ${parsed.error.issues[0]?.message}\nПопробуй ещё раз:`,
    }
  }

  setTitle(userId, parsed.data)

  // пока “сохраняем” условно и завершаем
  clearDraft(userId)

  return {
    text: `✅ Шаблон создан (пока в демо-режиме).\nНазвание: "${parsed.data}"\n\nДальше подключим Prisma и начнём сохранять в БД.`,
  }
}

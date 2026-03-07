import { z } from 'zod'
import { clearDraft, getDraft, setTitle, startCreateTemplate } from './templateDraftStore.js'
import { ensureUser } from '../db/usersRepo.js'
import { createTemplate } from '../db/templatesRepo.js'

const TitleSchema = z
  .string()
  .trim()
  .min(1, 'Название не должно быть пустым')
  .max(80, 'Макс 80 символов')

export function beginCreateTemplate(userId: number) {
  startCreateTemplate(userId)
  return { text: 'Введи название шаблона одним сообщением:' }
}

export async function handleCreateTemplateText(userId: number, text: string) {
  const draft = getDraft(userId)
  if (!draft) return null

  const parsed = TitleSchema.safeParse(text)
  if (!parsed.success) {
    return { text: `❌ ${parsed.error.issues[0]?.message}\nПопробуй ещё раз:` }
  }

  setTitle(userId, parsed.data)

  const user = await ensureUser(String(userId))
  const tpl = await createTemplate({ userId: user.id, title: parsed.data })

  clearDraft(userId)

  return {
    text: `✅ Шаблон сохранён в БД!\nНазвание: "${tpl.title}"\nID: ${tpl.id}\n\nДальше добавим шаги (описание/напоминание) и генерацию .ics.`,
  }
}

import { ensureUser } from '../db/usersRepo.js'
import { listTemplatesByUser } from '../db/templatesRepo.js'

export async function listTemplates(userId: number) {
  const user = await ensureUser(String(userId))
  const templates = await listTemplatesByUser(user.id, 10)

  if (templates.length === 0) {
    return { text: 'У тебя пока нет шаблонов. Нажми “➕ Создать шаблон”.' }
  }

  const lines = templates.map((t: { title: string }, i: number) => `${i + 1}. ${t.title}`)
  return {
    text: `📄 Твои шаблоны:\n${lines.join('\n')}\n\nСкоро добавим кнопку “Сгенерировать .ics”.`,
  }
}

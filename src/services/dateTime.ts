import { z } from 'zod'

function normalizeDateTimeInput(s: string) {
  return s
    .trim()
    .replace(/[–—−]/g, '-') // разные тире → дефис
    .replace(/：/g, ':') // полноширинное двоеточие → обычное
    .replace(/\s+/g, ' ')
}

const DateTimeSchema = z
  .string()
  .transform(normalizeDateTimeInput)
  .pipe(z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/, 'Формат: YYYY-MM-DD HH:mm'))

export function parseLocalDateTime(input: string) {
  const parsed = DateTimeSchema.safeParse(input)
  if (!parsed.success)
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Некорректный формат' }

  const [datePart, timePart] = parsed.data.split(' ')
  const iso = `${datePart}T${timePart}:00`
  const d = new Date(iso)

  if (Number.isNaN(d.getTime())) return { ok: false as const, error: 'Некорректная дата/время' }
  return { ok: true as const, value: d }
}

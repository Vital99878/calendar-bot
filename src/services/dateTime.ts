import { z } from 'zod'

const DateTimeSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/, 'Формат: YYYY-MM-DD HH:mm')

export function parseLocalDateTime(
  input: string,
): { ok: true; value: Date } | { ok: false; error: string } {
  const parsed = DateTimeSchema.safeParse(input)
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Некорректный формат' }

  const [datePart, timePart] = parsed.data.split(' ')
  const iso = `${datePart}T${timePart}:00`
  const d = new Date(iso)

  if (Number.isNaN(d.getTime())) return { ok: false, error: 'Некорректная дата/время' }
  return { ok: true, value: d }
}

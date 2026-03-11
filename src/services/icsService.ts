import { createEvent, type EventAttributes } from 'ics'

export type IcsInput = {
  title: string
  startAt: Date
  durationMinutes: number
  description?: string
  location?: string
}

export function createIcsFile(input: IcsInput): { filename: string; content: Buffer } {
  const attrs: EventAttributes = {
    title: input.title,
    description: input.description,
    start: toIcsDateParts(input.startAt),
    duration: { minutes: input.durationMinutes },
    location: input.location,
  }

  const { error, value } = createEvent(attrs)
  if (error || !value) {
    throw error ?? new Error('Failed to generate ICS')
  }

  return {
    filename: 'event.ics', // todo Название файла
    content: Buffer.from(value, 'utf8'),
  }
}

function toIcsDateParts(d: Date): [number, number, number, number, number] {
  // локальные значения (как ввёл пользователь)
  return [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes()]
}

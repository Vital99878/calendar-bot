import { createEvent, type EventAttributes } from 'ics'

export type IcsInput = {
  title: string
  description?: string
  startAt: Date
  durationMinutes: number
  remindMinutes?: number | null
  location?: string
}

export function createIcsFile(input: IcsInput): { filename: string; content: Buffer } {
  const attrs: EventAttributes = {
    title: input.title,
    description: input.description,
    start: toIcsDateParts(input.startAt),
    duration: { minutes: input.durationMinutes },
    location: input.location,
    alarms: [],
  }

  // eslint-disable-next-line prefer-const
  let { error, value } = createEvent(attrs)
  if (error || !value) {
    throw error ?? new Error('Failed to generate ICS')
  }

  if (input.remindMinutes && input.remindMinutes > 0) {
    value = withValarm(value, input.remindMinutes)
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

function withValarm(value: string, minutes: number) {
  const nl = value.includes('\r\n') ? '\r\n' : '\n'
  const trigger = minutes % 1440 === 0 ? `-P${minutes / 1440}D` : `-PT${minutes}M`

  const alarm =
    `BEGIN:VALARM${nl}` +
    `ACTION:DISPLAY${nl}` +
    `DESCRIPTION:Reminder${nl}` +
    `TRIGGER:${trigger}${nl}` +
    `END:VALARM${nl}`

  return value.replace(`${nl}END:VEVENT`, `${nl}${alarm}END:VEVENT`)
}

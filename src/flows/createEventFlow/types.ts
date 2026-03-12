export type CreateEventDraft = {
  step: 'title' | 'description' | 'start' | 'duration' | 'confirm' | 'remind'
  title?: string
  description?: string
  startAt?: Date
  durationMinutes?: number
  isAllDay?: boolean
  remindMinutes?: number | null
}

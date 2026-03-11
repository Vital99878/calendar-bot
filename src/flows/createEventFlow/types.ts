export type CreateEventDraft = {
  step: 'title' | 'description' | 'start' | 'duration' | 'confirm'
  title?: string
  description?: string
  startAt?: Date
  durationMinutes?: number
}

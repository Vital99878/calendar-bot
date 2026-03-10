export type CreateEventDraft = {
  step: 'title' | 'start' | 'duration' | 'confirm' | 'description'
  title?: string
  description?: string
  startAt?: Date
  durationMinutes?: number
}

const drafts = new Map<number, CreateEventDraft>()

export function startCreateEvent(userId: number) {
  drafts.set(userId, { step: 'title' })
}

export function getDraft(userId: number) {
  return drafts.get(userId)
}

export function updateDraft(userId: number, patch: Partial<CreateEventDraft>) {
  const prev = drafts.get(userId)
  if (!prev) return
  drafts.set(userId, { ...prev, ...patch })
}

export function clearDraft(userId: number) {
  drafts.delete(userId)
}

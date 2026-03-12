export type CreateTemplateDraft = {
  step: 'title'
  title?: string
  isAllDay?: boolean
  remindMinutes?: number | null
}

const drafts = new Map<number, CreateTemplateDraft>()

export function startCreateTemplate(userId: number) {
  drafts.set(userId, { step: 'title' })
}

export function getDraft(userId: number) {
  return drafts.get(userId)
}

export function setTitle(userId: number, title: string) {
  drafts.set(userId, { step: 'title', title })
}

export function clearDraft(userId: number) {
  drafts.delete(userId)
}

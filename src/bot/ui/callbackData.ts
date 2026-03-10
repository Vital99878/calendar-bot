// src/bot/callbacks.ts

export const ICS = {
  CREATE: 'ics:create',
  CANCEL: 'ics:cancel',
  CONFIRM: 'ics:confirm',
  SKIP: 'ics:skip',
  BACK: 'ics:back',
} as const

// на будущее
export const TPL = {
  CREATE: 'tpl:create',
  LIST: 'tpl:list',
  OPEN: (id: string) => `tpl:open:${id}`,
  GEN: (id: string) => `tpl:gen:${id}`,
  DEL: (id: string) => `tpl:del:${id}`,
} as const

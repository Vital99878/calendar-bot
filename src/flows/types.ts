/**
 * FlowOutcome — контракт между flows и Telegram UI.
 *
 * Flow НЕ отправляет сообщения напрямую.
 * Вместо этого он возвращает Outcome, а bot-layer исполняет его
 * (отправляет текст, клавиатуру, файл и т.п.).
 *
 * Это держит flows чистыми и тестируемыми.
 */
export type FlowOutcome =
  | { kind: 'reply'; text: string; keyboard?: 'wizard' | 'confirm' | 'description' }
  | { kind: 'sendIcs'; text: string; filename: string; content: Buffer }
  | { kind: 'noop' }

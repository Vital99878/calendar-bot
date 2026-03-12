const MONTHS_RU_GEN = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
]

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function formatDDMMYYYY(d: Date) {
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`
}

function formatRuMonth(d: Date) {
  return `${d.getDate()} ${MONTHS_RU_GEN[d.getMonth()]} ${d.getFullYear()}`
}

function nextNiceSlot(now: Date) {
  const d = new Date(now)
  d.setSeconds(0, 0)
  // ближайшие :00 или :30
  if (d.getMinutes() === 0 || d.getMinutes() === 30) return d
  if (d.getMinutes() < 30) d.setMinutes(30)
  else {
    d.setHours(d.getHours() + 1)
    d.setMinutes(0)
  }
  return d
}

export function buildDateExamplesHtml(now: Date) {
  const a = nextNiceSlot(new Date(now.getTime() + 2 * 60 * 60 * 1000))
  const b = new Date(a.getTime() + 24 * 60 * 60 * 1000)

  const tA = `${pad2(a.getHours())}:${pad2(a.getMinutes())}`
  const tB = `${pad2(b.getHours())}:${pad2(b.getMinutes())}`

  return (
    `<b>Примеры (можно копировать):</b>\n` +
    `• <code>${formatDDMMYYYY(a)} ${tA}</code>\n` +
    `• <code>${formatRuMonth(a)} ${tA}</code>\n` +
    `• <code>${formatDDMMYYYY(b)} ${tB}</code>\n` +
    `• <code>${formatRuMonth(b)} ${tB}</code>\n\n` +
    `Форматы:\n` +
    `• <code>DD.MM.YYYY HH:mm</code>\n` +
    `• <code>1 января 2026 HH:mm</code>`
  )
}

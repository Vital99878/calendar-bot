const monthRu: Record<string, number> = {
  января: 0,
  февраля: 1,
  марта: 2,
  апреля: 3,
  мая: 4,
  июня: 5,
  июля: 6,
  августа: 7,
  сентября: 8,
  октября: 9,
  ноября: 10,
  декабря: 11,
}

function normalizeInput(s: string) {
  return s
    .trim()
    .replace(/[–—−]/g, '-') // разные тире → дефис
    .replace(/：/g, ':') // полноширинное двоеточие → обычное
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

function isValidDate(d: Date, y: number, m: number, day: number, hh: number, mm: number) {
  return (
    d.getFullYear() === y &&
    d.getMonth() === m &&
    d.getDate() === day &&
    d.getHours() === hh &&
    d.getMinutes() === mm
  )
}

export function parseLocalDateTime(
  raw: string,
): { ok: true; value: Date } | { ok: false; error: string } {
  const s = normalizeInput(raw)

  // 1) DD.MM.YYYY HH:mm
  {
    const m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\s+(\d{1,2}):(\d{2})$/)
    if (m) {
      const day = Number(m[1])
      const mon = Number(m[2]) - 1
      const year = Number(m[3])
      const hh = Number(m[4])
      const mm = Number(m[5])

      const d = new Date(year, mon, day, hh, mm, 0, 0)
      if (!isValidDate(d, year, mon, day, hh, mm))
        return { ok: false, error: 'Некорректная дата/время' }
      return { ok: true, value: d }
    }
  }

  // 2) "1 января 2026 HH:mm"
  {
    const m = s.match(/^(\d{1,2})\s+([а-яё]+)\s+(\d{4})\s+(\d{1,2}):(\d{2})$/)
    if (m) {
      const day = Number(m[1])
      const monthWord = m[2]
      const mon = monthRu[monthWord as string]
      if (mon === undefined) {
        return { ok: false, error: `Не понял месяц: "${monthWord}". Пример: 1 января 2026 21:30` }
      }
      const year = Number(m[3])
      const hh = Number(m[4])
      const mm = Number(m[5])

      const d = new Date(year, mon, day, hh, mm, 0, 0)
      if (!isValidDate(d, year, mon, day, hh, mm))
        return { ok: false, error: 'Некорректная дата/время' }
      return { ok: true, value: d }
    }
  }

  // (опционально) 3) YYYY-MM-DD HH:mm
  {
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})$/)
    if (m) {
      const year = Number(m[1])
      const mon = Number(m[2]) - 1
      const day = Number(m[3])
      const hh = Number(m[4])
      const mm = Number(m[5])

      const d = new Date(year, mon, day, hh, mm, 0, 0)
      if (!isValidDate(d, year, mon, day, hh, mm))
        return { ok: false, error: 'Некорректная дата/время' }
      return { ok: true, value: d }
    }
  }

  return {
    ok: false,
    error: 'Неверный формат. Примеры:\n' + '• 10.03.2026 21:30\n' + '• 1 января 2026 21:30',
  }
}

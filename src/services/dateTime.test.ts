import { describe, expect, it } from 'vitest'
import { parseLocalDateTime } from './dateTime.js'

function expectParts(d: Date, y: number, m0: number, day: number, hh: number, mm: number) {
  expect(d.getFullYear()).toBe(y)
  expect(d.getMonth()).toBe(m0) // 0-based
  expect(d.getDate()).toBe(day)
  expect(d.getHours()).toBe(hh)
  expect(d.getMinutes()).toBe(mm)
}

describe('parseLocalDateTime', () => {
  it('parses DD.MM.YYYY HH:mm', () => {
    const r = parseLocalDateTime('10.03.2026 21:30')
    expect(r.ok).toBe(true)
    if (r.ok) expectParts(r.value, 2026, 2, 10, 21, 30) // March = 2
  })

  it('parses DD.MM.YYYY with 1-digit day/month/hour', () => {
    const r = parseLocalDateTime('1.1.2026 9:05')
    expect(r.ok).toBe(true)
    if (r.ok) expectParts(r.value, 2026, 0, 1, 9, 5) // Jan = 0
  })

  it('parses "1 января 2026 HH:mm"', () => {
    const r = parseLocalDateTime('1 января 2026 21:30')
    expect(r.ok).toBe(true)
    if (r.ok) expectParts(r.value, 2026, 0, 1, 21, 30)
  })

  it('parses russian month case-insensitively and with extra spaces', () => {
    const r = parseLocalDateTime('  1   Января   2026   21:30  ')
    expect(r.ok).toBe(true)
    if (r.ok) expectParts(r.value, 2026, 0, 1, 21, 30)
  })

  it('accepts fullwidth colon', () => {
    const r = parseLocalDateTime('10.03.2026 21：30')
    expect(r.ok).toBe(true)
    if (r.ok) expectParts(r.value, 2026, 2, 10, 21, 30)
  })

  it('parses YYYY-MM-DD HH:mm (optional format)', () => {
    const r = parseLocalDateTime('2026-03-10 21:30')
    expect(r.ok).toBe(true)
    if (r.ok) expectParts(r.value, 2026, 2, 10, 21, 30)
  })

  it('fails on invalid date', () => {
    const r = parseLocalDateTime('31.02.2026 10:00')
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toContain('Некоррект')
  })

  it('fails on unknown russian month word', () => {
    const r = parseLocalDateTime('1 янв 2026 10:00')
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toContain('Не понял месяц')
  })

  it('fails on wrong format', () => {
    const r = parseLocalDateTime('2026/03/10 10:00')
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toContain('Неверный формат')
  })

  it('fails when minutes are not 2 digits', () => {
    const r = parseLocalDateTime('10.03.2026 21:3')
    expect(r.ok).toBe(false)
  })
})

import { Markup } from 'telegraf'
import { ICS } from '../callbackData.js'

export function wizardKeyboard() {
  return Markup.inlineKeyboard([Markup.button.callback('✖️ Отмена', ICS.CANCEL)])
}

export function descriptionKeyboard() {
  return Markup.inlineKeyboard([Markup.button.callback('Пропустить', ICS.SKIP)])
}

export function confirmKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('✅ Подтвердить', ICS.CONFIRM)],
    [Markup.button.callback('✖️ Отмена', ICS.CANCEL)],
  ])
}

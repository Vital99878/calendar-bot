import { Markup } from 'telegraf'
import { ICS } from '../callbackData.js'

export function wizardKeyboard() {
  return Markup.inlineKeyboard([Markup.button.callback('✖️ Отмена', ICS.CANCEL)])
}

export function descriptionKeyboard() {
  return Markup.inlineKeyboard([Markup.button.callback('Пропустить', ICS.SKIP)])
}

export function dateAndTimeStartExampleKeyboard() {
  return Markup.inlineKeyboard([Markup.button.callback('Примеры', ICS.SHOW_START_EXAMPLE)])
}

export function confirmKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('✅ Подтвердить', ICS.CONFIRM)],
    [Markup.button.callback('✖️ Отмена', ICS.CANCEL)],
  ])
}

export function remindKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('без', ICS.REMIND_NONE),
      Markup.button.callback('5', ICS.REMIND(5)),
      Markup.button.callback('10', ICS.REMIND(10)),
      Markup.button.callback('15', ICS.REMIND(15)),
    ],
    [
      Markup.button.callback('30', ICS.REMIND(30)),
      Markup.button.callback('60', ICS.REMIND(60)),
      Markup.button.callback('1 день', ICS.REMIND(1440)),
    ],
  ])
}

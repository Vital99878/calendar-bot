import { Markup, type Telegraf } from 'telegraf'
import { ICS, TPL } from '../ui/callbackData.js'

export function registerStart(bot: Telegraf) {
  bot.start(async (ctx) => {
    await ctx.reply(
      'Привет! Я календарь-бот. Начнём 🙂',
      Markup.inlineKeyboard([
        Markup.button.callback('🗓 Создать событие (.ics)', ICS.CREATE),
        Markup.button.callback('➕ Создать шаблон', TPL.CREATE),
        Markup.button.callback('📄 Мои шаблоны', TPL.LIST),
      ]),
    )
  })
}

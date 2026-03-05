import { Markup, type Telegraf } from 'telegraf'

export function registerStart(bot: Telegraf) {
  bot.start(async (ctx) => {
    await ctx.reply(
      'Привет! Я календарь-бот. Начнём 🙂',
      Markup.inlineKeyboard([
        Markup.button.callback('➕ Создать шаблон', 'tpl:create'),
        Markup.button.callback('📄 Мои шаблоны', 'tpl:list'),
      ]),
    )
  })
}

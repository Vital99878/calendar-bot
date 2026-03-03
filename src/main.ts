// src/main.ts
import 'dotenv/config'
import { Telegraf, Markup } from 'telegraf'
import { z } from 'zod'

const EnvSchema = z.object({
  BOT_TOKEN: z.string().min(1, 'BOT_TOKEN is required'),
})

const env = EnvSchema.parse({
  BOT_TOKEN: process.env.BOT_TOKEN,
})

const bot = new Telegraf(env.BOT_TOKEN)

bot.catch((err, ctx) => {
  console.error('Bot error for update', ctx.update.update_id, err)
})

bot.start(async (ctx) => {
  await ctx.reply(
    'Привет! Я календарь-бот. Могу генерировать .ics и работать с шаблонами 🙂',
    Markup.inlineKeyboard([Markup.button.callback('➕ Создать шаблон', 'tpl:create')]),
  )
})

bot.command('ping', async (ctx) => {
  await ctx.reply('pong')
})

bot.action('tpl:create', async (ctx) => {
  // важно: на callback-query лучше ответить, чтобы у пользователя не крутился "часик"
  await ctx.answerCbQuery()
  await ctx.reply('Ок! Введи название шаблона одним сообщением.')
})

// пока просто эхо-логика: ловим текст, который не команда
bot.on('text', async (ctx) => {
  const text = ctx.message.text.trim()

  if (text.startsWith('/')) return // команды не трогаем

  await ctx.reply(`Принял: "${text}". Дальше добавим сохранение в БД и шаги мастера.`)
})

async function start() {
  console.log('Starting bot (polling)...')
  await bot.launch()
  console.log('Bot is running ✅')
}

// graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

start().catch((e) => {
  console.error('Failed to start bot', e)
  process.exit(1)
})

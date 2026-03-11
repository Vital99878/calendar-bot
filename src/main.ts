import 'dotenv/config'
import { Telegraf } from 'telegraf'
import { z } from 'zod'
import { registerStart } from './bot/handlers/start.js'
import { registerTemplates } from './bot/handlers/templates.js'
import { registerIcsCreate } from './bot/handlers/icsCreate.js'

const EnvSchema = z.object({
  BOT_TOKEN: z.string().min(1),
})

const env = EnvSchema.parse({ BOT_TOKEN: process.env.BOT_TOKEN })

const bot = new Telegraf(env.BOT_TOKEN)

bot.catch((err, ctx) => {
  console.error('Bot error for update', ctx.update.update_id, err)
})

registerStart(bot)
registerIcsCreate(bot)
registerTemplates(bot)

async function start() {
  await bot.launch()
  const me = await bot.telegram.getMe()
  console.log(`Bot started as @${me.username} ✅`)
}

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

start().catch((e) => {
  console.error('Failed to start bot', e)
  process.exit(1)
})

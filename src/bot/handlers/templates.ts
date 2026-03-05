import type { Telegraf } from 'telegraf'
import { beginCreateTemplate, handleCreateTemplateText } from '../../flows/createTemplateFlow.js'
import { listTemplates } from '../../flows/listTemplatesFlow.js'

export function registerTemplates(bot: Telegraf) {
  bot.action('tpl:create', async (ctx) => {
    await ctx.answerCbQuery()
    const userId = ctx.from?.id
    if (!userId) return

    const res = beginCreateTemplate(userId)
    await ctx.reply(res.text)
  })

  bot.action('tpl:list', async (ctx) => {
    await ctx.answerCbQuery()
    const userId = ctx.from?.id
    if (!userId) return

    const res = await listTemplates(userId)
    await ctx.reply(res.text)
  })

  bot.on('text', async (ctx) => {
    const userId = ctx.from?.id
    if (!userId) return

    const text = ctx.message.text
    if (text.startsWith('/')) return

    const res = await handleCreateTemplateText(userId, text)
    if (!res) return // не наш flow

    ctx.reply(res.text)
  })
}

import { type Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import {
  beginCreateEvent,
  cancelCreateEvent,
  confirmCreateEvent,
  handleCreateEventText,
  skipDescriptionEvent,
} from '../../flows/createEventFlow.js'
import { ICS } from '../ui/callbackData.js'
import { applyResult } from '../lib/applyResult.js'

export function registerIcsCreate(bot: Telegraf) {
  bot.action(ICS.CREATE, async (ctx) => {
    await ctx.answerCbQuery()
    const userId = ctx.from?.id
    if (!userId) return

    const res = beginCreateEvent(userId)
    await applyResult(ctx, res)
  })

  bot.action(ICS.CANCEL, async (ctx) => {
    await ctx.answerCbQuery()
    const userId = ctx.from?.id
    if (!userId) return

    const res = cancelCreateEvent(userId)
    await applyResult(ctx, res)
  })

  bot.action(ICS.CONFIRM, async (ctx) => {
    await ctx.answerCbQuery()
    const userId = ctx.from?.id
    if (!userId) return

    const res = confirmCreateEvent(userId)
    await applyResult(ctx, res)
  })

  bot.action(ICS.SKIP, async (ctx) => {
    await ctx.answerCbQuery()
    const userId = ctx.from?.id
    if (!userId) return

    const res = skipDescriptionEvent(userId)
    await applyResult(ctx, res)
  })

  bot.on(message('text'), async (ctx) => {
    const userId = ctx.from?.id
    if (!userId) return

    const text = ctx.message.text.trim()
    if (text.startsWith('/')) return

    const res = handleCreateEventText(userId, text)
    await applyResult(ctx, res)
  })
}

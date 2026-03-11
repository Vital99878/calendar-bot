import { type Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import {
  beginCreateEvent,
  cancelCreateEvent,
  confirmCreateEvent,
  continueCreateEvent,
  skipDescriptionEvent,
} from '../../flows/createEventFlow/createEventFlow.js'
import { ICS } from '../ui/callbackData.js'
import { applyOutcome } from '../lib/applyOutcome.js'

export function registerIcsCreate(bot: Telegraf) {
  bot.action(ICS.CREATE, async (ctx) => {
    await ctx.answerCbQuery()
    const userId = ctx.from?.id
    if (!userId) return

    const res = beginCreateEvent(userId)
    await applyOutcome(ctx, res)
  })

  bot.action(ICS.CANCEL, async (ctx) => {
    await ctx.answerCbQuery()
    const userId = ctx.from?.id
    if (!userId) return

    const res = cancelCreateEvent(userId)
    await applyOutcome(ctx, res)
  })

  bot.action(ICS.CONFIRM, async (ctx) => {
    await ctx.answerCbQuery()
    const userId = ctx.from?.id
    if (!userId) return

    const res = confirmCreateEvent(userId)
    await applyOutcome(ctx, res)
  })

  bot.action(ICS.SKIP, async (ctx) => {
    await ctx.answerCbQuery()
    const userId = ctx.from?.id
    if (!userId) return

    const res = skipDescriptionEvent(userId)
    await applyOutcome(ctx, res)
  })

  bot.on(message('text'), async (ctx) => {
    const userId = ctx.from?.id
    if (!userId) return

    const text = ctx.message.text.trim()
    if (text.startsWith('/')) return

    const outcome = continueCreateEvent(userId, text)
    await applyOutcome(ctx, outcome)
  })
}

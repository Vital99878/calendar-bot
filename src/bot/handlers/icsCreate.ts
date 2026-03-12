import { type Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import {
  beginCreateEvent,
  cancelCreateEvent,
  confirmCreateEvent,
  continueCreateEvent,
  remindEvent,
  skipDescriptionEvent,
} from '../../flows/createEventFlow/createEventFlow.js'
import { ICS } from '../ui/callbackData.js'
import { applyOutcome } from '../lib/applyOutcome.js'
import { buildDateExamplesHtml } from '../ui/messages.js'

const reminders = [null, 5, 10, 15, 30, 60, 1440]

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

  bot.action(ICS.SHOW_START_EXAMPLE, async (ctx) => {
    await ctx.answerCbQuery()
    await ctx.reply(buildDateExamplesHtml(new Date()), { parse_mode: 'HTML' })
  })

  reminders.forEach((reminder) => {
    if (reminder === null) {
      bot.action(ICS.REMIND_NONE, async (ctx) => {
        await ctx.answerCbQuery()
        const userId = ctx.from?.id
        if (!userId) return
        const res = remindEvent(userId, reminder)
        await applyOutcome(ctx, res)
      })
    } else {
      bot.action(ICS.REMIND(reminder), async (ctx) => {
        await ctx.answerCbQuery()
        const userId = ctx.from?.id
        if (!userId) return
        const res = remindEvent(userId, reminder)
        await applyOutcome(ctx, res)
      })
    }
  })

  bot.action(ICS.REMIND_NONE, async (ctx) => {
    await ctx.answerCbQuery()
    const userId = ctx.from?.id
    if (!userId) return
    const res = remindEvent(userId, null)
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

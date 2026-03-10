import { Context, Markup, type Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import {
  beginCreateEvent,
  cancelCreateEvent,
  confirmCreateEvent,
  type FlowResult,
  handleCreateEventText,
} from '../../flows/createEventFlow.js'
import { ICS } from '../ui/callbackData.js'

type ReplyExtra = Parameters<Context['reply']>[1]

export function registerEvents(bot: Telegraf) {
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

  bot.on(message('text'), async (ctx) => {
    const userId = ctx.from?.id
    if (!userId) return

    const text = ctx.message.text.trim()
    if (text.startsWith('/')) return

    const res = handleCreateEventText(userId, text)
    await applyResult(ctx, res)
  })
}

async function applyResult(ctx: Context, res: FlowResult) {
  if (res.kind === 'noop') return

  if (res.kind === 'reply') {
    const extra: ReplyExtra = { parse_mode: 'HTML' }

    if (res.keyboard === 'confirm') {
      Object.assign(extra, confirmKeyboard())
    } else if (res.keyboard === 'wizard') {
      Object.assign(extra, wizardKeyboard())
    }

    await ctx.reply(res.text, extra)
    return
  }

  if (res.kind === 'sendIcs') {
    await ctx.reply(res.text)
    await ctx.replyWithDocument({ source: res.content, filename: res.filename })
  }
}

function wizardKeyboard() {
  return Markup.inlineKeyboard([Markup.button.callback('✖️ Отмена', ICS.CANCEL)])
}

function confirmKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('✅ Подтвердить', ICS.CONFIRM)],
    [Markup.button.callback('✖️ Отмена', ICS.CANCEL)],
  ])
}

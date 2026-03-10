import { Context, Markup, type Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import {
  beginCreateEvent,
  cancelCreateEvent,
  confirmCreateEvent,
  type FlowResult,
  handleCreateEventText,
} from '../../flows/createEventFlow.js'

const ACTION_CREATE = 'ev:create'
const ACTION_CANCEL = 'ev:cancel'
const ACTION_CONFIRM = 'ev:confirm'

type ReplyExtra = Parameters<Context['reply']>[1]

export function registerEvents(bot: Telegraf) {
  bot.action(ACTION_CREATE, async (ctx) => {
    await ctx.answerCbQuery()
    const userId = ctx.from?.id
    if (!userId) return

    const res = beginCreateEvent(userId)
    await applyResult(ctx, res)
  })

  bot.action(ACTION_CANCEL, async (ctx) => {
    await ctx.answerCbQuery()
    const userId = ctx.from?.id
    if (!userId) return

    const res = cancelCreateEvent(userId)
    await applyResult(ctx, res)
  })

  bot.action(ACTION_CONFIRM, async (ctx) => {
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
  return Markup.inlineKeyboard([Markup.button.callback('✖️ Отмена', ACTION_CANCEL)])
}

function confirmKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('✅ Подтвердить', ACTION_CONFIRM)],
    [Markup.button.callback('✖️ Отмена', ACTION_CANCEL)],
  ])
}

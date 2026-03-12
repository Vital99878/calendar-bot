import { Context } from 'telegraf'
import {
  confirmKeyboard,
  dateAndTimeStartExampleKeyboard,
  descriptionKeyboard,
  wizardKeyboard,
} from '../ui/keyboards.ts/index.js'
import type { FlowOutcome } from '../../flows/types.js'

type ReplyExtra = Parameters<Context['reply']>[1]

export async function applyOutcome(ctx: Context, res: FlowOutcome) {
  if (res.kind === 'noop') return

  if (res.kind === 'reply') {
    const extra: ReplyExtra = { parse_mode: 'HTML' }

    if (res.keyboard === 'confirm') {
      Object.assign(extra, confirmKeyboard())
    } else if (res.keyboard === 'wizard') {
      Object.assign(extra, wizardKeyboard())
    } else if (res.keyboard === 'description') {
      Object.assign(extra, descriptionKeyboard())
    } else if (res.keyboard === 'start') {
      Object.assign(extra, dateAndTimeStartExampleKeyboard())
    }

    await ctx.reply(res.text, extra)
    return
  }

  if (res.kind === 'sendIcs') {
    await ctx.reply(res.text)
    await ctx.replyWithDocument({ source: res.content, filename: res.filename })
  }
}

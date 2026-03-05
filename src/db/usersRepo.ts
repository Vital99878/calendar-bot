import { prisma } from './prisma.js'

export async function ensureUser(tgUserId: string) {
  return prisma.user.upsert({
    where: { tgUserId },
    update: {},
    create: { tgUserId },
  })
}

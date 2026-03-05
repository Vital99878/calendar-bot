import { prisma } from './prisma.js'

export async function createTemplate(input: { userId: string; title: string }) {
  return prisma.template.create({ data: input })
}

export async function listTemplatesByUser(userId: string, take = 10) {
  return prisma.template.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take,
  })
}

import { z } from 'zod'

export const TitleSchema = z
  .string()
  .trim()
  .min(1, 'Название не должно быть пустым')
  .max(80, 'Макс 80 символов')

export const DescriptionSchema = z
  .string()
  .trim()
  .min(3, 'Описание должно быть не менее 3 символов')
  .max(300, 'Макс 300 символов')

export const DurationSchema = z.coerce
  .number()
  .int()
  .min(1, 'Минимум 1 мин')
  .max(24 * 60, 'Макс 1440 мин')

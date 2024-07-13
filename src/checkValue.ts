import type { LoggerType } from './constants.js'
import { configs } from './constants.js'

export function checkValue(value: string): string | undefined {
  if (!value.trim().length)
    return 'Value cannot be empty'

  if (/[\s:,]/.test(value))
    return 'Value cannot include spaces, colons, and commas'

  if ((/\d/.test(value) && value.length > 1) || (!/\d/.test(value) && value !== '*' && !configs.map(({ type }) => type).includes(value as LoggerType)))
    return 'Value can only be either a type, a level, or a wildcard'
}

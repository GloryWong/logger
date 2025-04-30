import type { LoggerLevel } from './constants.js'
import debug from 'debug'
import { checkNames } from './checkNames.js'
import { loggerLevelTypes } from './constants.js'

export function enable(names: string) {
  const cn = checkNames(names)
  if (cn) {
    console.error('[logger]: Failed to enable logger with names %o. Reason: %s', names.split(','), cn)
    return false
  }

  const nameArr = names.split(',').map(v => v.trim())
  const _names = nameArr.reduce<string[]>((pre, cur) => {
    const [namespace, value] = cur.split(':')

    // level
    if (/^[1-4]$/.test(value)) {
      const names = loggerLevelTypes[value as LoggerLevel].map(type => `${namespace}:${type}`).join(',')
      return pre.concat(names)
    }
    else {
      return pre.concat(cur)
    }
  }, []).join(',')

  debug.enable(_names)
  return true
}

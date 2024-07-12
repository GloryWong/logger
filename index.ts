/* eslint-disable no-console */
import { isNode } from 'detect-node-es'
import debug from 'debug'

export type LoggerType = 'debug' | 'info' | 'warn' | 'error'

interface LoggerConfig {
  type: LoggerType
  consoleMethod: Console['log']
  color: string
  /**
   * ANSI color code
   */
  colorCode: number
}

const configs: Readonly<LoggerConfig>[] = [
  {
    type: 'debug',
    consoleMethod: console.debug,
    color: 'gray',
    colorCode: 7,
  },
  {
    type: 'info',
    consoleMethod: console.info,
    color: '#1E90FF',
    colorCode: 27,
  },
  {
    type: 'warn',
    consoleMethod: console.warn,
    color: '#FFA500',
    colorCode: 214,
  },
  {
    type: 'error',
    consoleMethod: console.error,
    color: '#DC143C',
    colorCode: 160,
  },
]

function createDebugger(
  namespace: string,
  { type, consoleMethod, color, colorCode }: LoggerConfig,
) {
  const logger = debug(`${namespace}:${type}`)

  logger.log = consoleMethod.bind(console)
  logger.color = isNode ? String(colorCode) : color
  return logger
}

type LoggerMethod = (formatter: any, ...args: any[]) => void

function createLoggerMethods(namespace: string) {
  return configs.map<[LoggerType, LoggerMethod]>(config =>
    [config.type, createDebugger(namespace, config)],
  )
}

type _Logger = Record<LoggerType, LoggerMethod>
export interface Logger extends _Logger {
  (title: string): _Logger
}

// Utils

function checkNamespace(namespace: string): string | undefined {
  if (!namespace.trim().length)
    return 'Namespace cannot be empty'
  if (/[\s:,]/.test(namespace))
    return 'Namespace cannot include spaces, colons, and commas'
}

function checkValue(value: string): string | undefined {
  if (!value.trim().length)
    return 'Value cannot be empty'

  if (/[\s:,]/.test(value))
    return 'Value cannot include spaces, colons, and commas'

  if (/\d/.test(value) && value.length > 1 || !/\d/.test(value) && value !== '*' && !configs.map(({ type }) => type).includes(value as LoggerType))
    return 'Value can only be either a type, a level, or a wildcard'
}

function checkName(name: string): string | undefined {
  if (!/^[^:]+:[^:]+$/.test(name))
    return `Invalid name '${name}'. Name should be the format '<namespace>:<value>'`

  const [namespace, value] = name.split(':')

  const cn = checkNamespace(namespace)
  if (cn)
    return cn

  const cv = checkValue(value)
  if (cv)
    return cv
}

function checkNames(names: string) {
  const nameArr = names.split(',')
  for (let index = 0; index < nameArr.length; index++) {
    const name = nameArr[index]
    const cn = checkName(name.trim())
    if (cn)
      return cn
  }
}

export interface CreateLoggerOptions {
  enabledTypes?: string
  enabledLevel?: number
}

function createLogger(namespace: string) {
  const cn = checkNamespace(namespace)
  if (cn)
    throw new Error(`Failed to create logger: invalid namespace '${namespace}'. Reason: ${cn}`)

  const loggerMethods = createLoggerMethods(namespace)
  const _logger = Object.fromEntries(loggerMethods) as _Logger

  const logger = (title: string) =>
    Object.fromEntries(loggerMethods.map<[LoggerType, LoggerMethod]>(([type, method]) => [type, (formatter: any, ...args: any[]) => method(`[${title}] ${formatter}`, ...args)])) as _Logger

  Object.assign(logger, _logger)

  return logger as Logger
}

// Level definition
export type LoggerLevel = '1' | '2' | '3' | '4'
export type LoggerLevelTypes = Record<LoggerLevel, LoggerType[]>
export const loggerLevelTypes: LoggerLevelTypes = {
  1: ['error'],
  2: ['error', 'warn'],
  3: ['error', 'warn', 'info'],
  4: ['error', 'warn', 'info', 'debug'],
}

// Enable and disable
function enable(names: string) {
  const cn = checkNames(names)
  if (cn) {
    console.error('[logger]: Failed to enable logger with names %o. Reason: %s', names.split(','), cn)
    return false
  }

  const nameArr = names.split(',')
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

function disable() {
  return debug.disable()
}

function isEnabled(name: string) {
  return debug.enabled(name)
}

if (isNode) {
  const names = (await import('node:process')).env.LOGGER
  if (names)
    enable(names)
}
else {
  if (window.localStorage.logger)
    enable(window.localStorage.logger)
}

export {
  createLogger,
  enable as enableLogger,
  disable as disableLogger,
  isEnabled as isLoggerEnabled,
}

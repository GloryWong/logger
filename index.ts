/* eslint-disable no-console */
import { isNode } from 'detect-node-es'
import debug from 'debug'
import type { Simplify } from 'type-fest'

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

type _Logger = Simplify<Record<LoggerType, LoggerMethod>>
export interface Logger extends _Logger {
  (title: string): _Logger
}

function isValidNamespace(namespace: string) {
  if (!namespace.length)
    return false
  return !(/[\s:,]/.test(namespace))
}

function isValidName(name: string) {
  const [namespace, value] = name.split(':')
  if (!namespace || !value)
    return false
  if (!isValidNamespace(namespace))
    return false
  return true
}

function createLogger(namespace: string) {
  const _namespace = namespace.trim()
  if (!isValidNamespace(_namespace))
    throw new Error(`Failed to create logger: invalid namespace '${_namespace}'`)

  const loggerMethods = createLoggerMethods(_namespace)
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

type NoSpecialChars<T extends string> =
  T extends `${infer _Start},${infer _End}` ? never :
    T extends `${infer _Start} ${infer _End}` ? never :
      T extends `${infer _Start}:${infer _End}` ? never :
        T

type NameType<T extends string> = `${NoSpecialChars<T>}:${LoggerType}`
type NameTypeMulti<T extends string> = `${NameType<T>},${NameType<T>}` | `${NameType<T>},${NameType<T>},${NameType<T>}` | `${NameType<T>},${NameType<T>},${NameType<T>},${NameType<T>}`
type NameLevel<T extends string> = `${NoSpecialChars<T>}:${LoggerLevel}`
export type Name<T extends string> = NameType<T> | NameTypeMulti<T> | `${string}:*` | NameLevel<T>

function enable<T extends string>(name: Name<T>) {
  const _name = name.trim()
  if (!isValidName(_name)) {
    console.error('![logger]: Failed to enable logger. Invalid name `%s`.', _name)
    return
  }

  const [namespace, value] = _name.split(':')

  // level
  if (/^[1-4]$/.test(value)) {
    const names = loggerLevelTypes[value as LoggerLevel].map(type => `${namespace}:${type}`).join(',')

    debug.enable(names)
    return
  }

  return debug.enable(name)
}

function disable() {
  return debug.disable()
}

function isEnabled(name: string) {
  return debug.enabled(name)
}

if (isNode) {
  const name = (await import('node:process')).env.LOGGER
  if (name)
    enable(name as Name<string>)
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

/* eslint-disable no-console */
import { isNode } from 'detect-node-es'
import debug from 'debug'
import type { Simplify } from 'type-fest'

type LoggerLevel = 'debug' | 'info' | 'warn' | 'error'

interface LoggerConfig {
  level: LoggerLevel
  consoleMethod: Console['log']
  color: string
  /**
   * ANSI color code
   */
  colorCode: number
}

const configs: LoggerConfig[] = [
  {
    level: 'debug',
    consoleMethod: console.debug,
    color: 'gray',
    colorCode: 7,
  },
  {
    level: 'info',
    consoleMethod: console.info,
    color: '#1E90FF',
    colorCode: 27,
  },
  {
    level: 'warn',
    consoleMethod: console.warn,
    color: '#FFA500',
    colorCode: 214,
  },
  {
    level: 'error',
    consoleMethod: console.error,
    color: '#DC143C',
    colorCode: 160,
  },
]

function createDebugger(
  name: string,
  { level, consoleMethod, color, colorCode }: LoggerConfig,
) {
  const logger = debug(`${name}:${level}`)
  logger.log = consoleMethod.bind(console)
  logger.color = isNode ? String(colorCode) : color
  return logger
}

type LoggerMethod = (formatter: any, ...args: any[]) => void

function createLoggerMethods(name: string) {
  return configs.map<[LoggerLevel, LoggerMethod]>(config =>
    [config.level, createDebugger(name, config)],
  )
}

type _Logger = Simplify<Record<LoggerLevel, LoggerMethod>>
interface Logger extends _Logger {
  (title: string): _Logger
}

function createLogger(name: string) {
  const loggerMethods = createLoggerMethods(name)
  const _logger = Object.fromEntries(loggerMethods) as _Logger

  const logger = (title: string) =>
    Object.fromEntries(loggerMethods.map<[LoggerLevel, LoggerMethod]>(([level, method]) => [level, (formatter: any, ...args: any[]) => method(`[${title}] ${formatter}`, ...args)])) as _Logger

  Object.assign(logger, _logger)

  return logger as Logger
}

function enable(namespace: string) {
  return debug.enable(namespace)
}

function disable() {
  return debug.disable()
}

function enableNamespace(namespace?: string) {
  if (namespace) {
    enable(namespace)
  }
}

if (isNode) {
  enableNamespace((await import('node:process')).env.LOGGER)
}
else {
  enableNamespace(window.localStorage.logger)
}

export { createLogger, enable, disable }

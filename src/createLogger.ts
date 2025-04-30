import type { LoggerConfig, LoggerType } from './constants.js'
import debug from 'debug'
import { isNode } from 'detect-node-es'
import { checkNamespace } from './checkNamespace.js'
import { configs } from './constants.js'

function createDebugger(
  namespace: string,
  { type, consoleMethod, color, colorCode }: LoggerConfig,
) {
  const logger = debug(`${namespace}:${type}`)

  logger.log = consoleMethod.bind(console)
  logger.color = isNode ? String(colorCode) : color
  return logger
}

export type LoggerMethod = (formatter: any, ...args: any[]) => void

function createLoggerMethods(namespace: string) {
  return configs.map<[LoggerType, LoggerMethod]>(config =>
    [config.type, createDebugger(namespace, config)],
  )
}

type _Logger = Record<LoggerType, LoggerMethod>
export interface Logger extends _Logger {
  (title: string): _Logger
}

export interface CreateLoggerOptions {
  enabledTypes?: string
  enabledLevel?: number
}

export function createLogger(namespace: string) {
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

/* eslint-disable no-console */

export type LoggerType = 'debug' | 'info' | 'warn' | 'error'

export interface LoggerConfig {
  type: LoggerType
  consoleMethod: Console['log']
  color: string
  /**
   * ANSI color code
   */
  colorCode: number
}

export const configs: Readonly<LoggerConfig>[] = [
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

export type LoggerLevel = '1' | '2' | '3' | '4'
export type LoggerLevelTypes = Record<LoggerLevel, LoggerType[]>

export const loggerLevelTypes: LoggerLevelTypes = {
  1: ['error'],
  2: ['error', 'warn'],
  3: ['error', 'warn', 'info'],
  4: ['error', 'warn', 'info', 'debug'],
}

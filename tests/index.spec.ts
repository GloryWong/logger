import { afterEach, describe, expect, it, vi } from 'vitest'
import { createLogger, disableLogger, enableLogger, isLoggerEnabled } from '../src/index'
import { loggerLevelTypes } from '../src/constants'

const { debugSpy, infoSpy, warnSpy, errorSpy } = vi.hoisted(() => ({
  debugSpy: vi.spyOn(globalThis.console, 'debug'),
  infoSpy: vi.spyOn(globalThis.console, 'info'),
  warnSpy: vi.spyOn(globalThis.console, 'warn'),
  errorSpy: vi.spyOn(globalThis.console, 'error'),
}))

afterEach(() => {
  vi.resetAllMocks()
  disableLogger()
})

describe('create logger', () => {
  it.each([[''], [' '], ['test test'], ['test:test'], ['test,test']])('should throw error when create logger with invalid namespace `%s`', async (namespace) => {
    expect(() => createLogger(namespace)).toThrowError('invalid namespace')
  })
})

describe('enable logger', () => {
  it.each([[''], [':'], ['test'], ['test:'], [':test'], ['test:test:test'], ['test:12'], ['test:1test'], ['test:test,1']])('should print logger error when enable logger with invalid name `%s`', (name) => {
    enableLogger(name)
    expect(errorSpy).toHaveBeenCalled()
  })

  it.each(Object.entries(loggerLevelTypes))('should enable types with respective level %s', (level, types) => {
    enableLogger(`foo:${level}`)
    expect(types.every(type => isLoggerEnabled(`foo:${type}`))).toBeTruthy()
  })
})

describe('enable multiple logger types', () => {
  it('should enable multiple logger types correctly', () => {
    enableLogger('foo:debug, foo:3, -foo:info')
    expect(isLoggerEnabled('foo:debug')).toBeTruthy()
    expect(isLoggerEnabled('foo:error')).toBeTruthy()
    expect(isLoggerEnabled('foo:warn')).toBeTruthy()
    expect(isLoggerEnabled('foo:info')).toBeFalsy()
  })
})

describe('log correctly', () => {
  it('should output basic log', () => {
    const logger = createLogger('foo')
    enableLogger('foo:*')
    logger.debug('debug log %s.', 'bar')
    logger.info('info log %s.', 'bar')
    logger.warn('warn log %s.', 'bar')
    logger.error('error log %s.', 'bar')

    expect(debugSpy).toHaveBeenCalledTimes(1)
    expect(infoSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(errorSpy).toHaveBeenCalledTimes(1)
  })

  it('should output title scoped log', () => {
    const logger = createLogger('foo')
    enableLogger('foo:*')
    const log = logger('title')
    log.debug('debug log %s.', 'bar')
    log.info('info log %s.', 'bar')
    log.warn('warn log %s.', 'bar')
    log.error('error log %s.', 'bar')

    expect(debugSpy).toHaveBeenCalledTimes(1)
    expect(infoSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(errorSpy).toHaveBeenCalledTimes(1)
  })
})

import { createLogger } from './createLogger.js'
import { disable } from './disable.js'
import { enable } from './enable.js'
import { getClientNameSetting } from './getClientNameSetting.js'
import { isEnabled } from './isEnabled.js'

// Use client name setting
getClientNameSetting().then((name) => {
  if (name)
    enable(name)
})

export { LoggerLevel, LoggerLevelTypes, LoggerType } from './constants.js'
export { CreateLoggerOptions, Logger, LoggerMethod } from './createLogger.js'

export {
  createLogger,
  disable as disableLogger,
  enable as enableLogger,
  isEnabled as isLoggerEnabled,
}

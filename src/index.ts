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
export { Logger, LoggerMethod, CreateLoggerOptions } from './createLogger.js'

export {
  createLogger,
  enable as enableLogger,
  disable as disableLogger,
  isEnabled as isLoggerEnabled,
}

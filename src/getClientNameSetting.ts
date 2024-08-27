import { isNode } from 'detect-node-es'

export async function getClientNameSetting() {
  if (isNode)
    return process.env.LOGGER

  return window.localStorage.logger as string | undefined
}

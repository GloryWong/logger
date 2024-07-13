import debug from 'debug'

export function isEnabled(name: string) {
  return debug.enabled(name)
}

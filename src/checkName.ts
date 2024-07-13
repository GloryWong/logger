import { checkNamespace } from './checkNamespace.js'
import { checkValue } from './checkValue.js'

export function checkName(name: string): string | undefined {
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

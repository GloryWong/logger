import { checkName } from './checkName.js'

export function checkNames(names: string) {
  const nameArr = names.split(',')
  for (let index = 0; index < nameArr.length; index++) {
    const name = nameArr[index]
    const cn = checkName(name.trim())
    if (cn)
      return cn
  }
}

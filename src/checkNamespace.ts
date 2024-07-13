export function checkNamespace(namespace: string): string | undefined {
  if (!namespace.trim().length)
    return 'Namespace cannot be empty'
  if (/[\s:,]/.test(namespace))
    return 'Namespace cannot include spaces, colons, and commas'
}

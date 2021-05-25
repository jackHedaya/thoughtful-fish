export default function pluralize(str: string, num: number) {
  if (num < 0) throw 'Unable to pluralize negative number'
  if (num === 0) return 'zero'

  return str + (num > 1 ? 's' : '')
}

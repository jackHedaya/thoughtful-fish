export default function sorter<T extends Record<string, unknown>>(array: T[], key: string) {
  if (array === undefined) return undefined
  if (key === null) return array

  const outArr = [...array]

  const sortFn = (() => {
    const genericValue = outArr[0][key]

    if (typeof genericValue === 'string') {
      const getDecimalMatch = (str: string) => parseFloat(str.match(/^(\d+)%?$/)?.[1])

      // Capture decimal in string
      if (getDecimalMatch(genericValue))
        return (a, b) => getDecimalMatch(b[key]) - getDecimalMatch(a[key])

      // Last resort sort alphabetically
      return (a, b) => a[key].localeCompare(b[key])
    }

    if (typeof genericValue === 'number') return (a, b) => b[key] - a[key]
  })()

  return outArr.sort(sortFn)
}

export default function sorter<T extends Record<string, unknown>>(array: T[], key: string) {
  if (array === undefined) return undefined
  if (key === null || array.length === 0) return array

  const outArr = [...array]

  const sortFn = (() => {
    const genericValue = outArr[0][key]

    if (typeof genericValue === 'string') {
      if (isPercentString(genericValue))
        // Capture decimal in string
        return (a, b) => {
          const percentA = getPercentMatch(a[key])
          const percentB = getPercentMatch(b[key])

          if (isNaN(percentA)) return 1
          if (isNaN(percentB)) return -1

          return percentB - percentA
        }

      // Last resort sort alphabetically
      return (a, b) => a[key].localeCompare(b[key])
    }

    if (typeof genericValue === 'number') return (a, b) => b[key] - a[key]
  })()

  return outArr.sort(sortFn)
}

const isPercentString = (str: string) => str[str.length - 1] === '%'
const getPercentMatch = (str: string) => parseFloat(str.substring(0, str.length - 1))

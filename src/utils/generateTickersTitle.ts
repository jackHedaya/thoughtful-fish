export default function generateTickersTitle(tickers: string[]) {
  const MAX_SHOWN = 6

  if (tickers.length < 2) return tickers[0]

  const lastElement = tickers[tickers.length - 1]
  const excludingLast = tickers.slice(0, tickers.length - 1).join(', ')

  if (tickers.length < MAX_SHOWN) return `${excludingLast} and ${lastElement}`

  return `${tickers.slice(0, MAX_SHOWN).join(', ')} and ${tickers.length - MAX_SHOWN} more`
}

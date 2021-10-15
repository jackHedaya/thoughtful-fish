export default {
  expression: [
    { label: 'Symbol', key: 'symbol' },
    { label: 'Type', key: 'putCall' },
    { label: 'Strike', key: 'strikePrice' },
    { label: 'Mark', key: 'mark' },
    { label: 'Days to Expiration', key: 'daysToExpiration' },
  ],
  target_price: [
    { label: 'Symbol', key: 'symbol' },
    { label: 'Type', key: 'putCall' },
    { label: 'Strike', key: 'strikePrice' },
    { label: 'Mark', key: 'mark' },
    { label: 'Return On Target', key: 'returnOnTarget' },
    { label: 'Days to Expiration', key: 'daysToExpiration' },
  ],
  volatility: [
    { label: 'Symbol', key: 'symbol' },
    { label: 'Implied Volatility', key: 'impliedVolatility' },
  ],
}

export type HeaderOption = { key: string; label: string }

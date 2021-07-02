export default {
  Expression: [
    { label: 'Symbol', key: 'symbol' },
    { label: 'Type', key: 'putCall' },
    { label: 'Strike', key: 'strikePrice' },
    { label: 'Mark', key: 'mark' },
    { label: 'Days to Expiration', key: 'daysToExpiration' },
  ],
  'Target Price': [
    { label: 'Symbol', key: 'symbol' },
    { label: 'Type', key: 'putCall' },
    { label: 'Strike', key: 'strikePrice' },
    { label: 'Mark', key: 'mark' },
    { label: 'Return On Target', key: 'returnOnTarget' },
    { label: 'Days to Expiration', key: 'daysToExpiration' },
  ],
  Volatility: [
    { label: 'Symbol', key: 'symbol' },
    { label: 'Implied Volatility', key: 'impliedVolatility' },
  ],
}

export type HeaderOption = { key: string; label: string }

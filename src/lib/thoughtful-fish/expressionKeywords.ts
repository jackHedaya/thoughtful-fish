export default function expressionKeywords() {
  return { option: optionKeywords, underlying: underlyingKeywords }
}

const optionKeywords = {
  putCall: "'PUT' | 'CALL'",
  symbol: 'string',
  description: 'string',
  exchangeName: 'string',
  bid: 'number',
  ask: 'number',
  last: 'number',
  mark: 'number',
  bidSize: 'number',
  askSize: 'number',
  lastSize: 'number',
  highPrice: 'number',
  lowPrice: 'number',
  openPrice: 'number',
  closePrice: 'number',
  totalVolume: 'number',
  quoteTimeInLong: 'number',
  tradeTimeInLong: 'number',
  netChange: 'number',
  volatility: 'number',
  delta: 'number',
  gamma: 'number',
  theta: 'number',
  vega: 'number',
  rho: 'number',
  timeValue: 'number',
  openInterest: 'number',
  isInTheMoney: 'boolean',
  theoreticalOptionValue: 'number',
  theoreticalVolatility: 'number',
  isMini: 'boolean',
  isNonStandard: 'boolean',
  optionDeliverablesList: [
    {
      symbol: 'string',
      assetType: 'string',
      deliverableUnits: 'string',
      currencyType: 'string',
    },
  ],
  strikePrice: 'number',
  daysToExpiration: 'number',
  expirationDate: 'string',
  expirationType: 'string',
  multiplier: 'number',
  settlementType: 'string',
  deliverableNote: 'string',
  isIndexOption: 'boolean',
  percentChange: 'number',
  markChange: 'number',
  markPercentChange: 'number',
}

const underlyingKeywords = {
  ask: 'number',
  askSize: 'number',
  bid: 'number',
  bidSize: 'number',
  change: 'number',
  close: 'number',
  delayed: 'boolean',
  description: 'string',
  exchangeName: 'string',
  fiftyTwoWeekHigh: 'number',
  fiftyTwoWeekLow: 'number',
  highPrice: 'number',
  last: 'number',
  lowPrice: 'number',
  mark: 'number',
  markChange: 'number',
  markPercentChange: 'number',
  openPrice: 'number',
  percentChange: 'number',
  quoteTime: 'number',
  symbol: 'string',
  totalVolume: 'number',
  tradeTime: 'number',
}

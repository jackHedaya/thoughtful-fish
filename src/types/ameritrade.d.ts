/*
 *  Watchlist Types
 */

type Watchlist = {
  name: string
  watchlistId: string
  accountId: string
  status: 'UNCHANGED' | 'CREATED' | 'UPDATED' | 'DELETED'
  watchlistItems: WatchlistItem[]
}

type WatchlistItem = {
  sequenceId: number
  quantity: number
  averagePrice: number
  commission: number
  purchasedDate?: string
  instrument: Instrument
  status: 'UNCHANGED' | 'CREATED' | 'UPDATED' | 'DELETED'
}

type Instrument = {
  symbol: string
  description: string
  assetType: 'EQUITY' | 'OPTION' | 'MUTUAL_FUND' | 'FIXED_INCOME' | 'INDEX'
}

/*
 *  Option Chain Types
 */

type OptionChain = {
  symbol: string
  status: string
  underlying: Underlying
  strategy:
    | 'SINGLE'
    | 'ANALYTICAL'
    | 'COVERED'
    | 'VERTICAL'
    | 'CALENDAR'
    | 'STRANGLE'
    | 'STRADDLE'
    | 'BUTTERFLY'
    | 'COND|'
    | 'DIAGONAL'
    | 'COLLAR'
    | 'ROLL'
  interval: number
  isDelayed: boolean
  isIndex: boolean
  daysToExpiration: number
  interestRate: number
  underlyingPrice: number
  volatility: number
  callExpDateMap: ExpDateMap
  putExpDateMap: ExpDateMap
}

type ExpDateMap = { [key: string]: { [key: string]: [Option] } }

type Option = {
  putCall: 'PUT' | 'CALL'
  symbol: string
  description: string
  exchangeName: string
  bid: number
  ask: number
  last: number
  mark: number
  bidSize: number
  askSize: number
  lastSize: number
  highPrice: number
  lowPrice: number
  openPrice: number
  closePrice: number
  totalVolume: number
  quoteTimeInLong: number
  tradeTimeInLong: number
  netChange: number
  volatility: number
  delta: number
  gamma: number
  theta: number
  vega: number
  rho: number
  timeValue: number
  openInterest: number
  isInTheMoney: boolean
  theoreticalOptionValue: number
  theoreticalVolatility: number
  isMini: boolean
  isNonStandard: boolean
  optionDeliverablesList: [
    {
      symbol: string
      assetType: string
      deliverableUnits: string
      currencyType: string
    }
  ]
  strikePrice: number
  daysToExpiration: number
  expirationDate: string
  expirationType: string
  multiplier: number
  settlementType: string
  deliverableNote: string
  isIndexOption: boolean
  percentChange: number
  markChange: number
  markPercentChange: number
}

type Underlying = {
  ask: number
  askSize: number
  bid: number
  bidSize: number
  change: number
  close: number
  delayed: boolean
  description: string
  exchangeName: string
  fiftyTwoWeekHigh: number
  fiftyTwoWeekLow: number
  highPrice: number
  last: number
  lowPrice: number
  mark: number
  markChange: number
  markPercentChange: number
  openPrice: number
  percentChange: number
  quoteTime: number
  symbol: string
  totalVolume: number
  tradeTime: number
}

type ExpirationDate = {
  date: string
}

type OptionDeliverables = {
  symbol: string
  assetType: string
  deliverableUnits: string
  currencyType: string
}

/*
 *  Quote types
 */

type EquityQuote = {
  symbol: string
  description: string
  bidPrice: number
  bidSize: number
  bidId: string
  askPrice: number
  askSize: number
  askId: string
  lastPrice: number
  lastSize: number
  lastId: string
  openPrice: number
  highPrice: number
  lowPrice: number
  closePrice: number
  netChange: number
  totalVolume: number
  quoteTimeInLong: number
  tradeTimeInLong: number
  mark: number
  exchange: string
  exchangeName: string
  marginable: false
  shortable: false
  volatility: number
  digits: number
  '52WkHigh': number
  '52WkLow': number
  peRatio: number
  divAmount: number
  divYield: number
  divDate: string
  securityStatus: string
  regularMarketLastPrice: number
  regularMarketLastSize: number
  regularMarketNetChange: number
  regularMarketTradeTimeInLong: number
}

type OptionQuote = {
  symbol: string
  description: string
  bidPrice: number
  bidSize: number
  askPrice: number
  askSize: number
  lastPrice: number
  lastSize: number
  openPrice: number
  highPrice: number
  lowPrice: number
  closePrice: number
  netChange: number
  totalVolume: number
  quoteTimeInLong: number
  tradeTimeInLong: number
  mark: number
  openInterest: number
  daysToExpiration: number
  volatility: number
  moneyIntrinsicValue: number
  multiplier: number
  strikePrice: number
  contractType: string
  underlying: string
  timeValue: number
  deliverables: string
  delta: number
  gamma: number
  theta: number
  vega: number
  rho: number
  securityStatus: string
  theoreticalOptionValue: number
  underlyingPrice: number
  uvExpirationType: string
  exchange: string
  exchangeName: string
  settlementType: string
}

type IndexQuote = {
  symbol: string
  description: string
  lastPrice: number
  openPrice: number
  highPrice: number
  lowPrice: number
  closePrice: number
  netChange: number
  totalVolume: number
  tradeTimeInLong: number
  exchange: string
  exchangeName: string
  digits: number
  '52WkHigh': number
  '52WkLow': number
  securityStatus: string
}

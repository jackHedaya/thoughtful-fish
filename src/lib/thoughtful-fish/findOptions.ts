import formatPercent from '../../utils/formatPercent'
import ameritrade, { GetOptionChainParams } from '../ameritrade'

import safeEval from './safeEval'

export type PresetParams = GetOptionChainParams & {
  page: number
  limit?: number
}

type FindCommandOptions = PresetParams & {
  onQueryComplete?: OptionListManipulator
  expressions: string | string[]
}

async function findOptions(tickers: string[], options: FindCommandOptions) {
  const {
    type: queryOptionType = 'ALL',
    page = 1,
    limit = 5,
    noCache,
    onQueryComplete = (e) => e,
    accessToken,
    expressions: exp,
    ...params
  } = options

  if (tickers.length < 1) throw 'No tickers given'

  const pagedTickers = limit && page ? tickers.slice(limit * page, limit * (page + 1)) : tickers

  // Combines expressions if given as array
  const expression = typeof exp === 'string' ? exp : exp.join(' && ')

  const foundOptions: OptionExtension[] = []

  const promises = []

  let isFromCache = false

  for (const ticker of pagedTickers) {
    const p = ameritrade.symbol
      .getOptionChain({ symbol: ticker, accessToken, noCache, type: queryOptionType, ...params })
      .then((data) => {
        // This symbol does not have options available
        if (data.status === 'FAILED') return

        if (data._cached) isFromCache = true

        const underlying = data.underlying

        let queried = []

        if (queryOptionType === 'CALL' || queryOptionType === 'ALL')
          queried = queried.concat(
            queryDateMap({
              expDateMap: data.callExpDateMap,
              underlying,
              expression,
            })
          )

        if (queryOptionType === 'PUT' || queryOptionType === 'ALL')
          queried = queried.concat(
            queryDateMap({
              expDateMap: data.putExpDateMap,
              underlying,
              expression,
            })
          )

        foundOptions.push(...onQueryComplete(queried))
      })

    promises.push(p)
  }

  await Promise.all(promises)

  if (foundOptions.length > 0) return { options: foundOptions, meta: { cached: isFromCache } }
  else throw { error: 'No options found', status: 404 }
}

type QueryParams = {
  expDateMap: ExpDateMap
  underlying: Underlying
  expression: string
}

function queryDateMap(query: QueryParams): OptionExtension[] {
  const { underlying, expression } = query
  const { symbol: underlyingSymbol } = underlying

  const out: OptionExtension[] = []

  Object.entries(query.expDateMap).forEach(([, strikes]) => {
    Object.entries(strikes).forEach(([, [option]]) => {
      // Possibly remove an unneeded sandbox load
      if (expression === 'true') {
        out.push({ ...option, underlyingSymbol })
        return
      }

      try {
        if (safeEval(expression, { underlying, option, Math }))
          out.push({ ...option, underlyingSymbol })
      } catch (e) {
        throw { error: `Error in given expression: ${e.message}`, status: 400 }
      }
    })
  })

  return out
}

/*
 *  Presets begin here
 */

type ExpressionPresetOptions = PresetParams & { expressions: string[] }

export function expressionPreset(tickers: string | string[], options: ExpressionPresetOptions) {
  return findOptions(typeof tickers === 'string' ? [tickers] : tickers, options)
}

type TargetPricePresetOptions = PresetParams & {
  daysLeft: number
  targetPrice: number
  includeUnprofitable: boolean
}

export function targetPricePreset(ticker: string | string[], options: TargetPricePresetOptions) {
  const { daysLeft = 0, includeUnprofitable = false, targetPrice } = options

  const tickerStr = typeof ticker === 'string' ? ticker : ticker[0]

  const calcReturnOnTarget = (op: OptionExtension, t: string | number) => {
    const pt = typeof t === 'string' ? parseFloat(t) : t

    let ret: number

    if (op.putCall === 'CALL') ret = ((pt - (op.strikePrice + op.mark)) / op.mark) * 100
    else ret = ((op.strikePrice - op.mark - pt) / op.mark) * 100

    return ret <= -100 ? -100 : ret
  }

  return findOptions([tickerStr], {
    ...options,
    expressions: `option.daysToExpiration >= ${daysLeft}`,
    onQueryComplete: (ops) =>
      ops
        .map((x) => ({
          ...x,

          // Numerical return on target for internal use
          rot: calcReturnOnTarget(x, targetPrice),

          // Formatted return on target
          returnOnTarget: formatPercent(calcReturnOnTarget(x, targetPrice)),
        }))
        .sort((a, b) => {
          // Prevents a mark of 0 causing Infinity to come up as the highest possible return
          if (a.rot === Infinity) return 1
          if (b.rot === Infinity) return -1

          return b.rot - a.rot
        })
        .filter((val) => includeUnprofitable || val.rot > 0)

        // Removes rot key from output as it is only used internally for sorting and filtering
        // Disable eslint for this line because defining variable for exclusion
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(({ rot, ...o }) => o as unknown as OptionExtension),
  })
}

export function volatilityPreset(tickers: string | string[], options: PresetParams) {
  return findOptions(typeof tickers === 'string' ? [tickers] : tickers, {
    ...options,
    strikeCount: 1,
    range: 'ATM',
    expressions: 'true',
  }).then(({ options, meta }) => ({
    meta,
    options: Object.entries(
      options.reduce<{ [key: string]: { iv: number; avgCount: number } }>((acc, option) => {
        // Incremental averaging as seen here https://math.stackexchange.com/a/106720
        const { volatility, underlyingSymbol: symbol } = option

        if (!acc[symbol]) {
          acc[symbol] = {
            iv: option.volatility,
            avgCount: 1,
          }

          return acc
        }

        const { avgCount, iv } = acc[symbol]

        if (isNaN(volatility)) return acc

        acc[symbol].iv += (volatility - iv) / avgCount
        acc[symbol].avgCount++

        return acc
      }, {})
    )
      .sort(([, iv1], [, iv2]) => iv2.iv - iv1.iv)
      .map(([symbol, { iv }]) => ({
        symbol,
        impliedVolatility: isNaN(iv) ? 'N/A' : formatPercent(iv),
      })),
  }))
}

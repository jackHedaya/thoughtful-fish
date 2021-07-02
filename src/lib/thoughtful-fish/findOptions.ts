import moment from 'moment'

import ameritrade from '../ameritrade'

import safeEval from './safeEval'

export type PresetParams = {
  type: 'CALL' | 'PUT' | 'ALL'
  accessToken: string
  page: number
  limit?: number
  noCache?: boolean
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
  } = options

  if (tickers.length < 1) throw 'No tickers given'

  const pagedTickers = limit && page ? tickers.slice(limit * page, limit * (page + 1)) : tickers

  // Combines expressions if given as array
  const expression = typeof exp === 'string' ? exp : exp.join(' && ')
  console.log(expression)
  const foundOptions: Option[] = []

  const promises = []

  let isFromCache = false

  for (const ticker of pagedTickers) {
    const p = ameritrade.symbol
      .getOptionChain({ symbol: ticker, type: options.type, accessToken, noCache })
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

  const out: Option[] = []

  Object.entries(query.expDateMap).forEach(([, strikes]) => {
    Object.entries(strikes).forEach(([, [option]]) => {
      try {
        if (safeEval(expression, { underlying, option, Math })) out.push(option)
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

  const calcReturnOnTarget = (op: Option, t: string | number) => {
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
          returnOnTarget: calcReturnOnTarget(x, targetPrice).toFixed(2) + '%',
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
        .map(({ rot, ...o }) => (o as unknown) as OptionExtension),
  })
}

export function volatilityPreset(tickers: string[], options: PresetParams) {
  return findOptions(tickers, {
    ...options,
    expressions: [
      // Gets only the options within 10% of the underlying price
      `option.strikePrice / underlying.mark < 1.1`,
      `option.strikePrice / underlying.mark > 0.9`,
    ],
    onQueryComplete: (ops) => {
      // Bit of magic to get unique items from property value
      // Gets one option per expirationDate because as a representation of volatility
      return ops
        .filter((e, i) => ops.findIndex((a) => a.expirationDate === e.expirationDate) === i)
        .map((x) => ({
          ...x,
          underlyingSymbol: x.symbol.match(/([A-Z]*)_/)?.[1],
          formattedExpirationDate: moment(x.expirationDate).toLocaleString(),
        }))
    },
  })
}

import safeEval from 'safe-eval'

import ameritrade from '../ameritrade'

export type PresetParams = {
  page: number
  type: 'CALL' | 'PUT' | 'ALL'
  accessToken: string
}

type FindCommandOptions = PresetParams & {
  onQueryComplete?: OptionListManipulator
  expressions: string | string[]
}

async function findOptions(tickers: string[], options: FindCommandOptions) {
  const {
    type: queryOptionType = 'ALL',
    page = 1,
    onQueryComplete = (e) => e,
    accessToken,
    expressions: exp,
  } = options

  if (tickers.length < 1) throw 'No tickers given'

  const pagedTickers = tickers.slice(100 * (page - 1), 100 * page)
  const expression = typeof exp === 'string' ? exp : exp.join(' && ')

  const foundOptions: Option[] = []

  const promises = []

  for (const ticker of pagedTickers) {
    const p = ameritrade.symbol
      .getOptionChain({ symbol: ticker, type: options.type, accessToken })
      .then((res) => {
        const data: OptionChain = res.data

        // This symbol does not have options available
        if (data.status === 'FAILED') return

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

  if (foundOptions.length > 0) return foundOptions
  else throw 'No options found'
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
        if (safeEval(expression, { underlying, option })) out.push(option)
      } catch (e) {
        throw `Error in given expression: ${e.message}`
      }
    })
  })

  return out
}

/*
 *  Presets begin here
 */

type ExpressionPresetOptions = PresetParams & { expressions: string[] }

export function expressionPreset(tickers: string[], options: ExpressionPresetOptions) {
  return findOptions(tickers, options)
}

type TargetPricePresetOptions = PresetParams & {
  daysLeft: number
  targetPrice: number
  includeUnprofitable: boolean
}

export function targetPricePreset(ticker: string | [string], options: TargetPricePresetOptions) {
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
          returnOnTarget: calcReturnOnTarget(x, targetPrice),
          returnOnTargetFormatted: calcReturnOnTarget(x, targetPrice).toFixed(2) + '%',
        }))
        .sort((a, b) => b.returnOnTarget - a.returnOnTarget)
        .filter((val) => includeUnprofitable || val.returnOnTarget > 0),
  })
}

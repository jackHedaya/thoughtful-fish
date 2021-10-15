import {
  expressionPreset,
  targetPricePreset,
  volatilityPreset,
} from '../../lib/thoughtful-fish/findOptions'
import { auth, requiredData, transformData } from '../../middlewares'
import { getSession } from '../../middlewares/auth'

const PRESET_TO_FUNCTION: {
  [preset: string]: (
    tickers: string[] | string,
    options: Record<string, unknown>
  ) => Promise<HackerResult>
} = {
  target_price: targetPricePreset,
  expression: expressionPreset,
  volatility: volatilityPreset,
}

export default async function findOptions(req: NextApiRequest, res: NextApiResponse) {
  try {
    await auth(req, res)
    await requiredData(req, [
      { key: 'preset', type: 'string' },
      {
        key: 'tickers',
        validator: stringOrStringArray,
      },
    ])

    await transformData(req, [
      { key: 'noCache', type: 'boolean' },
      { key: 'page', type: 'number' },
      { key: 'limit', type: 'number' },
    ])

    const { preset, tickers, ...otherData } = req.query

    const presetFn = PRESET_TO_FUNCTION[preset as string]

    if (!presetFn) throw 'Invalid preset'

    if (preset === 'target_price') await requiredData(req, [{ key: 'targetPrice', type: 'number' }])
    else if (preset === 'expression')
      await requiredData(req, [{ key: 'expressions', validator: stringOrStringArray }])
    // Other preset required data goes here

    const accessToken = getSession(req)?.accessToken

    const options = await presetFn(tickers, { ...otherData, accessToken })

    res.json(options)
  } catch (e) {
    const { status = e?.response?.status || e.status, error = e?.response?.statusText || e.error } =
      e

    if (process.env.NODE_ENV === 'development') console.log(e)

    res.status(status || 500).end(error || 'Something went wrong')
  }
}

const stringOrStringArray = (str: string | string[]) =>
  (Array.isArray(str) && str.length > 0) || typeof str === 'string'

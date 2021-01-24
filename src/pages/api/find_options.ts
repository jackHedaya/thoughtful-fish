import { expressionPreset, targetPricePreset } from '../../lib/thoughtful-fish/findOptions'
import { auth, requiredData, transformData } from '../../middlewares'
import getSession from '../../services/getSession'

const PRESET_TO_FUNCTION: {
  [preset: string]: (tickers: string[] | string, ...params: any) => Promise<HackerResult>
} = {
  'Target Price': targetPricePreset,
  Expression: expressionPreset,
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

    await transformData(req, [{ key: 'noCache', type: 'boolean' }])

    const { preset, tickers, ...otherData } = req.query

    const presetFn = PRESET_TO_FUNCTION[preset as string]

    if (!presetFn) throw 'Invalid preset'

    if (preset === 'Target Price') await requiredData(req, [{ key: 'targetPrice', type: 'number' }])
    else if (preset === 'Expression')
      await requiredData(req, [{ key: 'expressions', validator: stringOrStringArray }])

    const accessToken = getSession(req).accessToken

    const options = await presetFn(tickers as string[], { ...otherData, accessToken })

    res.json(options)
  } catch (e) {
    const { status = e?.response?.status, error = e?.response?.statusText } = e

    if (process.env.NODE_ENV === 'development') console.log(e)

    res.status(status || 500).end(error || 'Something went wrong')
  }
}

const stringOrStringArray = (str: any) =>
  (Array.isArray(str) && str.length > 0) || typeof str === 'string'

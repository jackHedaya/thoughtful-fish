import {
  expressionPreset,
  PresetParams,
  targetPricePreset,
} from '../../lib/thoughtful-fish/find_options'
import { auth, requiredData } from '../../middlewares'
import getSession from '../../services/getSession'

const PRESET_TO_FUNCTION: {
  [preset: string]: (tickers: string[] | string, ...params: any) => Promise<Option[]>
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
        validator: (tickers) =>
          (Array.isArray(tickers) && tickers.length > 0) || typeof tickers === 'string',
      },
    ])

    const { preset, tickers, ...otherData } = req.query

    const presetFn = PRESET_TO_FUNCTION[preset as string]

    if (!presetFn) throw 'Invalid preset'

    if (preset === 'Target Price') await requiredData(req, [{ key: 'targetPrice', type: 'number' }])
    else if (preset === 'Expression')
      await requiredData(req, [{ key: 'expressions', validator: (x) => Array.isArray(x) }])

    const accessToken = getSession(req).accessToken

    const options = await presetFn(tickers as string[], { ...otherData, accessToken })

    res.json(options)
  } catch (e) {
    console.log(e)
    const { status = 500, error = 'Something went wrong' } = e
    res.status(status).end(error)
  }
}

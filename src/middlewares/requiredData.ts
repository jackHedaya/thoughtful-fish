import { NextApiRequest } from 'next'
import { MIDDLEWARE_ERROR } from '.'

type Key =
  | string
  | { key: string; type: TypeofValue }
  | { key: string; validator: (value: unknown) => boolean }

type TypeofValue = 'object' | 'boolean' | 'function' | 'number' | 'string' | 'undefined'

export default async (req: NextApiRequest, keys: Key[]) => {
  const data = req.method === 'GET' ? req.query : req.body

  keys.forEach((k) => {
    const validator =
      typeof k === 'string'
        ? (x: unknown) => !!x
        : isKeyType(k)
        ? (x: unknown) =>
            typeof x === k.type || (k.type === 'number' && !isNaN(parseFloat(x as string)))
        : k.validator

    const key = typeof k === 'string' ? k : k.key

    if (!validator(data[key])) {
      if (!!data[key]) throw MIDDLEWARE_ERROR.INVALID_PARAMETER(key)

      throw MIDDLEWARE_ERROR.MISSING_PARAMETER(key)
    }
  })
}

const isKeyType = (x: Record<string, unknown>): x is { key: string; type: TypeofValue } => !!x?.type

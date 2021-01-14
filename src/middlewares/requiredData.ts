import { NextApiRequest } from 'next'
import { MIDDLEWARE_ERROR } from '.'

type Keys =
  | string[]
  | { key: string; type: TypeofValue }[]
  | { key: string; validator: (value: unknown) => boolean }[]

type TypeofValue =
  | 'object'
  | 'boolean'
  | 'function'
  | 'number'
  | 'string'
  | 'undefined'

export default async (req: NextApiRequest, keys: Keys) => {
  // Normalizes key into { key, validator } list
  const normalKeys = isStringArray(keys)
    ? keys.map((key) => ({ key, validator: (x: unknown) => !!x }))
    : isKeyTypeArray(keys)
    ? keys.map(({ key, type }) => ({
        key,
        validator: (x: unknown) => typeof x === type,
      }))
    : keys

  let data = req.method === 'GET' ? req.query : req.body

  normalKeys.forEach(({ key, validator }) => {
    if (!validator(data[key])) throw MIDDLEWARE_ERROR.MISSING_PARAMETER
  })
}

const isStringArray = (x: any): x is string[] => typeof x[0] === 'string'
const isKeyTypeArray = (x: any): x is { key: string; type: TypeofValue }[] =>
  !!x?.type

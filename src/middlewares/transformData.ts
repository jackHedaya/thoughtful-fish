type GenericTransformer = { key: string; transformer: (str: string) => unknown }
type TypeTransformer = { key: string; type: Type }
type Type = 'number' | 'boolean'

const typeToTransformer = {
  number: (s) => parseFloat(s),
  boolean: (s) => (s === 'true' ? true : s === 'false' ? false : null),
}

export default async (req: NextApiRequest, keys: (GenericTransformer | TypeTransformer)[]) => {
  const isGet = req.method === 'GET'
  const data = isGet ? req.query : req.body

  keys.forEach((t) => {
    const transformer = isTypeTransformer(t) ? typeToTransformer[t.type] : t.transformer
    const key = t.key

    if (isGet) req.query[key] = transformer(data[key]) as string | string[]
  })
}

const isTypeTransformer = (x: unknown): x is TypeTransformer => typeof x === 'object' && 'type' in x

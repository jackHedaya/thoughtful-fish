export interface JsonMap {
  [member: string]: string | number | boolean | null | JsonArray | JsonMap
}
export type JsonArray = Array<string | number | boolean | null | JsonArray | JsonMap>
export type Json = JsonMap | JsonArray | string | number | boolean | null

export function encodeJsonToUri(srcjson: Json, parent = '') {
  if (typeof srcjson !== 'object')
    if (typeof console !== 'undefined') {
      console.log('"srcjson" is not a JSON object')
      return null
    }

  const u = encodeURIComponent
  let urljson = ''
  const keys = Object.keys(srcjson)

  for (let i = 0; i < keys.length; i++) {
    const k = parent ? parent + '[' + keys[i] + ']' : keys[i]
    const val = srcjson[keys[i]]

    if (typeof srcjson[keys[i]] !== 'object') {
      const _k = parent ? parent + '[' + u(keys[i]) + ']' : keys[i]

      urljson += _k + '=' + u(val)
    } else {
      urljson += encodeJsonToUri(val, k)
    }
    if (i < keys.length - 1) urljson += '&'
  }

  return urljson
}

export function reparseNextQuery(json: Json) {
  if (typeof json !== 'object' || Array.isArray(json)) return json

  const out: Json = {}

  for (const key in json) {
    const match = /^(.*)\[(.*)\]$/.exec(key)

    if (!match) {
      out[key] = json[key]
      continue
    }

    const actualKey = match[1]
    const subkey = match[2]

    try {
      const _k = parseInt(subkey)

      if (!out[actualKey]) out[actualKey] = []

      out[actualKey][_k] = reparseNextQuery(json[key])
    } catch (e) {
      out[actualKey] = {}
    }

    out[actualKey][subkey] = reparseNextQuery(json[key])
  }

  return out
}

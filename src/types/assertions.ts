import { NextPageContext } from 'next'

export function isNextPageContext(x: any): x is NextPageContext {
  if (!!x.req) return true
  return false
}

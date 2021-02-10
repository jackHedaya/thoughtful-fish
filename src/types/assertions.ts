// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNextPageContext(x: any): x is NextPageContext {
  if (!!x.req) return true
  return false
}

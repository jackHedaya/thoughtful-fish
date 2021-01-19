export { default as auth } from './auth'
export { default as requiredData } from './requiredData'

export const MIDDLEWARE_ERROR = {
  MISSING_PARAMETER: (p: string) => ({ status: 400, error: `Missing parameter '${p}'` }),
  INVALID_PARAMETER: (p: string) => ({ status: 400, error: `Invalid parameter '${p}'` }),
  UNAUTHORIZED: () => ({ status: 401, error: 'Unauthorized' }),
}

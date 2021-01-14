export { default as auth } from './auth'
export { default as requiredData } from './requiredData'

export const MIDDLEWARE_ERROR = {
  MISSING_PARAMETER: { status: 400, error: 'Unauthorized' },
  UNAUTHORIZED: { status: 401, error: 'Missing parameter' },
}

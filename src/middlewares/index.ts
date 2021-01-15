export { default as auth } from './auth'
export { default as requiredData } from './requiredData'

export const MIDDLEWARE_ERROR = {
  MISSING_PARAMETER: { status: 400, error: 'Missing parameter' },
  UNAUTHORIZED: { status: 401, error: 'Unauthorized' },
}

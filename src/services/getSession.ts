import { NextPageContext } from 'next'

import { getAccessToken, getRefreshToken } from '../lib/thoughtful-fish/auth'

export default function getSession(ctx: NextPageContext): Session {
  const accessToken = getAccessToken(ctx)
  const refreshToken = getRefreshToken(ctx)

  if (!accessToken || !refreshToken) return null

  return { accessToken, refreshToken }
}

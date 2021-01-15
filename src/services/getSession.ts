import { NextPageContext } from 'next'

import { getAccessToken, getProfile, getRefreshToken } from '../lib/thoughtful-fish/session'

export default function getSession(ctx: NextPageContext): Session {
  const accessToken = getAccessToken(ctx)
  const refreshToken = getRefreshToken(ctx)
  const profile = getProfile(ctx)

  if (!accessToken || !refreshToken) return null

  return { accessToken, refreshToken, profile }
}

import { NextPageContext } from 'next'
import ameritrade from '../lib/ameritrade'

import { getAccessToken, getRefreshToken } from '../lib/thoughtful-fish/auth'

export default async function getSession(ctx: NextPageContext): Promise<Session> {
  const accessToken = getAccessToken(ctx)
  const refreshToken = getRefreshToken(ctx)

  if (!accessToken || !refreshToken) return null

  const profile: Profile = await ameritrade.account.getProfile({ accessToken }).catch(() => null)

  return { accessToken, refreshToken, profile }
}

import { MIDDLEWARE_ERROR } from '.'
import { isNextPageContext } from '../types/assertions'

import {
  getAccessToken,
  getProfile,
  getRefreshToken,
  writeAccessToken,
  writeProfile,
} from '../lib/thoughtful-fish/session'

import ameritrade from '../lib/ameritrade'

declare module 'http' {
  interface IncomingMessage {
    session?: Session
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const refreshToken = getRefreshToken(req)

  let accessToken = getAccessToken(req)

  let profile = getProfile(req)

  if (refreshToken && !accessToken) {
    try {
      const { accessToken: newAccessToken, expiresIn } = await ameritrade.auth.requestAccessToken({
        refreshToken,
      })

      const newProfile = await ameritrade.account.getProfile({ accessToken: newAccessToken })

      accessToken = newAccessToken
      profile = newProfile

      writeAccessToken({ res, accessToken, expiresIn })
      writeProfile({ res, profile, expiresIn })
    } catch (e) {
      throw MIDDLEWARE_ERROR.UNAUTHORIZED()
    }
  } else if (!refreshToken) {
    throw MIDDLEWARE_ERROR.UNAUTHORIZED()
  }

  req.session = { refreshToken, accessToken, profile }
}

export function authOrPassSession(ctx: NextPageContext) {
  const session = getSession(ctx)

  if (!session) return returnRedirect(ctx)

  return { props: { session } }
}

export function getSession(ctx: ContextOrRequest): Session {
  if (process.env.SKIP_AUTH)
    return {
      accessToken: '',
      refreshToken: '',
      profile: { userId: '', primaryAccountId: '', accounts: [] },
    }

  const accessToken = getAccessToken(ctx)
  const refreshToken = getRefreshToken(ctx)
  const profile = getProfile(ctx)

  if (!accessToken || !refreshToken) return null

  return { accessToken, refreshToken, profile }
}

export function returnRedirect(ctx: NextPageContext) {
  return {
    redirect: {
      permanent: false,
      destination: `/login?route=${ctx.req.url}`,
    },
  }
}

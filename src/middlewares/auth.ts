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

export default async (ctxOrReq: ContextOrRequest, res: NextApiResponse) => {
  const req = isNextPageContext(ctxOrReq) ? ctxOrReq.req : ctxOrReq

  const refreshToken = getRefreshToken(ctxOrReq)

  let accessToken = getAccessToken(ctxOrReq)

  let profile = getProfile(ctxOrReq)

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

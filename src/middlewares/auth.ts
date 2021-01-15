import { MIDDLEWARE_ERROR } from '.'
import { isNextPageContext } from '../types/assertions'

import { getAccessToken, getRefreshToken, writeAccessToken } from '../lib/thoughtful-fish/auth'

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

  if (refreshToken && !accessToken) {
    try {
      const { accessToken: newAccessToken, expiresIn } = await ameritrade.auth.requestAccessToken({
        refreshToken,
      })

      accessToken = newAccessToken

      writeAccessToken({ res, accessToken, expiresIn })
    } catch (_) {
      throw MIDDLEWARE_ERROR.UNAUTHORIZED
    }
  } else if (!refreshToken) {
    throw MIDDLEWARE_ERROR.UNAUTHORIZED
  }

  req.session = { refreshToken, accessToken }
}

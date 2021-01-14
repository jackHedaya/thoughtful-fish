import { NextApiRequest, NextApiResponse } from 'next'

import ameritrade from '../lib/ameritrade'
import {
  getAccessToken,
  getRefreshToken,
  writeAccessToken,
} from '../lib/thoughtful-fish/auth'

declare module 'http' {
  interface IncomingMessage {
    session?: Session
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const refreshToken = getRefreshToken(req)

  let accessToken = getAccessToken(req)

  if (refreshToken && !accessToken) {
    const {
      accessToken: newAccessToken,
      expiresIn,
    } = await ameritrade.auth.requestAccessToken({ refreshToken })

    accessToken = newAccessToken

    writeAccessToken({ res, accessToken, expiresIn })
  }

  req.session = { refreshToken, accessToken }
}

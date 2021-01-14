import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { setCookie } from 'nookies'

import ameritrade from '../../../lib/ameritrade'
import {
  writeAccessToken,
  writeRefreshToken,
} from '../../../lib/thoughtful-fish/auth'

const JWT_SECRET = process.env.JWT_SECRET

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const code = req.query.code

  if (typeof code !== 'string') {
    res.status(401).json('Unauthorized')
    return
  }

  try {
    const {
      accessToken,
      refreshToken,
      expiresIn,
      refreshTokenExpiresIn,
    } = await ameritrade.auth.authenticateViaCode({ code })

    writeAccessToken({ res, accessToken, expiresIn })
    writeRefreshToken({ res, refreshToken, expiresIn: refreshTokenExpiresIn })

    if (typeof req.query.route === 'string') res.redirect(req.query.route)

    res.redirect('/home')
  } catch (e) {
    res.redirect(`/login?error=${e}`)
  }
}

import { NextApiRequest, NextApiResponse } from 'next'

import ameritrade from '../../../lib/ameritrade'
import {
  writeAccessToken,
  writeProfile,
  writeRefreshToken,
} from '../../../lib/thoughtful-fish/session'


export default async function callback(req: NextApiRequest, res: NextApiResponse) {
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

    const profile = await ameritrade.account.getProfile({ accessToken })

    writeAccessToken({ res, accessToken, expiresIn })
    writeRefreshToken({ res, refreshToken, expiresIn: refreshTokenExpiresIn })
    writeProfile({ res, profile, expiresIn })

    if (typeof req.query.route === 'string') res.redirect(req.query.route)

    res.redirect('/home')
  } catch (e) {
    res.redirect(`/login?error=${e}`)
  }
}

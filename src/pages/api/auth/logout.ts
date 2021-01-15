import { NextApiRequest, NextApiResponse } from 'next'
import { destroyCookie } from 'nookies'

export default async function callback(req: NextApiRequest, res: NextApiResponse) {
  destroyCookie({ res }, 'accessToken', { path: '/', httpOnly: true })
  destroyCookie({ res }, 'refreshToken', { path: '/', httpOnly: true })

  res.redirect('/login')
}

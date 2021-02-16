import q from 'querystring'

import { NextApiRequest, NextApiResponse } from 'next'

import ameritrade from '../../../lib/ameritrade'

export default function redirect(req: NextApiRequest, res: NextApiResponse) {
  res.redirect(`${ameritrade.auth.generateLoginLink()}&${q.encode(req.query)}`)
}

import { NextApiResponse } from 'next'
import { auth } from '../../middlewares'
import ameritrade from '../../lib/ameritrade'
import getSession from '../../services/getSession'

export default async function watchlists(req: NextApiRequest, res: NextApiResponse) {
  try {
    await auth(req, res)

    const { accessToken, profile } = getSession(req)

    const accountNumbers = [profile.primaryAccountId, ...profile.accounts.map((x) => x.accountId)]

    let accountToWatchlist: { [num: string]: Watchlist[] } = {}

    const promises = accountNumbers.map((accountNumber) =>
      ameritrade.watchlist
        .getAll({ accessToken, accountNumber })
        .then((watchlists) => (accountToWatchlist[accountNumber] = watchlists))
    )

    await Promise.all(promises)

    res.status(200).json(accountToWatchlist)
  } catch (e) {
    const { status = 500, error = 'Something went wrong' } = e
    res.status(status).end(error)
  }
}
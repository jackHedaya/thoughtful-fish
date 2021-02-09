import { auth } from '../../../middlewares'

export default async function validate(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.SKIP_AUTH) {
    res.status(201).end()
    return
  }

  try {
    await auth(req, res)

    res.status(201).end()
  } catch (e) {
    res.status(401).end()
  }
}

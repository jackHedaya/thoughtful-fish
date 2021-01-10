import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'

const TOKEN_ENDPOINT = 'https://api.tdameritrade.com/v1/oauth2/token'


export default function (req: NextApiRequest, res: NextApiResponse) {
  NextAuth(req, res, {
    providers: [
      {
        id: 'td',
        name: 'TD Ameritrade',
        type: 'oauth',
        version: '2.0',
        accessTokenUrl: TOKEN_ENDPOINT,
        requestTokenUrl: TOKEN_ENDPOINT,
        authorizationUrl: `https://auth.tdameritrade.com/auth?response_type=code`,
        clientId: process.env.CONSUMER_KEY,
        params: {
          grant_type: 'authorization_code',
        },
        profileUrl: 'https://api.tdameritrade.com/v1/userprincipals',
        profile: (p) => {
          return {
            id: p.userId,
            accounts: p.accounts,
          }
        },
      },
    ],
    pages: {
      signIn: '/auth/sign-in'
    },
  })
}

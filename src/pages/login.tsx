import { NextApiResponse, NextPageContext } from 'next'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { Paper } from '@material-ui/core'

const Bubbles = dynamic(() => import('../components/BubbleBackground'), {
  ssr: false,
})

import ameritrade from '../lib/ameritrade'
import getSession from '../services/getSession'
import { getRefreshToken, writeAccessToken } from '../lib/thoughtful-fish/auth'

import s from '../styles/pages/login.module.scss'

export default function Login() {
  const Router = useRouter()
  const didError = !!Router.query.error

  return (
    <div className={s.login}>
      <Bubbles color="#ff6767" />
      <Paper className={s.main}>
        <h2>We're excited to have you here</h2>
        <h3>Sign in with</h3>
        <div
          className={s.button}
          onClick={() => Router.push('/api/auth/redirect')}
        >
          <img src="/ameritrade-logo.png" />
        </div>
        {didError && <div className={s.error}>Something went wrong</div>}
      </Paper>
    </div>
  )
}

export async function getServerSideProps(ctx: NextPageContext) {
  const session = getSession(ctx)
  const route = ctx.query.route || '/home'

  if (session) return { redirect: { destination: route, permanent: false } }

  const refreshToken = getRefreshToken(ctx)

  try {
    const {
      accessToken,
      expiresIn,
    } = await ameritrade.auth.requestAccessToken({ refreshToken })

    writeAccessToken({
      res: ctx.res as NextApiResponse,
      accessToken,
      expiresIn,
    })


    console.log('hey')
    return { redirect: { destination: route, permanent: false } }
  } catch (e) {
    // Don't do anything because the refresh token is invalid and will direct to /login
  }

  return { props: {} }
}

import { NextApiRequest, NextApiResponse, NextPageContext } from 'next'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { Paper } from '@material-ui/core'

const Bubbles = dynamic(() => import('../components/BubbleBackground'), {
  ssr: false,
})

import { auth } from '../middlewares'

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
  try {
    await auth(ctx.req as NextApiRequest, ctx.res as NextApiResponse)
    console.log(ctx.req.session)
    return {
      redirect: {
        permanent: false,
        destination: ctx.query.route || '/home',
      },
    }
  } catch (e) {
    // Don't redirect because auth failed
  }

  return { props: {} }
}

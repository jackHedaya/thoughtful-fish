import { Paper } from '@material-ui/core'
import { NextPageContext } from 'next'
import { providers, signIn } from 'next-auth/client'

import dynamic from 'next/dynamic'

const Bubbles = dynamic(() => import('../components/BubbleBackground'), {
  ssr: false,
})

import s from '../styles/pages/login.module.scss'

type LoginProps = {
  providers: {
    [provider: string]: {
      id: string
      name: string
      type: string
      signinUrl: string
      callbackUrl: string
    }
  }

  didError: boolean
}

export default function Login({ providers, didError }: LoginProps) {
  const tdProvider = providers['td']

  return (
    <div className={s.login}>
      <Bubbles color="#ff6767" />
      <Paper className={s.main}>
        <h2>We're excited to have you here</h2>
        <h3>Sign in with</h3>
        <div
          className={s.button}
          onClick={() => signIn(tdProvider.id)}
          key={tdProvider.name}
        >
          <img src="/ameritrade-logo.png" />
        </div>
        {didError && <div className={s.error}>Something went wrong</div>}
      </Paper>
    </div>
  )
}

export async function getServerSideProps(ctx: NextPageContext) {
  const q = ctx.query

  return {
    props: {
      didError: !!q.error,
      providers: await providers(),
    },
  }
}

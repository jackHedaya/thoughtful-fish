import { Paper } from '@material-ui/core'
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
}

export default function Login({ providers }: LoginProps) {
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
      </Paper>
    </div>
  )
}

export async function getServerSideProps() {
  return {
    props: {
      providers: await providers(),
    },
  }
}

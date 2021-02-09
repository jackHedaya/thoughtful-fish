import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { Paper } from '@material-ui/core'

const Bubbles = dynamic(() => import('../components/BubbleBackground'), {
  ssr: false,
})

import useRequest from '../hooks/useRequest'

import s from '../styles/pages/login.module.scss'
import Loading from '../components/LoadingAnimation'
import usePrettyLoading from '../hooks/usePrettyLoading'

export default function Login() {
  const Router = useRouter()
  const didError = !!Router.query.error

  const redirectRoute = (Router.query.route as string) || '/home'

  const { error, response } = useRequest({ url: '/api/auth/validate' })
  const isPrettyLoading = usePrettyLoading(1000)

  const loading = (!error && !response) || isPrettyLoading

  if (!loading && response?.status === 201) Router.push(redirectRoute)

  return (
    <div className={s.login}>
      <Bubbles color="#ff6767" />
      <Paper className={s.main}>
        {!loading ? (
          <>
            <h2>We're excited to have you here</h2>
            <h3>Sign in with</h3>
            <div className={s.button} onClick={() => Router.push('/api/auth/redirect')}>
              <img src="/ameritrade-logo.png" />
            </div>
            {didError && <div className={s.error}>Something went wrong</div>}
          </>
        ) : (
          <Loading />
        )}
      </Paper>
    </div>
  )
}

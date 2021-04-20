import { Paper } from '@material-ui/core'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const Bubbles = dynamic(() => import('../components/BubbleBackground'), {
  ssr: false,
})

import Loading from '../components/LoadingAnimation'
import usePrettyLoading from '../hooks/usePrettyLoading'
import useRequest from '../hooks/useRequest'
import s from '../styles/pages/login.module.scss'

export default function Login() {
  const Router = useRouter()
  const didError = !!Router.query.error

  const redirectRoute = (Router.query.route as string) || '/home'

  const { error, response } = useRequest({ url: '/api/auth/validate' })

  let forceIsLoading = false // Needed to prevent loading flash (I think)
  const isLoading = usePrettyLoading((!response && !error) || forceIsLoading, 1000)

  if (!isLoading && response?.status === 201) {
    forceIsLoading = true

    Router.push(redirectRoute)
  }

  return (
    <div className={s.login}>
      <Bubbles color="#ff6767" />
      <Paper className={s.main}>
        {!isLoading ? (
          <>
            <h2>We're excited to have you here</h2>
            <h3>Sign in with</h3>
            <div className={s.button} onClick={() => Router.push('/api/auth/redirect')}>
              <img src="/ameritrade-logo.png" width="200px" height="38px" />
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

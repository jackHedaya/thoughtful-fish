import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import type { AppProps } from 'next/app'
import Router, { useRouter } from 'next/router'
import NProgress from 'nprogress'
import { createContext } from 'react'

import Navbar from '../components/Navbar'

import 'nprogress/nprogress.css'
import '../styles/globals.scss'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

export const SessionContext = createContext<Session>(null)

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  const isLoginPage = router.asPath.startsWith('/login')

  const theme = createMuiTheme({
    palette: {
      primary: { main: '#ff6767' },
    },
    typography: {
      button: {
        textTransform: 'none',
      },
    },
    props: {
      MuiButtonBase: {
        disableRipple: true,
      },
      MuiLinearProgress: {
        style: { borderRadius: 5, height: 10 },
      },
    },
  })

  return (
    <div className="app">
      <SessionContext.Provider value={pageProps.session}>
        {!isLoginPage && <Navbar />}
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </SessionContext.Provider>
    </div>
  )
}

export default MyApp

import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import { Provider } from 'next-auth/client'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'

import Navbar from '../components/Navbar'

import '../styles/globals.scss'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isLoginPage = router.asPath === '/login'

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
    },
  })

  return (
    <div className="app">
      {!isLoginPage && <Navbar />}
      <Provider session={pageProps.session}>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </Provider>
    </div>
  )
}

export default MyApp

import Router  from 'next/router'
import type { AppProps } from 'next/app'
import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import NProgress from 'nprogress' //nprogress module

import Navbar from '../components/Navbar'

import '../styles/globals.scss'
import 'nprogress/nprogress.css'

//Binding events.
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp({ Component, pageProps }: AppProps) {
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
      <Navbar />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </div>
  )
}

export default MyApp

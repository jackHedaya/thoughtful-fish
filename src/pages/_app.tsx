import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import type { AppProps } from 'next/app'

import Navbar from '../components/Navbar'

import '../styles/globals.scss'

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

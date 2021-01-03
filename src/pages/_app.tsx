import type { AppProps /*, AppContext */ } from 'next/app'

import Navbar from '../components/Navbar'

import '../styles/globals.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="app">
      <Navbar />
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp

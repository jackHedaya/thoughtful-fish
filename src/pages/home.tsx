import { NextPageContext } from 'next'
import Head from 'next/head'

import { authOrPassSession } from '../middlewares/auth'
import styles from '../styles/pages/home.module.scss'

export default function Home() {
  return (
    <div className="content">
      <Head>
        <title>Thoughtful Fish</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <div>Thoughtful Fish</div>
        </h1>

        <p className={styles.description}>
          Thoughtful Fish is a collection of tools to help manage, find, and profit off of options
        </p>
        <div className={styles.grid}>
          <Card
            to="/option-hacker"
            title="Find Options"
            description="Find options based off of expressions, target prices, or other presets."
          />
        </div>
      </main>
    </div>
  )
}

type CardProps = {
  to: string
  title: string
  description: string
}

function Card(props: CardProps) {
  return (
    <a href={props.to} className={styles.card}>
      <h3>{props.title} &rarr;</h3>
      <p>{props.description}</p>
    </a>
  )
}

export async function getServerSideProps(ctx: NextPageContext) {
  return authOrPassSession(ctx)
}

import { useEffect, useState } from 'react'
import Head from 'next/head'
import q from 'querystring'

import LoadingAnimation from '../../components/LoadingAnimation'

import { useRouter } from 'next/router'
import useRequest from '../../hooks/useRequest'
import { auth } from '../../middlewares'

import s from '../../styles/pages/results.module.scss'

type OptionHackerResultsProps = {
  tickers: string[]
  expressions?: string[]
  preset: string
}

export default function OptionHackerResults(props: OptionHackerResultsProps) {
  const { data: options, error } = useRequest<Partial<OptionExtension[]>, {}>({
    url: '/api/find_options?' + q.stringify(props),
    method: 'GET',
    data: JSON.stringify(props),
  })

  // Used to prevent a loading flash
  const [loaderTimeoutDone, setLoaderTimeoutDone] = useState(false)

  useEffect(() => {
    let x = setTimeout(() => setLoaderTimeoutDone(true), 2000)
    return () => clearTimeout(x)
  })

  const SAMPLE_HEADERS = [
    { label: 'Symbol', key: 'symbol' },
    { label: 'Type', key: 'putCall' },
    { label: 'Strike', key: 'strikePrice' },
    { label: 'Mark', key: 'mark' },
  ]

  const loadingDone = options && loaderTimeoutDone

  const tickers = props.tickers.join(', ')

  return (
    <div className="content">
      <Head>
        <title>Thoughtful Fish | {tickers} Results</title>
      </Head>
      <div className="page-title">Option Hacker</div>
      {loadingDone && !error && <h2 className={s.resultsTitle}>Results for {tickers}</h2>}
      <div className={s.results}>
        {error && loaderTimeoutDone ? (
          <div className={s.errorMessage}>{error.message}</div>
        ) : !loadingDone ? (
          <div className={s.loader}>
            <LoadingAnimation />
          </div>
        ) : (
          <OptionTable headers={SAMPLE_HEADERS} options={options} />
        )}
        {/* <OptionTable headers={SAMPLE_HEADERS} options={SAMPLE_OPTIONS} /> */}
      </div>
    </div>
  )
}

type OptionTableProps = {
  headers: TableHeader[]
  options: Partial<OptionExtension>[]
}
type TableHeader = { label: string; key: string }

function OptionTable(props: OptionTableProps) {
  const { headers, options } = props

  const router = useRouter()

  function chartOption(symbol: string) {
    router.push(`/chart/${symbol}`)
  }

  console.log(options)

  return (
    <table>
      <thead>
        <tr>
          {headers.map(({ label }) => (
            <th key={`Header/${label}`}>{label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {
          /* Header logic: Loop over every option and generate a row.
           * Inside each row, generate table data by taking each given header key and
           * accessing the option value for that key
           */
          options.map((option, i) => (
            <tr key={`Row/${i}`}>
              {headers.map(({ key }) => (
                <td
                  onClick={() => key === 'symbol' && chartOption(option.symbol)}
                  className={key === 'symbol' ? s.symbol : undefined}
                  key={`RowData/${i}/${key}`}
                >
                  {option[key]}
                </td>
              ))}
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

export async function getServerSideProps(ctx: NextPageContext) {
  await auth(ctx.req as NextApiRequest, ctx.res as NextApiResponse)

  // Query will come in encoded JSON form... It will be parsed to this form
  // '{"tickers":["NCLH"],"expressions":[""]': ''
  // This will get the key and decode it to JSON
  let props = {}

  try {
    props = JSON.parse(Object.keys(ctx.query)[0])
  } catch (e) {}

  return { props }
}
// }

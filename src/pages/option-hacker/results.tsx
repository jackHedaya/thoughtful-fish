import Head from 'next/head'
import useRequest from '../../hooks/useRequest'

import LoadingAnimation from '../../components/LoadingAnimation'

import s from '../../styles/pages/results.module.scss'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type OptionHackerResultsProps = {
  tickers: string[]
  expressions?: string[]
  preset: string
}

export default function OptionHackerResults(props: OptionHackerResultsProps) {
  const res = useRequest<{ options: Partial<OptionExtension>[] }, {}>({
    url: '/hey',
  })

  // Used to prevent a loading flash
  const [loaderTimeoutDone, setLoaderTimeoutDone] = useState(false)

  useEffect(() => {
    let x = setTimeout(() => setLoaderTimeoutDone(true), 2000)
    return () => clearTimeout(x)
  })

  const SAMPLE_OPTIONS = [
    {
      mark: 2.42,
      impliedVolatility: 0.45,
      symbol: 'AYX_24572C23',
      type: 'CALL',
      daysToExpiration: 24,
      strike: 120,
    },
    {
      mark: 2.42,
      impliedVolatility: 0.45,
      symbol: 'AYX_24572C23',
      type: 'CALL',
      daysToExpiration: 24,
      strike: 120,
    },
    {
      mark: 2.42,
      impliedVolatility: 0.45,
      symbol: 'AYX_24572C23',
      type: 'CALL',
      daysToExpiration: 24,
      strike: 120,
    },
    {
      mark: 2.42,
      impliedVolatility: 0.45,
      symbol: 'AYX_24572C23',
      type: 'CALL',
      daysToExpiration: 24,
      strike: 120,
    },
    {
      mark: 2.42,
      impliedVolatility: 0.45,
      symbol: 'AYX_24572C23',
      type: 'CALL',
      daysToExpiration: 24,
      strike: 120,
    },
  ]

  const SAMPLE_HEADERS = [
    { label: 'Symbol', key: 'symbol' },
    { label: 'Type', key: 'type' },
    { label: 'Strike', key: 'strike' },
    { label: 'Mark', key: 'mark' },
  ]

  const loadingDone = !res.data && loaderTimeoutDone

  return (
    <div className="content">
      <Head>
        <title>Thoughtful Fish | {tickers} Results</title>
      </Head>
      <div className="page-title">Option Hacker</div>
      {loadingDone && !res.error && (
        <h2 className={s.resultsTitle}>Results for {props.tickers.join(', ')}</h2>
      )}
      <div className={s.results}>
        {res.error && loaderTimeoutDone ? (
          <div className={s.errorMessage}>{res.error.message}</div>
        ) : !loadingDone ? (
          <div className={s.loader}>
            <LoadingAnimation />
          </div>
        ) : (
          <OptionTable headers={SAMPLE_HEADERS} options={res.data.options} />
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

  return (
    <table>
      {headers.map(({ label }) => (
        <th key={`Header/${label}`}>{label}</th>
      ))}
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
                className={key === 'symbol' && s.symbol}
                key={`RowData/${i}/${key}`}
              >
                {option[key]}
              </td>
            ))}
          </tr>
        ))
      }
    </table>
  )
}

export function getServerSideProps(context: NextPageContext) {
  // Query will come in encoded JSON form... It will be parsed to this form
  // '{"tickers":["NCLH"],"expressions":[""]': ''
  // This will get the key and decode it to JSON
  let props = {}

  try {
    props = JSON.parse(Object.keys(context.query)[0])
  } catch (e) {}

  return { props }
}
// }

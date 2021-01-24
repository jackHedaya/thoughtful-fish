import { useEffect, useState } from 'react'
import q from 'querystring'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

import LoadingAnimation from '../../components/LoadingAnimation'

import { auth } from '../../middlewares'
import setQuerystring from '../../utils/setQuerystring'
import useRequest from '../../hooks/useRequest'

import s from '../../styles/pages/results.module.scss'

type OptionHackerResultsProps = {
  tickers: string[]
  expressions?: string[]
  preset: string
  headers?: string[]
}

type HeaderOption = { key: string; label: string }

const DEFAULT_HEADERS = [
  { label: 'Symbol', key: 'symbol' },
  { label: 'Type', key: 'putCall' },
  { label: 'Strike', key: 'strikePrice' },
  { label: 'Mark', key: 'mark' },
]

export default function OptionHackerResults(props: OptionHackerResultsProps) {
  const { data, error } = useRequest<HackerResult, {}>({
    url: '/api/find_options?' + q.stringify(props),
    method: 'GET',
    data: JSON.stringify(props),
  })

  const options = data?.options

  // Used to prevent a loading flash
  const [loaderTimeoutDone, setLoaderTimeoutDone] = useState(false)

  const passedHeaders = props?.headers?.map((h) => ({ key: h, label: camelCaseToTitle(h) }))
  const [displayHeaders, setDisplayHeaders] = useState(passedHeaders || DEFAULT_HEADERS)

  useEffect(() => {
    let x = setTimeout(() => setLoaderTimeoutDone(true), 2000)
    return () => clearTimeout(x)
  })

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
          <>
            <Autocomplete
              className={s.tableHeaderSelection}
              options={Object.keys(options[0]).map((key) => ({
                key,
                label: camelCaseToTitle(key),
              }))}
              getOptionLabel={(option) => option.label}
              getOptionSelected={(o, n) => o.key === n.key}
              value={displayHeaders}
              onChange={(_, headers) => {
                setDisplayHeaders(headers as HeaderOption[])
                setQuerystring('headers', (headers as HeaderOption[]).map((h) => h.key).join(','))
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Table Headers"
                  placeholder="Header"
                />
              )}
              multiple
            />
            <OptionTable headers={displayHeaders} options={options} />
          </>
        )}
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
                  {key === 'symbol' && option.inTheMoney ? <div className={s.itm}>ITM</div> : null}

                  {option[key]?.toString()}
                </td>
              ))}
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

const camelCaseToTitle = (str: string) => {
  const result = str.replace(/([A-Z])/g, ' $1')
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1)

  return finalResult
}

export async function getServerSideProps(ctx: NextPageContext) {
  await auth(ctx.req as NextApiRequest, ctx.res as NextApiResponse)

  // Hacker query will come in encoded JSON form... It will be parsed to this form
  // '{"tickers":["NCLH"],"expressions":[""]': ''
  // This will get the key and decode it to JSON
  let props = {}

  // Table headers are passed in comma separated into query string
  const headers = (ctx.query.headers as string)?.split(',')

  try {
    // Header spread needs to be done because getServerSideProps throws if a property is undefined
    props = { ...JSON.parse(Object.keys(ctx.query)[0]), ...(headers ? { headers } : {}) }
  } catch (e) {}

  return { props }
}

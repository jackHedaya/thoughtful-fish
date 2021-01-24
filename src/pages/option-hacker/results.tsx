import { useEffect, useMemo, useState } from 'react'
import q from 'querystring'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { TextField, Tooltip } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { ArrowDropDownSharp, ArrowDropUpSharp, InfoOutlined } from '@material-ui/icons'

import LoadingAnimation from '../../components/LoadingAnimation'

import { auth } from '../../middlewares'

import defaultPresetHeaders from '../../lib/thoughtful-fish/defaultPresetHeaders'
import setQuerystring from '../../utils/setQuerystring'
import sorter from '../../utils/sorter'
import useRequest from '../../hooks/useRequest'

import s from '../../styles/pages/results.module.scss'

type OptionHackerResultsProps = {
  tickers: string[]
  expressions?: string[]
  preset: string
  headers?: string[]
}

type HeaderOption = { key: string; label: string }

export default function OptionHackerResults(props: OptionHackerResultsProps) {
  const [noCache, setNoCache] = useState(false)
  const [sortByKey, setSortByKey] = useState(null)
  const [sortDirection, setSortDirection] = useState<'DESC' | 'ASC' | null>('DESC')

  const handleSort = (key: string) => {
    if (sortByKey === key) {
      if (sortDirection === 'DESC') setSortDirection('ASC')

      if (sortDirection === 'ASC') {
        setSortDirection(null)
        setSortByKey(null)
      }

      return
    }

    setSortDirection('DESC')
    setSortByKey(key)
  }

  const { data, error } = useRequest<HackerResult, {}>({
    url: '/api/find_options',
    method: 'GET',
    params: { ...props, noCache },
    paramsSerializer: (d) => q.stringify(d),
  })

  const options = useMemo(() => {
    console.log(data?.options[0])
    let sorted = sorter(data?.options, sortByKey)

    return sortDirection === 'ASC' ? sorted.reverse() : sorted
  }, [data?.options, sortByKey, sortDirection])

  // Used to prevent a loading flash
  const [loaderTimeoutDone, setLoaderTimeoutDone] = useState(false)

  const passedHeaders = props?.headers?.map((h) => ({ key: h, label: camelCaseToTitle(h) }))
  const [displayHeaders, setDisplayHeaders] = useState(
    passedHeaders || defaultPresetHeaders[props.preset]
  )

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
      {loadingDone && !error && (
        <h2 className={s.resultsTitle}>
          Results for {tickers} {data.meta.cached && <CachedTooltip setNoCache={setNoCache} />}
        </h2>
      )}
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
            <OptionTable
              headers={displayHeaders}
              options={options}
              sortByKey={sortByKey}
              onSort={handleSort}
              sortDirection={sortDirection}
            />
          </>
        )}
      </div>
    </div>
  )
}

function CachedTooltip(props: { setNoCache: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <Tooltip
      title={
        <span className={s.cachedTooltip}>
          These results come from cached prices. To reload press{' '}
          <span onClick={() => props.setNoCache(true)}>here</span>
        </span>
      }
      placement="left-end"
      arrow
      interactive
      leaveDelay={300}
    >
      <span className={`${s.cached} icon`}>
        <InfoOutlined />
      </span>
    </Tooltip>
  )
}

type OptionTableProps = {
  headers: TableHeader[]
  options: Partial<OptionExtension>[]
  sortByKey: string
  sortDirection: 'ASC' | 'DESC' | null
  onSort: (key: string) => void
}
type TableHeader = { label: string; key: string }

function OptionTable(props: OptionTableProps) {
  const { headers, options, sortByKey, onSort, sortDirection } = props

  const router = useRouter()

  function chartOption(symbol: string) {
    router.push(`/chart/${symbol}`)
  }

  return (
    <table>
      <thead>
        <tr style={{ minWidth: '49px' }}>
          {headers.map(({ label, key }) => (
            <th
              className={key !== sortByKey ? s.noSort : undefined}
              key={`Header/${label}`}
              onClick={() => onSort(key)}
            >
              {label}
              <SortIcon isActive={key === sortByKey} direction={sortDirection} />
            </th>
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

function SortIcon(props: { isActive: boolean; direction: string }) {
  const { isActive, direction } = props

  return (
    <span className="icon">
      {isActive ? (
        direction === 'DESC' ? (
          <ArrowDropDownSharp />
        ) : (
          <ArrowDropUpSharp />
        )
      ) : (
        <div style={{ height: '24px', display: 'inline-block' }}></div>
      )}
    </span>
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

import q from 'querystring'

import { LinearProgress, TextField, Tooltip } from '@material-ui/core'
import { InfoOutlined } from '@material-ui/icons'
import { Autocomplete } from '@material-ui/lab'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useMemo, useState } from 'react'
import { SortDirection, SortDirectionType } from 'react-virtualized'

import LoadingAnimation from '../../components/LoadingAnimation'
import useInfiniteRequest from '../../hooks/useInfiniteRequest'
import usePrettyLoading from '../../hooks/usePrettyLoading'
import defaultPresetHeaders from '../../lib/thoughtful-fish/defaultPresetHeaders'
import { getSession, returnRedirect } from '../../middlewares/auth'
import s from '../../styles/pages/results.module.scss'
import setQuerystring from '../../utils/setQuerystring'
import sorter from '../../utils/sorter'

const OptionTable = dynamic(() => import('../../components/OptionTable'))

type OptionHackerResultsProps = {
  tickers: string[]
  expressions?: string[]
  preset: string
  headers?: string[]
}

type HeaderOption = { key: string; label: string }

export default function OptionHackerResults(props: OptionHackerResultsProps) {
  const BATCH_SIZE = 5

  const [noCache, setNoCache] = useState(false)
  const [sortByKey, setSortByKey] = useState(null)
  const [sortDirection, setSortDirection] = useState<SortDirectionType>(SortDirection.DESC)

  const handleSort = (sortBy: string) => {
    if (sortByKey === sortBy) {
      if (sortDirection === SortDirection.DESC) setSortDirection(SortDirection.ASC)

      if (sortDirection === SortDirection.ASC) {
        setSortDirection(null)
        setSortByKey(null)
      }

      return
    }

    setSortDirection(SortDirection.DESC)
    setSortByKey(sortBy)
  }

  const { data, error, size, setSize } = useInfiniteRequest<HackerResult, string>(
    (pageIndex, previousPageData) => {
      // Reached the end
      if (previousPageData && !previousPageData.data?.options.length) return null
      return {
        url: `/api/find_options`,
        method: 'GET',
        params: { ...props, noCache, page: pageIndex, limit: BATCH_SIZE },
        paramsSerializer: (d) => q.stringify(d),
      }
    },
    { initialSize: 1 }
  )

  const isPrettyLoading = usePrettyLoading(2000)

  const options = useMemo(() => {
    // Combines the multiple responses into one array
    const ops = data
      ?.reduce((a, c) => ({ ...a, options: [...a.options, ...c.options] }), {
        meta: data?.[0].meta,
        options: [],
      })
      // Replaces "Infinity%" with "N/A"
      .options.map((o) => ({
        ...o,
        returnOnTarget: o.returnOnTarget === 'Infinity%' ? 'N/A' : o.returnOnTarget,
      }))

    if (sortDirection === null) return ops

    const sorted = sorter(ops, sortByKey)

    return sortDirection === 'ASC' ? sorted.reverse() : sorted
  }, [data, sortByKey, sortDirection])
  const meta = data?.[0].meta

  const passedHeaders = props?.headers?.map((h) => ({ key: h, label: camelCaseToTitle(h) }))
  const [displayHeaders, setDisplayHeaders] = useState(
    passedHeaders || defaultPresetHeaders[props.preset]
  )

  const loadingDone = options && !isPrettyLoading

  const tickersTitle = generateTickersTitle(props.tickers)

  return (
    <div className={`content ${s.content}`}>
      <Head>
        <title>Thoughtful Fish | {tickersTitle} Results</title>
      </Head>
      <div className="page-title">Option Hacker</div>
      {loadingDone && !error && (
        <>
          <LinearProgress value={size / props.tickers.length} variant="determinate" />
          <h2 className={s.resultsTitle}>
            Results for {tickersTitle} {meta.cached && <CachedTooltip setNoCache={setNoCache} />}
          </h2>
        </>
      )}
      <div className={s.results}>
        {error && !isPrettyLoading ? (
          <div className={s.errorMessage}>{error?.response?.data || error?.message}</div>
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
              sortBy={sortByKey}
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

const camelCaseToTitle = (str: string) => {
  const result = str.replace(/([A-Z])/g, ' $1')
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1)

  return finalResult
}

const generateTickersTitle = (tickers: string[]) => {
  const MAX_SHOWN = 6

  if (tickers.length < 2) return tickers[0]

  const lastElement = tickers[tickers.length - 1]
  const excludingLast = tickers.slice(0, tickers.length - 1).join(', ')

  if (tickers.length < MAX_SHOWN) return `${excludingLast} and ${lastElement}`

  return `${tickers.slice(0, MAX_SHOWN).join(', ')} and ${tickers.length - MAX_SHOWN} more`
}

export async function getServerSideProps(ctx: NextPageContext) {
  const session = getSession(ctx)

  if (!session) return returnRedirect(ctx)

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

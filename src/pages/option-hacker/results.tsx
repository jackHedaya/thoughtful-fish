import q from 'querystring'

import { LinearProgress, TextField, Tooltip } from '@material-ui/core'
import { InfoOutlined } from '@material-ui/icons'
import { Autocomplete } from '@material-ui/lab'
import { AxiosError } from 'axios'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { memo, useEffect, useMemo, useState } from 'react'
import { SortDirection, SortDirectionType } from 'react-virtualized'

import LoadingAnimation from '../../components/LoadingAnimation'
import usePrettyLoading from '../../hooks/usePrettyLoading'
import useRequest from '../../hooks/useRequest'
import defaultPresetHeaders from '../../lib/thoughtful-fish/defaultPresetHeaders'
import { getSession, returnRedirect } from '../../middlewares/auth'
import useResultsState, { Action } from '../../state/useResultsState'
import s from '../../styles/pages/results.module.scss'
import chunk from '../../utils/chunk'
import pluralize from '../../utils/pluralize'
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

  const [state, dispatch] = useResultsState({ totalTickerCount: props.tickers.length })

  const handleSort = (sortBy: string) => {
    const { sortBy: sortByKey, sortDirection } = state

    const setSortDirection = (sortDirection) =>
      dispatch({ type: 'set_sort_direction', sortDirection })
    const setSortBy = (sortBy) => dispatch({ type: 'set_sort_by_key', sortBy })

    if (sortByKey === sortBy) {
      if (sortDirection === SortDirection.DESC) setSortDirection(SortDirection.ASC)
      else if (sortDirection === SortDirection.ASC) {
        setSortDirection(null)
        setSortBy(null)
      }

      return
    }

    setSortDirection(SortDirection.DESC)
    setSortBy(sortBy)
  }

  const options = useMemo(() => {
    const { results, sortDirection, sortBy } = state

    // Combines the multiple responses into one array
    const ops = results // Replaces "Infinity%" with "N/A"
      .map((o) => ({
        ...o,
        returnOnTarget: o.returnOnTarget === 'Infinity%' ? 'N/A' : o.returnOnTarget,
      }))

    if (sortDirection === null) return ops

    const sorted = sorter(ops, sortBy)

    return sortDirection === 'ASC' ? sorted.reverse() : sorted

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.results, state.sortBy, state.sortDirection])

  const isLoading = usePrettyLoading(
    state.loadedTickers.length === 0 && state.erroredTickers.length !== state.totalTickerCount,
    2000
  )

  const isErrored = state.erroredTickers.length === state.totalTickerCount

  const passedHeaders = props?.headers?.map((h) => ({ key: h, label: camelCaseToTitle(h) }))
  const [displayHeaders, setDisplayHeaders] = useState(
    passedHeaders || defaultPresetHeaders[props.preset]
  )

  const tickersTitle = generateTickersTitle(props.tickers)

  if (!isLoading) console.log(state.loadedTickers.length)

  return (
    <div className={`content ${s.content}`}>
      <Head>
        <title>Thoughtful Fish | {tickersTitle} Results</title>
      </Head>
      <div className="page-title">Option Hacker</div>
      {!isLoading && !isErrored && (
        <>
          <h2 className={s.resultsTitle}>
            Results for {tickersTitle}{' '}
            {state.cachedCount !== 0 && (
              <CachedTooltip
                setNoCache={() => dispatch({ type: 'set_no_cache', noCache: true })}
                cachedCount={state.cachedCount}
              />
            )}
          </h2>
        </>
      )}
      <div className={s.results}>
        {isErrored && !isLoading ? (
          <div className={s.errorMessage}>
            <div>Failed to find options with the following error:</div>
            <div>{state.errors[0].message}</div>
          </div>
        ) : isLoading ? (
          <div className={s.loader}>
            <LoadingAnimation />
          </div>
        ) : (
          <>
            <Autocomplete
              className={s.tableHeaderSelection}
              options={Object.keys(options?.[0] || {}).map((key) => ({
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
              sortBy={state.sortBy}
              onSort={handleSort}
              sortDirection={state.sortDirection}
            />
          </>
        )}
      </div>
      <QueryTickers
        tickers={props.tickers}
        batchSize={BATCH_SIZE}
        presetData={{ preset: props.preset, expressions: props.expressions }}
        dispatch={dispatch}
      />
    </div>
  )
}

type QueryTickersProps = {
  tickers: string[]
  presetData: {
    preset: string
    expressions: string[]
  }
  dispatch: React.Dispatch<Action>
  batchSize: number
}

function QueryTickersNM(props: QueryTickersProps) {
  const { dispatch, batchSize, presetData } = props

  return (
    <>
      {chunk(props.tickers, batchSize).map((tickers) => (
        <QueryTicker
          tickers={tickers}
          key={`Batch/${tickers.join(',')}`}
          onResult={(data: HackerResult) => props.dispatch({ type: 'add_results', tickers, data })}
          onError={(error) =>
            dispatch({ type: 'add_error', tickers, message: error.response?.data || error.message })
          }
          presetData={presetData}
        />
      ))}
    </>
  )
}

const QueryTickers = memo(QueryTickersNM, () => true)

type QueryTickerProps = Omit<QueryTickersProps, 'tickers' | 'dispatch' | 'batchSize'> & {
  tickers: string[]
  onResult?: (data: HackerResult) => void
  onError?: (error: AxiosError) => void
}

function QueryTickerNM(props: QueryTickerProps) {
  const { data, error } = useRequest<HackerResult>({
    url: `/api/find_options`,
    method: 'GET',
    params: { ...props.presetData, tickers: props.tickers, preset: 'Expression' },
    paramsSerializer: (d) => q.stringify(d),
  })

  console.log('rendering ' + props.tickers.join(','))

  useEffect(() => {
    if (!data && !error) return

    if (!data && error) {
      props.onError?.(error)
      return
    }

    props.onResult?.(data)
  }, [data, error, props])

  return <></>
}

const QueryTicker = memo(QueryTickerNM, () => true)

type CachedTooltipProps = {
  setNoCache: React.Dispatch<React.SetStateAction<boolean>>
  cachedCount: number
}

function CachedTooltip(props: CachedTooltipProps) {
  return (
    <Tooltip
      title={
        <span className={s.cachedTooltip}>
          Some of these results come from {props.cachedCount} cached{' '}
          {pluralize('price', props.cachedCount)}. To reload press{' '}
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

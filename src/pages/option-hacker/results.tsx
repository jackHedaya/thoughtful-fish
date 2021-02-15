import { Fragment, useEffect, useMemo, useState } from 'react'
import q from 'querystring'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Table, Column, CellMeasurer, CellMeasurerCache } from 'react-virtualized'
import AutoSizer from 'react-virtualized-auto-sizer'
import Draggable from 'react-draggable'
import { TextField, Tooltip } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import {
  ArrowDropDownSharp,
  ArrowDropUpSharp,
  DragIndicator,
  InfoOutlined,
} from '@material-ui/icons'

import LoadingAnimation from '../../components/LoadingAnimation'

import { auth } from '../../middlewares'

import defaultPresetHeaders from '../../lib/thoughtful-fish/defaultPresetHeaders'
import setQuerystring from '../../utils/setQuerystring'
import sorter from '../../utils/sorter'
import useRequest from '../../hooks/useRequest'

import 'react-virtualized/styles.css'
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

  const { data, error } = useRequest<HackerResult, string>({
    url: '/api/find_options',
    method: 'GET',
    params: { ...props, noCache },
    paramsSerializer: (d) => q.stringify(d),
  })

  const options = useMemo(() => {
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

  const tickersTitle = generateTickersTitle(props.tickers)

  return (
    <div className="content">
      <Head>
        <title>Thoughtful Fish | {tickersTitle} Results</title>
      </Head>
      <div className="page-title">Option Hacker</div>
      {loadingDone && !error && (
        <h2 className={s.resultsTitle}>
          Results for {tickersTitle} {data.meta.cached && <CachedTooltip setNoCache={setNoCache} />}
        </h2>
      )}
      <div className={s.results}>
        {error && loaderTimeoutDone ? (
          <div className={s.errorMessage}>{error.response.data || error.message}</div>
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

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
    headers.reduce((p, a) => ({ ...p, [a.key]: 1 / headers.length }), {})
  )

  function chartOption(symbol: string) {
    router.push(`/chart/${symbol}`)
  }

  type HeaderRendererProps = {
    dataKey: string
    label: string
    columnData: { totalWidth: number; index: number }
  }

  function HeaderRenderer(props: HeaderRendererProps) {
    const { dataKey, label, columnData } = props

    const resizeRow = ({ dataKey, deltaX }) => {
      const percentDelta = deltaX / columnData.totalWidth

      const nextDataKey = headers[columnData.index + 1].key

      setColumnWidths({
        ...columnWidths,
        [dataKey]: columnWidths[dataKey] + percentDelta,
        [nextDataKey]: columnWidths[nextDataKey] - percentDelta,
      })
    }

    return (
      <Fragment key={dataKey}>
        <div className={s.headerTruncated}>{label}</div>
        {columnData.index !== headers.length - 1 && (
          <Draggable
            axis="x"
            defaultClassName={s.dragHandle}
            defaultClassNameDragging={s.dragHandleActive}
            onDrag={(event, { deltaX }) =>
              resizeRow({
                dataKey,
                deltaX,
              })
            }
            position={{ x: 0, y: 0 }}
          >
            <DragIndicator className={s.dragHandleIcon} />
          </Draggable>
        )}
      </Fragment>
    )
  }

  return (
    <div className={s.table}>
      <AutoSizer>
        {({ width, height }) => {
          return (
            <Table
              width={width}
              height={height}
              headerHeight={parseInt(s.headerHeight)}
              rowCount={options.length}
              rowHeight={getPixelNumber(s.rowHeight)}
              rowGetter={({ index }) => options[index]}
              className={s.tableGrid}
              headerClassName={s.header}
            >
              {headers.map(({ key, label }, index) => (
                <Column
                  className={s.cell}
                  label={label}
                  width={columnWidths[key] * width}
                  dataKey={key}
                  columnData={{ totalWidth: width, index }}
                  headerRenderer={HeaderRenderer}
                  cellRenderer={({ rowData: option }) => (
                    <span className={key === 'symbol' ? s.symbol : undefined}>
                      {key === 'symbol' && option.inTheMoney ? (
                        <div className={s.itm}>ITM</div>
                      ) : null}

                      {option[key]}
                    </span>
                  )}
                  key={`Column/${key}`}
                />
              ))}
            </Table>
          )
        }}
      </AutoSizer>
    </div>
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

const getPixelNumber = (px: string) => parseFloat(px.match(/(\d*)px/)?.[1]) || null

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

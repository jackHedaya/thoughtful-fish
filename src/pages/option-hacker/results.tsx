import { Fragment, useEffect, useMemo, useState } from 'react'
import q from 'querystring'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Table, Column, SortDirection, SortDirectionType } from 'react-virtualized'
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
import usePrettyLoading from '../../hooks/usePrettyLoading'
import useRequest from '../../hooks/useRequest'
import defaultPresetHeaders from '../../lib/thoughtful-fish/defaultPresetHeaders'
import { getSession, returnRedirect } from '../../middlewares/auth'
import s from '../../styles/pages/results.module.scss'
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

  const { data, error } = useRequest<HackerResult, string>({
    url: '/api/find_options',
    method: 'GET',
    params: { ...props, noCache },
    paramsSerializer: (d) => q.stringify(d),
  })

  const isPrettyLoading = usePrettyLoading(2000)

  const options = useMemo(() => {
    if (sortDirection === null) return data?.options

    const sorted = sorter(data?.options, sortByKey)

    return sortDirection === 'ASC' ? sorted.reverse() : sorted
  }, [data?.options, sortByKey, sortDirection])

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
        <h2 className={s.resultsTitle}>
          Results for {tickersTitle} {data.meta.cached && <CachedTooltip setNoCache={setNoCache} />}
        </h2>
      )}
      <div className={s.results}>
        {error && !isPrettyLoading ? (
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

type OptionTableProps = {
  headers: TableHeader[]
  options: Partial<OptionExtension>[]
  sortBy: string
  sortDirection: 'ASC' | 'DESC' | null
  onSort: (sortBy: string) => void
}
type TableHeader = { label: string; key: string }

function OptionTable(props: OptionTableProps) {
  const { headers, options, sortBy, onSort, sortDirection } = props

  const cellMinWidth = headers.length * getPixelNumber(s.cellMinWidth)
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})

  /** Resets column widths on header added */
  useEffect(() => {
    setColumnWidths(
      headers.reduce(
        (p, a) => ({
          ...p,
          [a.key]: 1 / headers.length,
        }),
        {}
      )
    )
  }, [headers.length])

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
        {sortBy === dataKey ? (
          sortDirection === SortDirection.ASC ? (
            <ArrowDropUpSharp />
          ) : (
            <ArrowDropDownSharp />
          )
        ) : null}

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
              width={width < cellMinWidth ? cellMinWidth : width}
              height={height}
              headerHeight={parseInt(s.headerHeight)}
              onHeaderClick={(h) => h.dataKey}
              sortBy={sortBy}
              sortDirection={sortDirection}
              sort={({ sortBy }) => onSort(sortBy)}
              rowCount={options.length}
              rowHeight={getPixelNumber(s.rowHeight)}
              rowGetter={({ index }) => options[index]}
              className={s.tableGrid}
              headerClassName={s.header}
            >
              {headers.map(({ key, label }, index) => (
                <Column
                  className={`${s.cell} ${sortBy === key ? s.sortingBy : undefined}`}
                  label={label}
                  width={columnWidths[key] * width}
                  dataKey={key}
                  columnData={{ totalWidth: width, index }}
                  headerRenderer={HeaderRenderer}
                  headerClassName={sortBy === key ? s.sortingBy : undefined}
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

import { useReducer } from 'react'
import { SortDirection, SortDirectionType } from 'react-virtualized'

export type ResultsState = {
  results: OptionExtension[]
  meta: HackerMeta
  errors: ErrorData[]
  cachedCount: number
  totalTickerCount: number
  loadedTickers: string[]
  erroredTickers: string[]
  noCache: boolean
  sortBy: string
  sortDirection: SortDirectionType
}

export type Action =
  | {
      type: 'add_results'
      data: HackerResult
      tickers: string[]
    }
  | ({ type: 'add_error' } & ErrorData)
  | { type: 'set_no_cache'; noCache: boolean }
  | { type: 'set_sort_by_key'; sortBy: string }
  | { type: 'set_sort_direction'; direction: string }
  | { type: 'set_total_ticker_count'; totalTickerCount: number }

type ErrorData = { tickers: string[]; message: string }

function reducer(state: ResultsState, action: Action): ResultsState {
  // Must disable because TypeScript cannot undertand switch type for some reason
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, ...actionParams } = action

  switch (action.type) {
    case 'add_results':
      return {
        ...state,
        results: [...state.results, ...action.data.options],
        loadedTickers: [...state.loadedTickers, ...action.tickers],
        cachedCount: action.data.meta.cached ? state.cachedCount + 1 : state.cachedCount,
      }

    case 'add_error':
      return {
        ...state,
        erroredTickers: [...state.erroredTickers, ...action.tickers],
        errors: [...state.errors, { tickers: action.tickers, message: action.message }],
      }

    case 'set_no_cache':
    case 'set_sort_by_key':
    case 'set_sort_direction':
    case 'set_total_ticker_count':
      return { ...state, ...actionParams }

    default:
      throw new Error()
  }
}

type InitialArgs = { totalTickerCount: number }

export default function useResultsState({ totalTickerCount }: InitialArgs) {
  return useReducer(reducer, {
    results: [],
    meta: null,
    errors: [],
    cachedCount: 0,
    noCache: false,
    totalTickerCount,
    loadedTickers: [],
    erroredTickers: [],
    sortBy: null,
    sortDirection: SortDirection.DESC,
  })
}

import { useReducer } from 'react'
import { SortDirection, SortDirectionType } from 'react-virtualized'

export type ResultsState = {
  results: OptionExtension[]
  meta: HackerMeta
  errors: ErrorData[]
  isCached: boolean
  noCache: boolean
  sortBy: string
  sortDirection: SortDirectionType
}

type Action =
  | {
      type: 'add_results'
      data: HackerResult
    }
  | ({ type: 'add_error' } & ErrorData)
  | { type: 'set_no_cache'; noCache: boolean }
  | { type: 'set_sort_by_key'; sortBy: string }
  | { type: 'set_sort_direction'; direction: string }

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
        isCached: action.data.meta.cached,
      }

    case 'add_error':
      return {
        ...state,
        errors: [...state.errors, { tickers: action.tickers, message: action.message }],
      }

    case 'set_no_cache':
    case 'set_sort_by_key':
    case 'set_sort_direction':
      return { ...state, ...actionParams }

    default:
      throw new Error()
  }
}

export default function useResultsState() {
  return useReducer(reducer, {
    results: [],
    meta: null,
    errors: [],
    isCached: null,
    noCache: false,
    sortBy: null,
    sortDirection: SortDirection.DESC,
  })
}

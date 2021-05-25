import { useReducer } from 'react'
import { SortDirection, SortDirectionType } from 'react-virtualized'

import GeneralSet from '../utils/GeneralSet'

type ResultsState = Omit<
  InternalResultsState,
  'resultsSet' | 'loadedTickersSet' | 'erroredTickersSet' | 'cachedTickersSet'
> & {
  results: OptionExtension[]
  loadedTickers: string[]
  erroredTickers: string[]
  cachedTickers: string[]
}

type InternalResultsState = {
  // These properties will not be available externally
  resultsSet: GeneralSet<OptionExtension>
  loadedTickersSet: Set<string>
  erroredTickersSet: Set<string>
  cachedTickersSet: Set<string>

  errors: ErrorData[]
  meta: HackerMeta
  totalTickerCount: number
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
  | { type: 'set_sort_direction'; sortDirection: SortDirectionType }
  | { type: 'set_total_ticker_count'; totalTickerCount: number }

type ErrorData = { tickers: string[]; message: string }

const defaultState: (totalTickerCount: number) => InternalResultsState = (totalTickerCount) => ({
  resultsSet: new GeneralSet((o) => o.symbol),
  loadedTickersSet: new Set(),
  erroredTickersSet: new Set(),
  cachedTickersSet: new Set(),

  noCache: false,
  errors: [],
  sortDirection: SortDirection.DESC,
  sortBy: null,
  meta: { cached: false },
  totalTickerCount,
})

const transformState: (state: InternalResultsState) => ResultsState = (state) => {
  const { resultsSet, loadedTickersSet, erroredTickersSet, cachedTickersSet, ...rest } = state

  return {
    ...rest,
    results: resultsSet.toArray(),
    loadedTickers: Array.from(loadedTickersSet.values()),
    erroredTickers: Array.from(erroredTickersSet.values()),
    cachedTickers: Array.from(cachedTickersSet.values()),
  }
}

function reducer(state: InternalResultsState, action: Action): InternalResultsState {
  switch (action.type) {
    case 'add_results': {
      action.tickers.forEach((ticker) => {
        state.loadedTickersSet.add(ticker)

        if (action.data.meta.cached) state.cachedTickersSet.add(ticker)
      })

      state.resultsSet.add(...action.data.options)

      return { ...state }
    }

    case 'add_error': {
      action.tickers.forEach((ticker) => state.erroredTickersSet.add(ticker))

      return {
        ...state,
        errors: [...state.errors, { tickers: action.tickers, message: action.message }],
      }
    }

    case 'set_no_cache':
      return { ...state, cachedTickersSet: new Set(), noCache: action.noCache }

    case 'set_sort_by_key':
    case 'set_sort_direction':
    case 'set_total_ticker_count':
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { type, ...actionParams } = action

      return { ...state, ...actionParams }

    default:
      throw new Error()
  }
}

type InitialArgs = { totalTickerCount: number }

export default function useResultsState({
  totalTickerCount,
}: InitialArgs): [ResultsState, React.Dispatch<Action>] {
  const [state, dispatch] = useReducer(reducer, defaultState(totalTickerCount))

  return [transformState(state), dispatch]
}

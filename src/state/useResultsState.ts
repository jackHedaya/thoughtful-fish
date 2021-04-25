import { useReducer } from 'react'
import { SortDirection, SortDirectionType } from 'react-virtualized'

import GeneralSet from '../utils/GeneralSet'

export class ResultsState {
  private resultsSet: GeneralSet<OptionExtension> = new GeneralSet((i) => i.symbol)
  private loadedTickersSet: Set<string> = new Set()
  private cachedTickersSet: Set<string> = new Set()
  private erroredTickersSet: Set<string> = new Set()

  public errors: ErrorData[] = []
  public meta: HackerMeta
  public totalTickerCount: number
  public noCache: boolean
  public sortBy: string
  public sortDirection: SortDirectionType = SortDirection.DESC

  get results() {
    return Array.from(this.resultsSet.values())
  }

  set results(r: OptionExtension[]) {
    this.resultsSet.clear()
    this.resultsSet.add(...r)
  }

  get loadedTickers() {
    return Array.from(this.loadedTickersSet.values())
  }

  set loadedTickers(t: string[]) {
    this.loadedTickersSet.clear()
    t.forEach((ticker) => this.loadedTickersSet.add(ticker))
  }

  get cachedTickers() {
    return Array.from(this.cachedTickersSet.values())
  }

  set cachedTickers(t: string[]) {
    this.cachedTickersSet.clear()
    t.forEach((ticker) => this.cachedTickersSet.add(ticker))
  }

  get erroredTickers() {
    return Array.from(this.erroredTickersSet.values())
  }

  set erroredTickers(t: string[]) {
    this.erroredTickersSet.clear()
    t.forEach((ticker) => this.erroredTickersSet.add(ticker))
  }

  constructor(args: Partial<ResultsState>) {
    const { results, loadedTickers, cachedTickers, erroredTickers, ...others } = args

    if (results) this.pushResult(...results)
    if (loadedTickers) this.pushLoadedTickers(...loadedTickers)
    if (cachedTickers) this.pushCachedTickers(...cachedTickers)
    if (erroredTickers) this.pushErroredTickers(...erroredTickers)

    Object.entries(others).forEach(([k, v]) => (this[k] = v))
  }

  /**
   * Forces a rerender for dependent components because an equality check with falsely
   * succeed if a new object is not returned
   *
   * @param state The new result state
   * @returns {ResultState} A new state object with the same values
   */
  rerender(state?: ResultsState) {
    return new ResultsState(state ?? this)
  }

  pushResult(...r: OptionExtension[]) {
    this.resultsSet.add(...r)
  }

  pushLoadedTickers(...t: string[]) {
    this._pushTickerSet(this.loadedTickersSet, t)
  }

  pushCachedTickers(...t: string[]) {
    this._pushTickerSet(this.cachedTickersSet, t)
  }

  pushErroredTickers(...t: string[]) {
    this._pushTickerSet(this.erroredTickersSet, t)
  }

  private _pushTickerSet(set: Set<string>, t: string[]) {
    t.forEach((ticker) => set.add(ticker))
  }
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

function reducer(state: ResultsState, action: Action): ResultsState {
  // Must disable because TypeScript cannot undertand switch type for some reason
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, ...actionParams } = action

  switch (action.type) {
    case 'add_results': {
      state.pushLoadedTickers(...action.tickers)

      if (action.data.meta.cached) state.pushCachedTickers(...action.tickers)

      state.pushResult(...action.data.options)

      return state.rerender()
    }

    case 'add_error': {
      state.pushErroredTickers(...action.tickers)

      state.errors = [...state.errors, { tickers: action.tickers, message: action.message }]

      return state.rerender()
    }

    case 'set_no_cache':
      state.cachedTickers = []
    // Implicitly falls through to return statement

    case 'set_sort_by_key':
    case 'set_sort_direction':
    case 'set_total_ticker_count':
      Object.entries(actionParams).forEach(([k, v]) => (state[k] = v))

      return state.rerender()

    default:
      throw new Error()
  }
}

type InitialArgs = { totalTickerCount: number }

export default function useResultsState({ totalTickerCount }: InitialArgs) {
  return useReducer(reducer, new ResultsState({ totalTickerCount }))
}

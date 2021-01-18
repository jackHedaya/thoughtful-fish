import { ExpressionPresetState } from './useExpressionPresetState'
import { TargetPricePresetState } from './useTargetPricePresetState'

export type PresetStateBase = {
  tickers: string[]
  _accordionsOpen: { [key: string]: boolean }
}

export type PresetActionBase<State extends PresetStateBase> =
  | {
      type: 'set_accordion_open'
      accordion: keyof State['_accordionsOpen']
      open: boolean
    }
  | { type: 'set_tickers'; tickers: string[] }
  | { type: 'prepare_for_send' }

export function presetReducerBase<Q extends PresetStateBase>(action: any, state: Q): Q | false {
  switch (action.type) {
    case 'set_accordion_open':
      return {
        ...state,
        _accordionsOpen: {
          ...state._accordionsOpen,
          [action.accordion]: action.open,
        },
      }
    case 'set_tickers':
      return { ...state, tickers: action.tickers }
    case 'prepare_for_send':
      return { ...state, tickers: state.tickers.filter((x) => x.trim() !== '') }
    default:
      return false
  }
}

// Add preset state types here
export type PresetState = ExpressionPresetState | TargetPricePresetState

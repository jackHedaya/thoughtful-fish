import { useReducer } from 'react'
import { PresetActionBase, presetReducerBase, PresetStateBase } from './presetBase'

export type TargetPricePresetState = PresetStateBase & {
  targetPrice: number
  daysLeft: number
  _accordionsOpen: {
    setup: boolean
    targetPrice: boolean
  }
}

type Action =
  | PresetActionBase<TargetPricePresetState>
  | { type: 'set_target_price'; targetPrice: number }
  | { type: 'set_days_left'; daysLeft: number }

function reducer(state: TargetPricePresetState, action: Action): TargetPricePresetState {
  const defaultReducerState = presetReducerBase(action, state)

  if (defaultReducerState && action.type === 'prepare_for_send') state = defaultReducerState

  if (defaultReducerState && action.type !== 'prepare_for_send') return defaultReducerState

  switch (action.type) {
    case 'set_target_price':
      return {
        ...state,
        targetPrice: action.targetPrice,
      }
    case 'set_days_left':
      return {
        ...state,
        daysLeft: action.daysLeft,
      }
    case 'prepare_for_send':
      return {
        ...state,
        daysLeft: parseInt(state.daysLeft + ''),
      }
  }
}

export default function presetReducer() {
  return useReducer(reducer, {
    tickers: [],
    targetPrice: undefined,
    daysLeft: undefined,
    _accordionsOpen: { setup: true, targetPrice: false },
  })
}

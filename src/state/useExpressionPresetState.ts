import { useReducer } from 'react'

import { PresetActionBase, presetReducerBase } from './presetBase'

type Expression = string

type Accordions = {
  setup: boolean
  expressions: boolean
}

export type ExpressionPresetState = {
  tickers: string[]
  expressions: Expression[]
  _accordionsOpen: Accordions
}

type Action =
  | PresetActionBase<ExpressionPresetState>
  | {
      type: 'add_expression'
      expression: Expression
    }
  | { type: 'remove_expression_at_index'; index: number }
  | { type: 'set_expression_at_index'; index: number; value: string }

function reducer(state: ExpressionPresetState, action: Action): ExpressionPresetState {
  const defaultReducer = presetReducerBase(action, state)

  if (defaultReducer) return defaultReducer

  switch (action.type) {
    case 'add_expression':
      return {
        ...state,
        expressions: [...state.expressions, action.expression],
      }
    case 'remove_expression_at_index':
      return {
        ...state,
        expressions: [
          ...state.expressions.slice(0, action.index),
          ...state.expressions.slice(action.index + 1),
        ],
      }
    case 'set_expression_at_index':
      return {
        ...state,
        expressions: [
          ...state.expressions.slice(0, action.index),
          action.value,
          ...state.expressions.slice(action.index + 1),
        ],
      }
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
      throw new Error()
  }
}

export default function useExpressionPresetState() {
  return useReducer(reducer, {
    tickers: [],
    expressions: [''],
    _accordionsOpen: { setup: true, expressions: false },
  })
}

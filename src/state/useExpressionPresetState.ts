import { useReducer } from 'react'

type Expression = string

export type ExpressionPresetState = {
  tickers: string[]
  expressions: Expression[]
  _accordionsOpen: {
    setup: boolean
    expressions: boolean
  }
}

type Action =
  | {
      type: 'add_expression'
      expression: Expression
    }
  | { type: 'remove_expression_at_index'; index: number }
  | { type: 'set_expression_at_index'; index: number; value: string }
  | {
      type: 'set_accordion_open'
      accordion: keyof ExpressionPresetState['_accordionsOpen']
      open: boolean
    }
  | { type: 'set_tickers'; tickers: string[] }
  | { type: 'prepare_for_send' }

function reducer(
  state: ExpressionPresetState,
  action: Action
): ExpressionPresetState {
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

export default function () {
  return useReducer(reducer, {
    tickers: [],
    expressions: [''],
    _accordionsOpen: { setup: true, expressions: false },
  })
}

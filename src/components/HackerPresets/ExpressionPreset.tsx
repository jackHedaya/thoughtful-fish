import { Button, capitalize, TextField, Tooltip } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import React from 'react'

import expressionKeywords from '../../lib/thoughtful-fish/expressionKeywords'
import { PresetProps } from '../../pages/option-hacker'
import useExpressionPresetState from '../../state/useExpressionPresetState'
import s from '../../styles/components/option-preset.module.scss'
import SignatureAccordion from '../SignatureAccordion'
import SignatureButton from '../SignatureButton'

import SetupAccordion from './SetupAccordion'

export default function ExpressionPreset(props: PresetProps) {
  const [state, dispatch] = useExpressionPresetState()

  function onNext() {
    dispatch({ type: 'prepare_for_send' })

    if (state.tickers.length > 0) props.onComplete(state)
  }

  return (
    <div onKeyPress={(e) => (e.key === 'Enter' ? onNext() : false)}>
      <SetupAccordion
        expanded={state._accordionsOpen.setup}
        onExpandedChange={(b) =>
          dispatch({ type: 'set_accordion_open', accordion: 'setup', open: b })
        }
        tickers={state.tickers}
        setTickers={(tickers: string[]) => dispatch({ type: 'set_tickers', tickers })}
        onNext={() => {
          dispatch({
            type: 'set_accordion_open',
            accordion: 'setup',
            open: false,
          })
          dispatch({
            type: 'set_accordion_open',
            accordion: 'expressions',
            open: true,
          })
        }}
      />
      <SignatureAccordion
        title="Expressions"
        style={{ position: 'relative', display: 'block' }}
        expanded={state._accordionsOpen.expressions}
        onChange={(_, b) =>
          dispatch({
            type: 'set_accordion_open',
            accordion: 'expressions',
            open: b,
          })
        }
      >
        {state.expressions.map((value, i) => (
          <div className={s.expression} key={`Expression/${i}`}>
            <TextField
              className={s.textfield}
              value={value}
              onChange={(e) =>
                dispatch({
                  type: 'set_expression_at_index',
                  index: i,
                  value: e.currentTarget.value,
                })
              }
              variant="outlined"
              label={`Expression ${i + 1}`}
              size="small"
            />
            <CloseIcon
              className={s.closeIcon}
              onClick={() => dispatch({ type: 'remove_expression_at_index', index: i })}
            />
          </div>
        ))}
        <Button
          className={s.addExpressionButton}
          size="small"
          onClick={() => dispatch({ type: 'add_expression', expression: '' })}
        >
          Add Expression
        </Button>
        <SignatureButton className={s.nextButton} onClick={() => onNext()}>
          Finish
        </SignatureButton>
      </SignatureAccordion>
      <props.navigationButtons BackButtonProps={{ disabled: true }} onNext={onNext} />
    </div>
  )
}

export function InstructionPanel() {
  const allKeywords = expressionKeywords()

  return (
    <div className={s.instructions}>
      <h2>How to use</h2>
      <div className={s.how}>
        This hacker preset will screen all the options given that satisfy one or more expressions
      </div>
      <h2>Example</h2>
      <div className={s.example}>
        <Tooltip
          title={`This will find all options in the given list whose price is less
        than 25% of underlying price`}
        >
          <div className={s.textfield}>
            <span>{'option.mark / underlying.mark < 0.25'}</span>
          </div>
        </Tooltip>
        <Tooltip
          title={`This will find all options in the given list who have more than 120 days until expiration`}
        >
          <div className={s.textfield}>
            <span>{'option.daysToExpiration > 120'}</span>
          </div>
        </Tooltip>
      </div>
      <i>Hover over example to see explanation</i>
      <h2>Variables</h2>
      <div className={s.vars}>
        {Object.entries(allKeywords).map(([category, keywords]) => (
          <React.Fragment key={`Category/${category}`}>
            <h3>{capitalize(category)}</h3>
            <div className={s.list}>
              {Object.entries(keywords).map(([key, type]) => (
                <Tooltip title={<span>{type.toString()}</span>} key={`Key/${key}`}>
                  <code>{key}</code>
                </Tooltip>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export type ExpressionProps = {
  expressions: string
}

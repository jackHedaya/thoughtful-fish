import { useState } from 'react'
import { Button, TextField, Tooltip } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import SignatureAccordion from '../SignatureAccordion'
import SignatureAutocomplete from '../SignatureAutocomplete'
import SignatureButton from '../SignatureButton'
import SignatureSelect from '../SignatureSelect'
import { PresetProps } from '../../pages/option-hacker'

import useExpressionPresetState from '../../state/useExpressionPresetState'

import s from '../../styles/components/option-preset.module.scss'

export default function ExpressionPreset(props: PresetProps) {
  const [watchlistOrList, setWatchlistOrList] = useState<'Watchlist' | 'List'>(
    'Watchlist'
  )

  const [state, dispatch] = useExpressionPresetState()

  function onNext() {
    dispatch({ type: 'prepare_for_send' })

    if (state.tickers.length > 0) props.onComplete(state)
  }

  return (
    <div>
      <SignatureAccordion
        title="Setup"
        style={{ position: 'relative' }}
        expanded={state._accordionsOpen.setup}
        onChange={(_, b) =>
          dispatch({ type: 'set_accordion_open', accordion: 'setup', open: b })
        }
      >
        <div className={s.watchlistSection}>
          <SignatureSelect
            label="Watchlist / List"
            className={s.watchlistOrList}
            items={['Watchlist', 'List']}
            onChange={(e) => setWatchlistOrList(e)}
            value={watchlistOrList}
          />
          {watchlistOrList === 'Watchlist' ? (
            <SignatureAutocomplete
              className={s.selectWatchlist}
              title="Select Watchlist"
              options={[
                { group: "jackehedaya's Watchlists", value: 'Hello' },
                { group: "jackehedaya's Watchlists", value: 'World' },
                { group: "john's Watchlists", value: 'World' },
              ]}
              TextFieldProps={{ required: true }}
            />
          ) : (
            <TextField
              className={s.selectWatchlist}
              value={state.tickers.join(',')}
              onChange={(e) =>
                dispatch({
                  type: 'set_tickers',
                  tickers: e.currentTarget.value
                    .split(',')
                    .map((x) => x.trim().toUpperCase()),
                })
              }
              label="Ticker List"
              placeholder="Comma seperated list"
              variant="outlined"
              inputProps={{
                autoComplete: 'new-password',
                form: {
                  autoComplete: 'off',
                },
              }}
              required
            />
          )}
        </div>
        <SignatureButton
          className={s.nextButton}
          onClick={() => {
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
        >
          Next
        </SignatureButton>
      </SignatureAccordion>
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
              onClick={() =>
                dispatch({ type: 'remove_expression_at_index', index: i })
              }
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
        <SignatureButton
          className={s.nextButton}
          onClick={() => {
            dispatch({
              type: 'set_accordion_open',
              accordion: 'expressions',
              open: false,
            })
          }}
        >
          Finish
        </SignatureButton>
      </SignatureAccordion>
      <props.navigationButtons
        BackButtonProps={{ disabled: true }}
        onNext={onNext}
      />
    </div>
  )
}

export function InstructionPanel() {
  return (
    <div className={s.instructions}>
      <h2>How to use</h2>
      <div className={s.how}>
        The Option Hacker will screen all the options given that satisfy one or
        multiple expressions.{' '}
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
        <h3>Option</h3>
        <div className={s.list}>
          <code>mark</code>
          <code>last</code>
          <code>daysToExpiration</code>
          <code>mark</code>
          <code>last</code>
          <code>daysToExpiration</code>
          <code>mark</code>
          <code>last</code>
          <code>daysToExpiration</code>
        </div>
        <h3>Underlying</h3>
        <div className={s.list}>
          <code>mark</code>
          <code>last</code>
          <code>close</code>
          <code>open</code>
          <code>mark</code>
          <code>last</code>
          <code>close</code>
          <code>open</code>
          <code>mark</code>
          <code>last</code>
          <code>close</code>
          <code>open</code>
        </div>
      </div>
    </div>
  )
}

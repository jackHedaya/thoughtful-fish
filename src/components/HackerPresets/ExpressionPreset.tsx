import { useState } from 'react'
import { Button, TextField } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import SignatureAccordion from '../SignatureAccordion'
import SignatureAutocomplete from '../SignatureAutocomplete'
import SignatureButton from '../SignatureButton'
import SignatureSelect from '../SignatureSelect'

import useExpressionPresetState from '../../state/useExpressionPresetState'

import s from '../../styles/components/hacker-presets/expression-preset.module.scss'

export function ExpressionPreset() {
  const [watchlistOrList, setWatchlistOrList] = useState<'Watchlist' | 'List'>(
    'Watchlist'
  )

  const [state, dispatch] = useExpressionPresetState()

  return (
    <div>
      <SignatureAccordion
        title="Setup"
        style={{ position: 'relative' }}
        expanded={state.accordionsOpen.setup}
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
                autocomplete: 'new-password',
                form: {
                  autocomplete: 'off',
                },
              }}
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
        expanded={state.accordionsOpen.expressions}
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
    </div>
  )
}

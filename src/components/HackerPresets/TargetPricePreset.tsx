import { useState } from 'react'
import { TextField } from '@material-ui/core'

import SignatureAccordion from '../SignatureAccordion'
import SignatureAutocomplete from '../SignatureAutocomplete'
import SignatureButton from '../SignatureButton'
import DollarTextField from '../DollarTextField'
import SignatureSelect from '../SignatureSelect'
import { PresetProps } from '../../pages/option-hacker'

import useTargetPricePreset from '../../state/useTargetPricePreset'

import s from '../../styles/components/option-preset.module.scss'

export default function ExpressionPreset(props: PresetProps) {
  const [watchlistOrList, setWatchlistOrList] = useState<'Watchlist' | 'List'>(
    'Watchlist'
  )

  const [state, dispatch] = useTargetPricePreset()

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
              accordion: 'targetPrice',
              open: true,
            })
          }}
        >
          Next
        </SignatureButton>
      </SignatureAccordion>
      <SignatureAccordion
        title="Target Price"
        style={{ position: 'relative' }}
        expanded={state._accordionsOpen.targetPrice}
        onChange={(_, b) =>
          dispatch({
            type: 'set_accordion_open',
            accordion: 'targetPrice',
            open: b,
          })
        }
      >
        <div className={s.watchlistSection}>
          <DollarTextField
            value={state.targetPrice}
            onChange={(e) => {
              dispatch({
                type: 'set_target_price',
                targetPrice: parseFloat(e.target.value),
              })
            }}
            variant="outlined"
            label="Target Price"
            placeholder="Target Price"
          />
          <TextField
            // Likely due to the field being empty
            value={isNaN(state.daysLeft) ? '' : state.daysLeft}
            onChange={(e) => {
              const v = e.currentTarget.value.trim()

              if (/^[0-9]*$/g.test(v)) {
                dispatch({
                  type: 'set_days_left',
                  daysLeft: parseFloat(v),
                })
              }
            }}
            label="Days Left"
            placeholder="Days Left"
            style={{ width: '200px' }}
            variant="outlined"
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
          />
        </div>
        <SignatureButton
          className={s.nextButton}
          onClick={() => {
            dispatch({
              type: 'set_accordion_open',
              accordion: 'targetPrice',
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

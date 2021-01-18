import { useState } from 'react'
import { TextField } from '@material-ui/core'

import SignatureAccordion from '../SignatureAccordion'
import SetupAccordion from './SetupAccordion'
import SignatureButton from '../SignatureButton'
import DollarTextField from '../DollarTextField'

import { PresetProps } from '../../pages/option-hacker'

import useTargetPricePreset from '../../state/useTargetPricePreset'

import s from '../../styles/components/option-preset.module.scss'

export default function TargetPricePreset(props: PresetProps) {
  const [state, dispatch] = useTargetPricePreset()

  function onNext() {
    dispatch({ type: 'prepare_for_send' })

    if (state.tickers.length > 0 && state.targetPrice !== undefined) props.onComplete(state)
  }

  return (
    <div>
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
            required
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
      <props.navigationButtons BackButtonProps={{ disabled: true }} onNext={onNext} />
    </div>
  )
}

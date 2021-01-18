import { TextField } from '@material-ui/core'

import SignatureAccordion from '../SignatureAccordion'
import SignatureButton from '../SignatureButton'
import DollarTextField from '../DollarTextField'

import { PresetProps } from '../../pages/option-hacker'

import useTargetPricePresetState from '../../state/useTargetPricePresetState'

import s from '../../styles/components/option-preset.module.scss'

export default function TargetPricePreset(props: PresetProps) {
  const [state, dispatch] = useTargetPricePresetState()

  function onNext() {
    dispatch({ type: 'prepare_for_send' })

    if (state.tickers.length > 0 && state.targetPrice !== undefined) props.onComplete(state)
  }

  return (
    <div>
      <SignatureAccordion
        title="Setup"
        expanded={state._accordionsOpen.setup}
        onChange={(_, b) => dispatch({ type: 'set_accordion_open', accordion: 'setup', open: b })}
      >
        <div className={s.watchlistSection}>
          <TextField
            value={state.tickers[0]}
            onChange={(e) =>
              dispatch({ type: 'set_tickers', tickers: [e.currentTarget.value.toUpperCase()] })
            }
            label="Ticker / Symbol"
            placeholder="AAPL"
            variant="outlined"
            required
          />
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
            style={{ width: '200px', marginTop: '15px' }}
            variant="outlined"
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
          />
          <SignatureButton
            className={s.nextButton}
            onClick={() => {
              dispatch({
                type: 'set_accordion_open',
                accordion: 'setup',
                open: false,
              })
            }}
          >
            Finish
          </SignatureButton>
        </div>
      </SignatureAccordion>
      <props.navigationButtons BackButtonProps={{ disabled: true }} onNext={onNext} />
    </div>
  )
}

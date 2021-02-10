import { TextField } from '@material-ui/core'

import { PresetProps } from '../../pages/option-hacker'
import useTargetPricePresetState from '../../state/useTargetPricePresetState'
import s from '../../styles/components/option-preset.module.scss'
import DollarTextField from '../DollarTextField'
import SignatureAccordion from '../SignatureAccordion'
import SignatureButton from '../SignatureButton'

export default function TargetPricePreset(props: PresetProps) {
  const [state, dispatch] = useTargetPricePresetState()

  function onNext() {
    dispatch({ type: 'prepare_for_send' })

    if (state.tickers.length > 0 && state.targetPrice !== undefined) props.onComplete(state)
  }

  return (
    <div onKeyPress={(e) => (e.key === 'Enter' ? onNext() : false)}>
      <SignatureAccordion
        title="Setup"
        style={{ position: 'relative' }}
        expanded={state._accordionsOpen.setup}
        onChange={(_, b) => dispatch({ type: 'set_accordion_open', accordion: 'setup', open: b })}
      >
        <div className={s.setupSection}>
          <TextField
            className={s.setupField}
            value={state.tickers[0] || ''}
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
            className={s.setupField}
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
            className={s.setupField}
            variant="outlined"
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
          />
          <SignatureButton className={s.nextButton} onClick={() => onNext()}>
            Finish
          </SignatureButton>
        </div>
      </SignatureAccordion>
      <props.navigationButtons BackButtonProps={{ disabled: true }} onNext={onNext} />
    </div>
  )
}

export function InstructionPanel() {
  return (
    <div className={s.instructions}>
      <h2>How to use</h2>
      <div className={s.how}>
        This hacker preset will show you the highest return options for a given stock, target price,
        and (optional) amount of days left
      </div>
    </div>
  )
}

import { PresetProps } from '../../pages/option-hacker'
import useExpressionPresetState from '../../state/useExpressionPresetState'
import s from '../../styles/components/option-preset.module.scss'

import SetupAccordion from './SetupAccordion'

export default function VolatilityPreset(props: PresetProps) {
  // Recycle expression preset state and rename later
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
        onNext={() => onNext()}
      />
      <props.navigationButtons BackButtonProps={{ disabled: true }} onNext={onNext} />
    </div>
  )
}

export function InstructionPanel() {
  return (
    <div className={s.instructions}>
      <h2>How to use</h2>
      <div className={s.how}>
        This hacker preset will get the implied volatility of a list of tickers to then be sorted.
      </div>
    </div>
  )
}

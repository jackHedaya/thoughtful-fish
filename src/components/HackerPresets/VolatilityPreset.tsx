import { PresetProps } from '../../pages/option-hacker'
import useExpressionPresetState from '../../state/useExpressionPresetState'

import SetupAccordion from './SetupAccordion'

export default function VolatilityPreset(props: PresetProps) {
  // Recycle expression preset state and rename later
  const [state, dispatch] = useExpressionPresetState()

  function onNext() {
    dispatch({ type: 'prepare_for_send' })

    if (state.tickers.length > 0) props.onComplete(state)
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
      <props.navigationButtons BackButtonProps={{ disabled: true }} onNext={onNext} />
    </div>
  )
}

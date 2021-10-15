import { InstructionPanel as E } from './HackerPresets/ExpressionPreset'
import { InstructionPanel as TP } from './HackerPresets/TargetPricePreset'
import { InstructionPanel as V } from './HackerPresets/VolatilityPreset'

const PRESET_TO_COMPONENT = {
  expression: E,
  target_price: TP,
  volatility: V,
}

export default function InstructionPanel(props: { preset: string }) {
  const Component = PRESET_TO_COMPONENT[props.preset]

  // Explicitly add padding to prevent layout shift
  if (!Component) return <div style={{ padding: '17px' }}></div>

  return <Component />
}

import { InstructionPanel as E } from './HackerPresets/ExpressionPreset'
import { InstructionPanel as TP } from './HackerPresets/ExpressionPreset'

const PRESET_TO_COMPONENT = {
  Expression: E,
  TargetPrice: TP,
}

export default function InstructionPanel(props: { preset: string }) {
  const Component = PRESET_TO_COMPONENT[props.preset]

  return <Component />
}

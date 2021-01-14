import { InstructionPanel as E } from './HackerPresets/ExpressionPreset'

const PRESET_TO_COMPONENT = {
  Expression: E,
  // 'Target Price': TP,
}

export default function InstructionPanel(props: { preset: string }) {
  const Component = PRESET_TO_COMPONENT[props.preset]

  if (!Component)
    return <div style={{ padding: '17px' }}></div>

  return <Component />
}

import { Dispatch, SetStateAction, useState } from 'react'
import { ExpressionPreset } from '../components/HackerPresets/ExpressionPreset'
import SignatureRadio from '../components/SignatureRadio'

import s from '../styles/pages/option-hacker.module.scss'

const PRESET_TO_COMPONENT = {
  Expression: ExpressionPreset,
}

export default function OptionHacker() {
  const [preset, setPreset] = useState('Expression')

  const PresetComponent = PRESET_TO_COMPONENT[preset]

  return (
    <div className="content">
      <div className="page-title">Option Hacker</div>
      <div className={s.hacker}>
        <div className={s.controls}>
          <PresetSetup preset={preset} setPreset={setPreset} />
          <PresetComponent />
        </div>
        <div className={s.instructions}></div>
      </div>
    </div>
  )
}

function PresetSetup(props: {
  preset: string
  setPreset: Dispatch<SetStateAction<string>>
}) {
  const { preset, setPreset } = props

  return (
    <div className={s.preset}>
      <h3>Preset</h3>
      <SignatureRadio
        items={['Expression', 'Target Price']}
        onSelect={(i) => setPreset(i)}
        selectedElement={preset}
      />
    </div>
  )
}

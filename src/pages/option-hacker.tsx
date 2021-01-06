import { IconButton, IconButtonProps, Tooltip } from '@material-ui/core'
import { ArrowBack, ArrowForward } from '@material-ui/icons'
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
      <div style={{ paddingBottom: '20px' }}>
        <IconButton className={`${s.navButton} ${s.back}`} disabled>
          <ArrowBack />
        </IconButton>
        <IconButton className={s.navButton}>
          <ArrowForward />
        </IconButton>
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

export function NavigationButtons(props: {
  onNext?: () => void
  onBack?: () => void
  WrapperProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
  NextButtonProps?: IconButtonProps
  BackButtonProps?: IconButtonProps
}) {
  return (
    <div className={s.buttonWrapper}>
      <IconButton
        {...props.BackButtonProps}
        onClick={() => props.onBack()}
        className={`${s.navButton} ${s.back} ${
          props.BackButtonProps?.className || ''
        }`}
      >
        <ArrowBack />
      </IconButton>
      <IconButton
        {...props.NextButtonProps}
        onClick={() => props.onBack()}
        className={`${s.navButton} ${props.NextButtonProps?.className || ''}`}
      >
        <ArrowForward />
      </IconButton>
    </div>
  )
}

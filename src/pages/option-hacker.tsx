import { Dispatch, SetStateAction, useState } from 'react'
import { IconButton, IconButtonProps, Tooltip } from '@material-ui/core'
import { ArrowBack, ArrowForward } from '@material-ui/icons'

import { ExpressionPreset } from '../components/HackerPresets/ExpressionPreset'
import SignatureRadio from '../components/SignatureRadio'

import s from '../styles/pages/option-hacker.module.scss'

const PRESET_TO_COMPONENT = {
  Expression: ExpressionPreset,
}

export default function OptionHacker() {
  const [preset, setPreset] = useState('Expression')

  const PresetComponent: (props: {
    navigationButtons: (props: { [key: string]: any }) => JSX.Element
  }) => JSX.Element = PRESET_TO_COMPONENT[preset]

  return (
    <div className={s.content}>
      <div className="page-title">Option Hacker</div>
      <div className={s.hacker}>
        <div className={s.controls}>
          <PresetSetup preset={preset} setPreset={setPreset} />
          <PresetComponent navigationButtons={NavigationButtons} />
        </div>
        <div className={s.instructions}>
          <h2>How to use</h2>
          <div className={s.how}>
            The Option Hacker will screen all the options given that satisfy one
            or multiple expressions.{' '}
          </div>
          <h2>Example</h2>
          <div className={s.example}>
            <Tooltip
              title={`This will find all options in the given list whose price is less
              than 25% of underlying price`}
            >
              <div className={s.textfield}>
                <span>{'(option.mark / underlying.mark < 0.25'}</span>
              </div>
            </Tooltip>
            <Tooltip
              title={`This will find all options in the given list who have more than 120 days until expiration`}
            >
              <div className={s.textfield}>
                <span>{'option.daysToExpiration > 120'}</span>
              </div>
            </Tooltip>
          </div>
          <i>Hover over example to see explanation</i>
          <h2>Variables</h2>
          <div className={s.vars}>
            <h3>Option</h3>
            <div className={s.list}>
              <code>mark</code>
              <code>last</code>
              <code>daysToExpiration</code>
              <code>mark</code>
              <code>last</code>
              <code>daysToExpiration</code>
              <code>mark</code>
              <code>last</code>
              <code>daysToExpiration</code>
            </div>
            <h3>Underlying</h3>
            <div className={s.list}>
              <code>mark</code>
              <code>last</code>
              <code>close</code>
              <code>open</code>
              <code>mark</code>
              <code>last</code>
              <code>close</code>
              <code>open</code>
              <code>mark</code>
              <code>last</code>
              <code>close</code>
              <code>open</code>
            </div>
          </div>
        </div>
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

import React, { Dispatch, SetStateAction, useState } from 'react'
import { IconButton, IconButtonProps, Slide, Tooltip } from '@material-ui/core'
import { ArrowBack, ArrowForward } from '@material-ui/icons'

import ExpressionPreset from '../../components/HackerPresets/ExpressionPreset'
import SignatureRadio from '../../components/SignatureRadio'

import s from '../../styles/pages/option-hacker.module.scss'
import { useRouter } from 'next/router'
import { PresetState } from '../../state/types'

const PRESET_TO_COMPONENT: { [k: string]: (p: PresetProps) => JSX.Element } = {
  Expression: ExpressionPreset,
}

export type PresetProps = {
  navigationButtons: (props: NavigationButtonProps) => JSX.Element
  onComplete: (state: PresetState) => void
}

export default function OptionHacker() {
  const router = useRouter()

  const [preset, setPreset] = useState('Expression')
  const [sendData, setSendData] = useState<PresetState>()

  const _PresetComponent = PRESET_TO_COMPONENT[preset]

  const [willTransition, setWillTransition] = useState(false)

  function slidOut() {}

  return (
    <div className={s.content}>
      <div className="page-title">Option Hacker</div>
      <Slide
        direction="right"
        in={!willTransition}
        onExit={slidOut}
        mountOnEnter
        unmountOnExit
      >
        <div className={s.hacker}>
          <div className={s.controls}>
            <PresetSetup preset={preset} setPreset={setPreset} />
            <div>
              <_PresetComponent
                navigationButtons={NavigationButtons}
                onComplete={(d: PresetState) => setSendData(d)}
              />
            </div>
          </div>
          <div className={s.instructions}>
            <h2>How to use</h2>
            <div className={s.how}>
              The Option Hacker will screen all the options given that satisfy
              one or multiple expressions.{' '}
            </div>
            <h2>Example</h2>
            <div className={s.example}>
              <Tooltip
                title={`This will find all options in the given list whose price is less
              than 25% of underlying price`}
              >
                <div className={s.textfield}>
                  <span>{'option.mark / underlying.mark < 0.25'}</span>
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
      </Slide>
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

type NavigationButtonProps = {
  onNext?: () => void
  onBack?: () => void
  WrapperProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
  NextButtonProps?: IconButtonProps
  BackButtonProps?: IconButtonProps
}

export function NavigationButtons(props: NavigationButtonProps) {
  return (
    <div className={s.buttonWrapper}>
      <IconButton
        {...props.BackButtonProps}
        onClick={props.onBack}
        className={`${s.navButton} ${s.back} ${
          props.BackButtonProps?.className || ''
        }`}
      >
        <ArrowBack />
      </IconButton>
      <IconButton
        {...props.NextButtonProps}
        onClick={props.onBack}
        className={`${s.navButton} ${props.NextButtonProps?.className || ''}`}
      >
        <ArrowForward />
      </IconButton>
    </div>
  )
}

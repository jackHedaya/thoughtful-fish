import { IconButton, IconButtonProps, Slide } from '@material-ui/core'
import { ArrowBack, ArrowForward } from '@material-ui/icons'
import startCase from 'lodash.startcase'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { Dispatch, SetStateAction, useState } from 'react'

import ExpressionPreset from '../../components/HackerPresets/ExpressionPreset'
import TargetPricePreset from '../../components/HackerPresets/TargetPricePreset'
import VolatilityPreset from '../../components/HackerPresets/VolatilityPreset'
import InstructionPanel from '../../components/InstructionPanel'
import SignatureRadio from '../../components/SignatureRadio'
import { authOrPassSession } from '../../middlewares/auth'
import { PresetState } from '../../state/presetBase'
import s from '../../styles/pages/option-hacker.module.scss'
import encodeJsonToUri, { Json } from '../../utils/encodeJsonToUri'

const PRESET_TO_COMPONENT: { [k: string]: (p: PresetProps) => JSX.Element } = {
  expression: ExpressionPreset,
  target_price: TargetPricePreset,
  volatility: VolatilityPreset,
}

export type PresetProps = {
  navigationButtons: (props: NavigationButtonProps) => JSX.Element
  onComplete: (state: PresetState) => void
}

type SendData = PresetState & { preset: string }

export default function OptionHacker() {
  const router = useRouter()

  const [preset, setPreset] = useState('expression')
  const [sendData, setSendData] = useState<{ [key: string]: unknown }>()

  const PresetComponent = PRESET_TO_COMPONENT[preset]

  const [willTransition, setWillTransition] = useState(false)

  /**
   * Cleans state by removing all UI variables prepended with an _
   * @param data
   */
  function cleanState(data: SendData) {
    return Object.entries(data).reduce<Partial<SendData>>((acc, [key, val]) => {
      if (key[0] !== '_') acc[key] = val
      return acc
    }, {})
  }

  function getResults() {
    console.log(encodeJsonToUri(sendData as Json))
    router.push({
      pathname: '/option-hacker/results',
      query: encodeJsonToUri(sendData as Json),
    })
  }

  return (
    <div className="content">
      <Head>
        <title>Thoughtful Fish | Option Hacker</title>
      </Head>
      <div className="page-title">Option Hacker</div>
      <Slide direction="right" in={!willTransition} onExit={getResults}>
        <div className={s.hacker}>
          <div className={s.controls}>
            <PresetSetup preset={preset} setPreset={setPreset} />
            <div>
              <PresetComponent
                navigationButtons={NavigationButtons}
                onComplete={(d: PresetState) => {
                  setSendData(cleanState({ preset, ...d }))
                  setWillTransition(true)
                }}
              />
            </div>
          </div>
          <InstructionPanel preset={preset} />
        </div>
      </Slide>
    </div>
  )
}

function PresetSetup(props: { preset: string; setPreset: Dispatch<SetStateAction<string>> }) {
  const { preset, setPreset } = props

  return (
    <div className={s.preset}>
      <h3>Preset</h3>
      <SignatureRadio
        items={Object.keys(PRESET_TO_COMPONENT).map((value) => ({
          title: startCase(value),
          value,
        }))}
        onSelect={(i) => setPreset(i)}
        selectedElement={preset}
      />
    </div>
  )
}

type NavigationButtonProps = {
  onNext?: () => void
  onBack?: () => void
  WrapperProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  NextButtonProps?: IconButtonProps
  BackButtonProps?: IconButtonProps
}

export function NavigationButtons(props: NavigationButtonProps) {
  return (
    <div className={s.buttonWrapper}>
      <IconButton
        {...props.BackButtonProps}
        onClick={props.onBack}
        className={`${s.navButton} ${s.back} ${props.BackButtonProps?.className || ''}`}
      >
        <ArrowBack />
      </IconButton>
      <IconButton
        {...props.NextButtonProps}
        onClick={props.onNext}
        className={`${s.navButton} ${props.NextButtonProps?.className || ''}`}
      >
        <ArrowForward />
      </IconButton>
    </div>
  )
}

export async function getServerSideProps(ctx: NextPageContext) {
  return authOrPassSession(ctx)
}

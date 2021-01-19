import React, { Dispatch, SetStateAction, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { IconButton, IconButtonProps, Slide } from '@material-ui/core'
import { ArrowBack, ArrowForward } from '@material-ui/icons'

import SignatureRadio from '../../components/SignatureRadio'
import InstructionPanel from '../../components/InstructionPanel'
import { PresetState } from '../../state/presetBase'

import ExpressionPreset from '../../components/HackerPresets/ExpressionPreset'
import TargetPricePreset from '../../components/HackerPresets/TargetPricePreset'

import getSession from '../../services/getSession'

import s from '../../styles/pages/option-hacker.module.scss'

const PRESET_TO_COMPONENT: { [k: string]: (p: PresetProps) => JSX.Element } = {
  Expression: ExpressionPreset,
  'Target Price': TargetPricePreset,
}

export type PresetProps = {
  navigationButtons: (props: NavigationButtonProps) => JSX.Element
  onComplete: (state: PresetState) => void
}

type SendData = PresetState & { preset: string }

export default function OptionHacker() {
  const router = useRouter()

  const [preset, setPreset] = useState('Expression')
  const [sendData, setSendData] = useState<{ [key: string]: any }>()

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
    router.push({
      pathname: '/option-hacker/results',
      query: encodeURIComponent(JSON.stringify(sendData)),
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
  const session = getSession(ctx)

  if (session === null)
    return {
      redirect: {
        permanent: false,
        destination: `/login?route=/${ctx.req.url}`,
      },
    }

  return { props: { session } }
}

import { CSSProperties } from 'react'
import s from '../styles/components/signature-button.module.scss'

type SignatureButtonProps = {
  onClick?: () => void
  children?: React.ReactNode
  /** Defaults to outlined */
  type?: 'fill' | 'outlined'
  style?: CSSProperties
  className?: string
}

export default function SignatureButton(props: SignatureButtonProps) {
  return (
    <div style={props.style} className={props.className || ''}>
      <div
        className={`${s.button}`}
        onClick={props.onClick}
      >
        {props.children}
      </div>
    </div>
  )
}

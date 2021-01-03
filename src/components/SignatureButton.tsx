import s from '../styles/components/signature-button.module.scss'

type SignatureButtonProps = {
  onClick?: () => void
  children?: React.ReactNode

  /** Defaults to outlined */
  type?: 'fill' | 'outlined'
}

export default function SignatureButton(props: SignatureButtonProps) {
  return (
    <div
      className={`${s.button} ${s[props.type || 'outlined']}`}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  )
}

import s from '../styles/components/signature-button.module.scss'

type SignatureButtonProps = {
  onClick?: () => void
  children?: React.ReactNode
}

export default function SignatureButton(props: SignatureButtonProps) {
  return (
    <div className={s.button} onClick={props.onClick}>
      {props.children}
    </div>
  )
}

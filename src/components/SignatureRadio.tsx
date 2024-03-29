import s from '../styles/components/signature-radio.module.scss'

import SignatureButton from './SignatureButton'

type SignatureRadioProps = {
  selectedElement: string
  onSelect: (s: string) => void
  items: { title: string; value: string }[]
}

export default function SignatureRadio(props: SignatureRadioProps) {
  return (
    <div className={s.radio}>
      {props.items.map((item) => (
        <SignatureButton
          key={`SignatureRadio/${item}`}
          onClick={() => props.onSelect(item.value)}
          type={props.selectedElement === item.value ? 'fill' : 'outlined'}
        >
          {item.title}
        </SignatureButton>
      ))}
    </div>
  )
}

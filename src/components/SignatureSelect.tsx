import { CSSProperties } from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'

type SignatureSelectProps = (ItemObjectProps | StringObjectProps) & {
  label?: string
  className?: string
  style?: CSSProperties
}

type ItemObjectProps = {
  value: ItemValue
  items: ItemObject[]
  onChange: (v: ItemValue) => void
}

type StringObjectProps = {
  value: string
  items: string[]
  onChange: (v: string) => void
}

type ItemObject = {
  value: ItemValue
  label: string
}

type ItemValue = string | number | readonly string[]

export default function SignatureSelect(props: SignatureSelectProps) {
  const { items } = props

  return (
    <FormControl variant="outlined" style={props.style}>
      <InputLabel>
        {props.label}
      </InputLabel>
      <Select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value as any)}
        label={props.label}
      >
        {(items as Array<ItemObject | string>).map((item, i) => {
          const value = typeof item === 'string' ? item : item.value
          const label = typeof item === 'string' ? item : item.label

          return (
            <MenuItem value={value} key={`${label}/${value} ${i}`}>
              {label}
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}

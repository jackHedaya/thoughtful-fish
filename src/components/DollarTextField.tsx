import NumberFormat from 'react-number-format'
import { TextField, TextFieldProps } from '@material-ui/core'

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        })
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  )
}
export default function DollarTextField(props: TextFieldProps) {
  return (
    <TextField
      {...props}
      InputProps={{
        inputComponent: NumberFormatCustom,
      }}
    />
  )
}

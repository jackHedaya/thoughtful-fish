import { TextField, TextFieldProps } from '@material-ui/core'
import NumberFormat, { NumberFormatProps } from 'react-number-format'

function NumberFormatCustom(props: NumberFormatProps) {
  const { inputRef, onChange, ...other } = props

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.value,
          },

          // Little sloppy here: not an actual event. Definitely should fix later
        } as React.ChangeEvent<HTMLInputElement>)
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

import React, { CSSProperties } from 'react'
import useAutocomplete from '@material-ui/lab/useAutocomplete'
import { CircularProgress, TextField, TextFieldProps } from '@material-ui/core'

import s from '../styles/components/signature-autocomplete.module.scss'

type SignatureAutocomplete = {
  options: DropdownOption[]
  title: string
  loading?: boolean
  className?: string
  style?: CSSProperties
  TextFieldProps?: TextFieldProps
  onChange?: (option: DropdownOption) => void
}

type DropdownOption = { group: string; value: any; label: string }

export default function SignatureAutocomplete(props: SignatureAutocomplete) {
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    autoComplete: true,
    options: props.loading ? [{ group: '', label: 'Loading...', value: '' }] : props.options,
    groupBy: (x) => x.group,
    getOptionLabel: (x) => x.label,
    getOptionSelected: (option, value) =>
      option.group === value.group && option.label === option.label,
    onChange: (_, option: DropdownOption) => {
      props.onChange?.(option)

      // Create fake event that contains option label
      // This is done to allow input to be controlled by parent
      props.TextFieldProps?.onChange?.({
        currentTarget: { value: option.label },
      } as React.ChangeEvent<HTMLInputElement>)
    },
  })

  let indexIncrement = -1

  return (
    <div style={props.style} className={props.className}>
      <div {...getRootProps()}>
        <TextField
          {...getInputProps()}
          className={`${groupedOptions.length < 1 ? s.noneFound : ''} ${props.className || ''}`}
          label={props.title}
          variant="outlined"
          style={{ width: '100%' }}
          {...props.TextFieldProps}
          InputProps={{ endAdornment: props.loading ? <CircularProgress /> : null }}
        />
      </div>
      <div>
        {groupedOptions.length > 0 ? (
          <div className={s.listbox} {...getListboxProps()}>
            {groupedOptions.map((group) => {
              return (
                <React.Fragment key={`Label/${group.group}`}>
                  <div className={s.groupTitle}>{group.group}</div>
                  {/* @ts-ignore */}
                  {group.options.map((option) => {
                    indexIncrement++

                    return (
                      <div
                        {...getOptionProps({ option, index: indexIncrement })}
                        key={`${option.group}/${option.label}`}
                        className={s.itemName}
                      >
                        {option.label}
                      </div>
                    )
                  })}
                </React.Fragment>
              )
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}

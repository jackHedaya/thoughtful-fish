import React, { CSSProperties } from 'react'
import useAutocomplete from '@material-ui/lab/useAutocomplete'
import { TextField, TextFieldProps } from '@material-ui/core'

import s from '../styles/components/signature-autocomplete.module.scss'

type SignatureAutocomplete = {
  options: { group: string; value: string }[]
  title: string
  className?: string
  style?: CSSProperties
  TextFieldProps?: TextFieldProps
}

export default function SignatureAutocomplete(props: SignatureAutocomplete) {
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    options: props.options,
    groupBy: (x) => x.group,
    getOptionLabel: (x) => x.value,
  })

  return (
    <div style={props.style} className={props.className}>
      <div {...getRootProps()}>
        <TextField
          {...getInputProps()}
          className={`${groupedOptions.length < 1 ? s.noneFound : ''} ${
            props.className || ''
          }`}
          label={props.title}
          variant="outlined"
          {...props.TextFieldProps}
        />
      </div>
      <div>
        {groupedOptions.length > 0 ? (
          <div className={s.listbox} {...getListboxProps()}>
            {groupedOptions.map((group, index) => {
              return (
                <React.Fragment key={`Label/${group.group}`}>
                  <div className={s.groupTitle}>{group.group}</div>
                  {/* @ts-ignore */}
                  {group.options.map((option) => {
                    return (
                      <div
                        {...getOptionProps({ option, index })}
                        key={`${option.group}/${option.value}`}
                        className={s.watchlistName}
                      >
                        {option.value}
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

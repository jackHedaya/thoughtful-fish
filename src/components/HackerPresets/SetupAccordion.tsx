import { useState } from 'react'
import { TextField } from '@material-ui/core'
import SignatureAccordion from '../SignatureAccordion'
import SignatureSelect from '../SignatureSelect'
import SignatureAutocomplete from '../SignatureAutocomplete'
import SignatureButton from '../SignatureButton'

import s from '../../styles/components/option-preset.module.scss'

type SetupAccordionProps = {
  expanded: boolean
  onExpandedChange: (isOpen: boolean) => void
  tickers: string[]
  setTickers: (tickers: string[]) => void
  onNext: () => void
}

export default function SetupAccordion(props: SetupAccordionProps) {
  const [watchlistOrList, setWatchlistOrList] = useState<'Watchlist' | 'List'>('Watchlist')

  return (
    <SignatureAccordion
      title="Setup"
      style={{ position: 'relative' }}
      expanded={props.expanded}
      onChange={(_, b) => props.onExpandedChange(b)}
    >
      <div className={s.watchlistSection}>
        <SignatureSelect
          label="Watchlist / List"
          className={s.watchlistOrList}
          items={['Watchlist', 'List']}
          onChange={(e) => setWatchlistOrList(e)}
          value={watchlistOrList}
        />
        {watchlistOrList === 'Watchlist' ? (
          <SignatureAutocomplete
            className={s.selectWatchlist}
            title="Select Watchlist"
            options={[
              { group: "jackehedaya's Watchlists", value: 'Hello' },
              { group: "jackehedaya's Watchlists", value: 'World' },
              { group: "john's Watchlists", value: 'World' },
            ]}
            TextFieldProps={{ required: true }}
          />
        ) : (
          <TextField
            className={s.selectWatchlist}
            value={props.tickers.join(',')}
            onChange={(e) =>
              props.setTickers(e.currentTarget.value.split(',').map((x) => x.trim().toUpperCase()))
            }
            label="Ticker List"
            placeholder="Comma seperated list"
            variant="outlined"
            inputProps={{
              autoComplete: 'new-password',
              form: {
                autoComplete: 'off',
              },
            }}
            required
          />
        )}
      </div>
      <SignatureButton className={s.nextButton} onClick={props.onNext}>
        Next
      </SignatureButton>
    </SignatureAccordion>
  )
}

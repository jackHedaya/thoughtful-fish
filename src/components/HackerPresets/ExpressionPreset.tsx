import { useState } from 'react'

import SignatureAccordion from '../SignatureAccordion'
import SignatureAutocomplete from '../SignatureAutocomplete'
import SignatureButton from '../SignatureButton'
import SignatureSelect from '../SignatureSelect'

import s from '../../styles/components/hacker-presets/expression-preset.module.scss'
import { TextField } from '@material-ui/core'

export function ExpressionPreset() {
  const [watchlistOrList, setWatchlistOrList] = useState<'Watchlist' | 'List'>(
    'Watchlist'
  )
  const [tickerList, setTickerList] = useState<string[]>([])

  return (
    <div>
      <SignatureAccordion title="Setup" style={{ position: 'relative' }}>
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
            />
          ) : (
            <TextField
              className={s.selectWatchlist}
              value={tickerList.join(',')}
              onChange={(e) =>
                setTickerList(
                  e.currentTarget.value
                    .split(',')
                    .map((x) => x.trim().toUpperCase())
                )
              }
              label="Ticker List"
              placeholder="Comma seperated list"
              variant="outlined"
              inputProps={{
                autocomplete: 'new-password',
                form: {
                  autocomplete: 'off',
                },
              }}
            />
          )}
        </div>
        <SignatureButton className={s.nextButton}>Next</SignatureButton>
      </SignatureAccordion>
    </div>
  )
}
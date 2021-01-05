import { useState } from 'react'

import SignatureAccordion from '../SignatureAccordion'
import SignatureAutocomplete from '../SignatureAutocomplete'
import SignatureButton from '../SignatureButton'
import SignatureSelect from '../SignatureSelect'

import s from '../../styles/components/hacker-presets/expression-preset.module.scss'

export function ExpressionPreset() {
  const [watchlistOrList, setWatchlistOrList] = useState('Watchlist')

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
          <SignatureAutocomplete
            className={s.selectWatchlist}
            title="Select Watchlist"
            options={[
              { group: "jackehedaya's Watchlists", value: 'Hello' },
              { group: "jackehedaya's Watchlists", value: 'World' },
              { group: "john's Watchlists", value: 'World' },
            ]}
          />
        </div>
        <SignatureButton className={s.nextButton}>Next</SignatureButton>
      </SignatureAccordion>
    </div>
  )
}

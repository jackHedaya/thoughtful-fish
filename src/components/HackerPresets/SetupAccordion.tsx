import { TextField } from '@material-ui/core'
import { useState } from 'react'

import useRequest from '../../hooks/useRequest'
import useSession from '../../hooks/useSession'
import s from '../../styles/components/option-preset.module.scss'
import SignatureAccordion from '../SignatureAccordion'
import SignatureAutocomplete from '../SignatureAutocomplete'
import SignatureButton from '../SignatureButton'
import SignatureSelect from '../SignatureSelect'

type SetupAccordionProps = {
  expanded: boolean
  onExpandedChange: (isOpen: boolean) => void
  tickers: string[]
  setTickers: (tickers: string[]) => void
  onNext: () => void
}

export default function SetupAccordion(props: SetupAccordionProps) {
  const [watchlistOrList, setWatchlistOrList] = useState<'Watchlist' | 'List'>('Watchlist')
  const [watchlistField, setWatchlistField] = useState('')
  const session = useSession()

  const {
    data = {},
    response,
    error,
  } = useRequest<{
    [accountId: string]: Watchlist[]
  }>({
    url: '/api/watchlists',
  })

  const watchlists = Object.entries(data).flatMap(([accountNumber, watchlists]) =>
    watchlists.map((watchlist) => ({
      label: watchlist.name,
      group: getAccountNameByNumber(accountNumber),
      value: watchlist,
    }))
  )

  function getAccountNameByNumber(accountNumber: string) {
    const profile = session.profile
    const accountNumbersToName = { [profile.primaryAccountId]: profile.userId }

    profile.accounts.forEach(
      (account) => (accountNumbersToName[account.accountId] = account.displayName)
    )

    return accountNumbersToName[accountNumber]
  }

  function getTickersFromWatchlist(watchlist: Watchlist): string[] {
    return watchlist.watchlistItems.reduce((acc, item) => [...acc, item.instrument.symbol], [])
  }

  return (
    <SignatureAccordion
      title="Setup"
      style={{ position: 'relative' }}
      expanded={props.expanded}
      onChange={(_, b) => props.onExpandedChange(b)}
    >
      <div className={s.setupSection}>
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
            options={watchlists}
            TextFieldProps={{
              required: true,
              value: watchlistField,
              onChange: (e) => setWatchlistField(e.currentTarget.value),
            }}
            onChange={(option) =>
              props.setTickers(getTickersFromWatchlist(option.value as Watchlist))
            }
            loading={!error && !response}
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

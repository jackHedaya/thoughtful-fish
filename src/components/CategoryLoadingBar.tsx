import { Tooltip } from '@material-ui/core'

import s from '../styles/components/category-loading-bar.module.scss'
import generateTickersTitle from '../utils/generateTickersTitle'

type CategoryLoadingBarProps = {
  successTickers: string[]
  errorTickers: string[]
  totalCount: number
}

export default function CategoryLoadingBar(props: CategoryLoadingBarProps) {
  const { successTickers, errorTickers, totalCount } = props

  const successCount = successTickers.length
  const errorCount = errorTickers.length

  return (
    <div className={s.loadingBar}>
      <Tooltip
        title={`Successfully loaded ${generateTickersTitle(successTickers)}`}
        enterDelay={2000}
      >
        <div
          className={s.success}
          style={{
            flexGrow: successCount / totalCount,
            borderRadius: errorCount !== 0 ? undefined : s.borderRadius,
          }}
        ></div>
      </Tooltip>
      <Tooltip title={`Failed to load ${generateTickersTitle(errorTickers)}`} enterDelay={2000}>
        <div
          className={s.errored}
          style={{
            flexGrow: errorCount / totalCount,
            borderRadius: successCount !== 0 ? undefined : s.borderRadius,
          }}
        ></div>
      </Tooltip>
    </div>
  )
}

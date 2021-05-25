import { ArrowDropDownSharp, ArrowDropUpSharp, DragIndicator } from '@material-ui/icons'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable'
import { AutoSizer, Column, SortDirection, Table } from 'react-virtualized'

import 'react-virtualized/styles.css'
import s from '../styles/components/option-table.module.scss'

type OptionTableProps = {
  headers: TableHeader[]
  options: Partial<OptionExtension>[]
  sortBy: string
  sortDirection: 'ASC' | 'DESC' | null
  onSort: (sortBy: string) => void
}
type TableHeader = { label: string; key: string }

export default function OptionTable(props: OptionTableProps) {
  const { headers, options, sortBy, onSort, sortDirection } = props

  const cellMinWidth = headers.length * getPixelNumber(s.cellMinWidth)
  const wrapperRef = useRef(null)

  // Needed to prevent a bug where overflow changing hides columns
  useEffect(() => {
    wrapperRef.current?.scrollTo(0, 0)
  }, [wrapperRef.current?.isScrollable])

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})

  /** Resets column widths on header added */
  useEffect(() => {
    setColumnWidths(
      headers.reduce(
        (p, a) => ({
          ...p,
          [a.key]: 1 / headers.length,
        }),
        {}
      )
    )
  }, [headers, headers.length])

  type HeaderRendererProps = {
    dataKey: string
    label: string
    columnData: { totalWidth: number; index: number }
  }

  function HeaderRenderer(props: HeaderRendererProps) {
    const { dataKey, label, columnData } = props

    const resizeRow = ({ dataKey, deltaX }) => {
      const percentDelta = deltaX / columnData.totalWidth

      const nextDataKey = headers[columnData.index + 1].key

      setColumnWidths({
        ...columnWidths,
        [dataKey]: columnWidths[dataKey] + percentDelta,
        [nextDataKey]: columnWidths[nextDataKey] - percentDelta,
      })
    }

    return (
      <Fragment key={dataKey}>
        <div className={s.headerTruncated}>{label}</div>
        {sortBy === dataKey ? (
          sortDirection === SortDirection.ASC ? (
            <ArrowDropUpSharp />
          ) : (
            <ArrowDropDownSharp />
          )
        ) : null}

        {columnData.index !== headers.length - 1 && (
          <Draggable
            axis="x"
            defaultClassName={s.dragHandle}
            defaultClassNameDragging={s.dragHandleActive}
            onDrag={(event, { deltaX }) =>
              resizeRow({
                dataKey,
                deltaX,
              })
            }
            position={{ x: 0, y: 0 }}
          >
            <DragIndicator className={s.dragHandleIcon} />
          </Draggable>
        )}
      </Fragment>
    )
  }

  return (
    <div className={s.table} ref={wrapperRef}>
      <AutoSizer>
        {({ width, height }) => {
          // This is needed to prevent a bug where overflow is changed and the scrollbar is stuck
          if (wrapperRef.current)
            if (width < cellMinWidth) wrapperRef.current.isScrollable = true
            else wrapperRef.current.isScrollable = false

          return (
            <Table
              // Subtract of 5 to account for border thickness causing unnecessary scroll
              width={width < cellMinWidth ? cellMinWidth : width - 5}
              height={height}
              headerHeight={parseInt(s.headerHeight)}
              onHeaderClick={(h) => h.dataKey}
              sortBy={sortBy}
              sortDirection={sortDirection}
              sort={({ sortBy }) => onSort(sortBy)}
              rowCount={options.length}
              rowHeight={getPixelNumber(s.rowHeight)}
              rowGetter={({ index }) => options[index]}
              className={s.tableGrid}
              headerClassName={s.header}
            >
              {headers.map(({ key, label }, index) => (
                <Column
                  className={`${s.cell} ${sortBy === key ? s.sortingBy : undefined}`}
                  label={label}
                  width={columnWidths[key] * width}
                  dataKey={key}
                  columnData={{ totalWidth: width, index }}
                  headerRenderer={HeaderRenderer}
                  headerClassName={sortBy === key ? s.sortingBy : undefined}
                  cellRenderer={({ rowData: option }) => (
                    <span className={key === 'symbol' ? s.symbol : undefined}>
                      {key === 'symbol' && option.inTheMoney ? (
                        <div className={s.itm}>ITM</div>
                      ) : null}

                      {option[key]}
                    </span>
                  )}
                  key={`Column/${key}`}
                />
              ))}
            </Table>
          )
        }}
      </AutoSizer>
    </div>
  )
}

const getPixelNumber = (px: string) => parseFloat(px.match(/(\d*)px/)?.[1]) || null

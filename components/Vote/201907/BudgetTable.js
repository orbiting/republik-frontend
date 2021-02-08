import React from 'react'
import { css, merge } from 'glamor'
import voteT from '../voteT'
import { fontFamilies } from '@project-r/styleguide'
import { countFormat, swissNumbers } from '../../../lib/utils/format'

const percentFormat = swissNumbers.format('.1%')
const percentFormatTotal = swissNumbers.format('.0%')

const td = css({
  textAlign: 'left',
  verticalAlign: 'top',
  paddingTop: 2,
  paddingBottom: 2
})

const num = merge(td, {
  textAlign: 'right',
  fontFeatureSettings: '"tnum" 1, "kern" 1'
})

const groupTd = css({
  paddingTop: 5,
  borderTopWidth: 1,
  borderTopStyle: 'solid',
  verticalAlign: 'bottom',
  'tr:first-child > &': {
    paddingTop: 50
  },
  'tr:last-child > &': {
    marginTop: 10
  }
})

const styles = {
  table: css({
    fontFamily: fontFamilies.sansSerifRegular,
    borderSpacing: '0 2px',
    minWidth: '100%',
    marginTop: 15,
    fontSize: 14,
    '@media (max-width: 600px)': {},
    '& th': {
      fontFamily: fontFamilies.sansSerifMedium,
      fontWeight: 'normal'
    }
  }),
  td,
  num,
  groupTd: merge(td, groupTd),
  groupTdNum: merge(num, groupTd),
  highlight: css({
    fontFamily: fontFamilies.sansSerifMedium,
    fontWeight: 'normal'
  })
}

const Table = ({ children }) => (
  <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
    <table {...styles.table}>{children}</table>
  </div>
)

const BudgetTable = ({ vt, data, total, pk, sk, fraction }) => {
  const singleRow = data && data.length === 1
  return (
    <Table>
      <thead>
        <tr>
          <th {...styles.td}>{vt('vote/201907/budget/table/label')}</th>
          <th {...styles.num}>{vt('vote/201907/budget/table/staff')}</th>
          <th {...styles.num}>{vt('vote/201907/budget/table/material')}</th>
          <th {...styles.num}>{vt('vote/201907/budget/table/sum')}</th>
          <th {...styles.num}>{vt('vote/201907/budget/table/fraction')}</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ label, total, pk, sk, fraction }, i) => (
          <tr key={`row${i}`}>
            <td {...styles.td}>{label}</td>
            <td {...styles.num}>{countFormat(pk / 1000)}</td>
            <td {...styles.num}>{countFormat(sk / 1000)}</td>
            <td {...styles.num}>{countFormat(total / 1000)}</td>
            <td {...styles.num}>
              {singleRow
                ? `~${percentFormatTotal(fraction)}`
                : percentFormat(fraction)}
            </td>
          </tr>
        ))}
        {!singleRow && (
          <tr>
            <th {...styles.groupTd}>Total</th>
            <th {...styles.groupTdNum}>{countFormat(pk / 1000)}</th>
            <th {...styles.groupTdNum}>{countFormat(sk / 1000)}</th>
            <th {...styles.groupTdNum}>{countFormat(total / 1000)}</th>
            <th {...styles.groupTdNum}>~{percentFormatTotal(fraction)}</th>
          </tr>
        )}
      </tbody>
    </Table>
  )
}

export default voteT(BudgetTable)

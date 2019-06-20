import React from 'react'
import { css, merge } from 'glamor'
import { formatLocale } from 'd3-format'

import {
  fontFamilies
} from '@project-r/styleguide'

const nbspNumbers = formatLocale({
  decimal: ',',
  thousands: '\u202F',
  grouping: [3],
  currency: ['CHF\u00a0', '']
})
const countFormat = nbspNumbers.format(',.0f')
const percentFormat = nbspNumbers.format(' 05.1%')

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
  borderTop: '1px solid #000',
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
    // paddingLeft: 5,
    // paddingRight: 5,
    minWidth: '100%',
    marginTop: 15,
    fontSize: 14,
    '@media (max-width: 600px)': {

    },
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
    <table {...styles.table}>
      {children}
    </table>
  </div>
)

export default ({ data, total, pk, sk, fraction }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th {...styles.td}>Bereich</th>
          <th {...styles.num}>PK</th>
          <th {...styles.num}>SK</th>
          <th {...styles.num}>Total</th>
          <th {...styles.num}>GB</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ label, amount, pk, sk, fraction }, i) => (
          <tr key={`row${i}`}>
            <td {...styles.td}>{label}</td>
            <td {...styles.num}>{countFormat(pk / 1000)}</td>
            <td {...styles.num}>{countFormat(sk / 1000)}</td>
            <td {...styles.num}>{countFormat(amount / 1000)}</td>
            <td {...styles.num}>{percentFormat(fraction)}</td>
          </tr>
        )

        )}
        <tr>
          <th {...styles.groupTd}>Total</th>
          <th {...styles.groupTdNum}>{countFormat(pk / 1000)}</th>
          <th {...styles.groupTdNum}>{countFormat(sk / 1000)}</th>
          <th {...styles.groupTdNum}>{countFormat(total / 1000)}</th>
          <th {...styles.groupTdNum}>{percentFormat(fraction)}</th>
        </tr>
      </tbody>
    </Table>
  )
}

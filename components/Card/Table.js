import React from 'react'
import { css, merge } from 'glamor'

import {
  fontFamilies, Editorial
} from '@project-r/styleguide'

import { Link } from '../../lib/routes'

const PADDING = 12

const td = css({
  textAlign: 'left',
  verticalAlign: 'top',
  paddingTop: 3,
  paddingBottom: 3
})

const num = merge(td, {
  textAlign: 'right',
  fontFeatureSettings: '"tnum" 1, "kern" 1'
})

const groupTd = css({
  paddingTop: 10,
  borderBottom: '1px solid #000',
  verticalAlign: 'bottom',
  'tr:first-child > &': {
    paddingTop: 3
  },
  'tr:last-child > &': {
    borderBottom: 'none'
  }
})

const styles = {
  table: css({
    fontFamily: fontFamilies.sansSerifRegular,
    borderSpacing: '10px 0',
    paddingLeft: 0,
    paddingRight: 0,
    minWidth: '100%',
    '@media (max-width: 600px)': {
      fontSize: 14
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
  <div style={{ overflowX: 'auto', overflowY: 'hidden', marginLeft: -PADDING, marginRight: -PADDING }}>
    <table {...styles.table}>
      {children}
    </table>
  </div>
)

export default ({ cards }) => (
  <Table>
    <thead>
      <tr>
        <th {...styles.td}>Name</th>
        <th {...styles.num}>Nr.</th>
        <th {...styles.td}>Partei</th>
        <th {...styles.num}>Jahrgang</th>
      </tr>
    </thead>
    <tbody>
      {cards.map((card, i) => {
        return <tr key={`entity${i}`}>
          <td {...styles.td}>
            <Link route='profile' params={{ slug: card.user.slug }} passHref>
              <Editorial.A>{card.user.name}</Editorial.A>
            </Link>

          </td>
          <td {...styles.num}>{[
            card.payload.councilOfStates.candidacy && 'SR',
            ...card.payload.nationalCouncil.listNumbers
          ].filter(Boolean).join(' & ')}</td>
          <td {...styles.td}>{card.payload.party}</td>
          <td {...styles.num}>{card.payload.yearOfBirth}</td>
        </tr>
      })}
    </tbody>
  </Table>
)

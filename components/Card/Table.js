import React from 'react'
import { css, merge } from 'glamor'

import IgnoreIcon from './IgnoreIcon'
import FollowIcon from 'react-icons/lib/md/notifications-active'
import RevertIcon from 'react-icons/lib/md/rotate-left'

import {
  fontFamilies, Editorial, plainButtonRule, InlineSpinner, colors
} from '@project-r/styleguide'

import { Link } from '../../lib/routes'

import { cardColors } from './constants'

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
  }),
  actionButton: css(plainButtonRule, {
    lineHeight: 0,
    borderRadius: '50%',
    padding: 4,
    '& + &': {
      marginLeft: 3
    }
  })
}

export const Table = ({ children }) => (
  <div style={{ overflowX: 'auto', overflowY: 'hidden', marginLeft: -PADDING, marginRight: -PADDING }}>
    <table {...styles.table}>
      <tbody>
        {children}
      </tbody>
    </table>
  </div>
)

export const TitleRow = ({ children }) => (
  <tr>
    <th colSpan='4' {...styles.td} style={{ paddingTop: 10 }}>
      {children}
    </th>
  </tr>
)

export const CardRows = ({ nodes, revertCard, ignoreCard, followCard, t }) => (
  <>
    <tr>
      <th {...styles.td}>Name</th>
      <th {...styles.num}>Nr.</th>
      <th {...styles.td} />
      <th {...styles.num} />
      <th style={{ width: 82 }} />
    </tr>
    {nodes.map(({ card, sub, pending }, i) => {
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
        <td style={{
          verticalAlign: 'top'
        }}>
          {pending ? <InlineSpinner size={20} /> : <>
            <button {...styles.actionButton}
              title={t('components/Card/Group/revert')}
              onClick={(e) => {
                e.preventDefault()
                revertCard(card)
              }}
              style={{
                backgroundColor: cardColors.revert
              }}
            >
              <RevertIcon fill='#fff' size={16} />
            </button>
            <button {...styles.actionButton}
              title={t('components/Card/Group/ignore')}
              onClick={(e) => {
                e.preventDefault()
                ignoreCard && ignoreCard(card)
              }}
              style={{
                backgroundColor: ignoreCard ? cardColors.left : colors.disabled,
                cursor: ignoreCard ? 'pointer' : 'default'
              }}
            >
              <IgnoreIcon fill='#fff' size={16} />
            </button>
            <button {...styles.actionButton}
              title={t('components/Card/Group/follow')}
              onClick={(e) => {
                e.preventDefault()
                followCard && followCard(card)
              }}
              style={{
                backgroundColor: followCard ? cardColors.right : colors.disabled,
                cursor: followCard ? 'pointer' : 'default'
              }}
            >
              <FollowIcon fill='#fff' size={16} />
            </button>
          </>}
        </td>
      </tr>
    })}
  </>
)

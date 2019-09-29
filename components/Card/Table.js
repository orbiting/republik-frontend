import React, { Fragment } from 'react'
import { css, merge } from 'glamor'
import { nest } from 'd3-collection'
import { ascending } from 'd3-array'

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

export const TitleRow = ({ children, first }) => (
  <tr>
    <th colSpan='3' {...styles.td} style={{ paddingTop: first ? 0 : 10 }}>
      {children}
    </th>
  </tr>
)

export const CardRows = ({ nodes, revertCard, ignoreCard, followCard, t }) => (
  <>
    {nest()
      .key(({ card: { payload } }) => payload.party)
      .sortValues((a, b) => ascending(
        a.card.payload.nationalCouncil.listNumbers[0],
        b.card.payload.nationalCouncil.listNumbers[0]
      ))
      .entries(nodes)
      .map(({ key, values: cards }, listI) => (
        <Fragment key={key}>
          <tr>
            <th colSpan='2' {...styles.td} style={{
              paddingTop: 10, paddingBottom: 5
            }}>
              {key}
            </th>
            <th {...styles.num} style={{
              paddingTop: 10, paddingBottom: 5
            }}>
              Nr.
            </th>
          </tr>
          {cards.map(({ card, sub, pending }, i) => {
            return <tr key={`entity${i}`}>
              <td style={{
                verticalAlign: 'top',
                whiteSpace: 'nowrap',
                width: 85
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
              <td {...styles.td}>
                <Link route='profile' params={{ slug: card.user.slug }} passHref>
                  <Editorial.A>
                    {card.user.name}
                    {card.payload.yearOfBirth && `, ${card.payload.yearOfBirth}`}
                  </Editorial.A>
                </Link>
              </td>
              <td {...styles.num}>{[
                card.payload.councilOfStates.candidacy && 'SR',
                card.payload.nationalCouncil.listNumbers[0]
              ].filter(Boolean).join(' & ')}</td>
            </tr>
          })}
        </Fragment>
      ))}
  </>
)

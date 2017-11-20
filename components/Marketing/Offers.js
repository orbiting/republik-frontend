import React from 'react'
import withT from '../../lib/withT'
import { Link } from '../../lib/routes'
import { css } from 'glamor'
import { colors, mediaQueries } from '@project-r/styleguide'
import ChevronRightIcon from 'react-icons/lib/md/chevron-right'

const styles = {
  offer: css({
    margin: 0,
    padding: 0,
    '& > li': {
      borderTop: `1px solid ${colors.divider}`,
      display: 'block',
      padding: '10px 0',
      position: 'relative'
    },
    '& > li a': {
      color: colors.text,
      display: 'block',
      textDecoration: 'none',
      fontSize: '17px',
      lineHeight: '22px',
      [mediaQueries.mUp]: {
        fontSize: '20px',
        lineHeight: '24px'
      },
      verticalAlign: 'middle'
    }
  }),
  icon: css({
    position: 'absolute',
    right: '5px',
    verticalAlign: 'middle'
  })
}

const offers = [
  {
    key: 'patron'
  },
  {
    key: 'other'
  },
  {
    key: 'lower'
  },
  {
    key: 'voucher'
  },
  {
    key: 'monthly'
  }
]

export default withT(({ t }) => (
  <ul {...styles.offer}>
    {offers.map(offer => (
      <li key={offer.key}>
        <Link route='pledge'>
          <a>
            {t(`marketing/offers/${offer.key}`)}{' '}
            <ChevronRightIcon size={30} {...styles.icon} />
          </a>
        </Link>
      </li>
    ))}
  </ul>
))

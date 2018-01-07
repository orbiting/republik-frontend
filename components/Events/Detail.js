import React from 'react'
import {css} from 'glamor'

import {parseDate, swissTime} from '../../lib/utils/format'
import {intersperse} from '../../lib/utils/helpers'
import withT from '../../lib/withT'

import {
  Interaction, A, colors,
  fontFamilies, mediaQueries
} from '@project-r/styleguide'

import {CONTENT_PADDING} from '../constants'

import Share from '../Share'

import {
  PUBLIC_BASE_URL
} from '../../lib/constants'

const BLOCK_PADDING_TOP = 10

const styles = {
  container: css({
    marginBottom: 60
  }),
  block: css({
    padding: `${BLOCK_PADDING_TOP}px 0`,
    borderTop: `1px solid ${colors.divider}`,
    position: 'relative',
    [mediaQueries.mUp]: {
      paddingLeft: CONTENT_PADDING
    }
  }),
  hr: css({
    height: 0,
    border: 0,
    borderTop: `1px solid ${colors.divider}`
  }),
  title: css({
    marginBottom: 15
  }),
  label: css({
    fontSize: 17,
    fontFamily: fontFamilies.sansSerifMedium,
    [mediaQueries.mUp]: {
      lineHeight: '25px',
      position: 'absolute',
      left: 0,
      top: BLOCK_PADDING_TOP + 3
    }
  })
}

const Label = ({children}) => (
  <div {...styles.label}>{children}</div>
)

const {H1, P} = Interaction

const weekday = swissTime.format('%A')

const Event = withT(({
  t,
  data: {
    title,
    description,
    link,
    date: rawDate,
    time,
    where,
    locationLink,
    slug
  }
}) => {
  const date = parseDate(rawDate)
  let location = !!where && intersperse(
    where.split('\n'),
    (d, i) => <br key={i} />
  )
  if (locationLink && location) {
    location = (
      <A href={locationLink} target='_blank'>
        {location}
      </A>
    )
  }

  return (
    <div {...styles.container}>
      <div {...styles.block}>
        <Label>{t('events/labels/description')}</Label>
        <H1 {...styles.title}>{title}</H1>
        <P>
          {intersperse(
            (description || '').split('\n'),
            (d, i) => <br key={i} />
          )}
        </P>
        {!!link && (
          <P>
            <A href={link} target='_blank'>
              {link}
            </A>
          </P>
        )}
      </div>

      <div {...styles.block}>
        <Label>{t('events/labels/date')}</Label>
        <P>{[
          weekday(date),
          rawDate,
          time
        ].join(', ')}</P>
      </div>

      <div {...styles.block}>
        {!!where && <Label>{t('events/labels/location')}</Label>}
        {!!where && <P>{location}</P>}
        {!!where && <hr {...styles.hr} />}
        <P>
          <Share
            url={`${PUBLIC_BASE_URL}/events/${slug}`}
            emailSubject={title}
            tweet={title} />
        </P>
      </div>
    </div>
  )
})

export default Event

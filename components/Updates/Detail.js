import React from 'react'
import {css} from 'glamor'

import {swissTime} from '../../lib/utils/format'
import withT from '../../lib/withT'

import {
  H1, P, RawHtml, colors,
  fontFamilies, mediaQueries
} from '@project-r/styleguide'

import {CONTENT_PADDING} from '../constants'

import Share from '../Share'

import {
  PUBLIC_BASE_URL
} from '../../lib/constants'

const BLOCK_PADDING_TOP = 10

const styles = {
  title: css({
    marginBottom: 15,
    [mediaQueries.onlyS]: {
      fontSize: 36,
      lineHeight: '39px'
    }
  }),
  content: css({
    color: colors.text,
    fontFamily: fontFamilies.serifRegular,
    fontSize: 16,
    lineHeight: '25px',
    [mediaQueries.mUp]: {
      fontSize: 21,
      lineHeight: '32px'
    }
  }),
  container: css({
    borderBottom: `1px solid ${colors.divider}`,
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
  label: css({
    fontFamily: fontFamilies.sansSerifMedium,
    fontSize: 17,
    lineHeight: '25px',
    letterSpacing: -0.19
  })
}

const Content = ({children, ...props}) => (
  <div {...props} {...styles.content}>{children}</div>
)

const publishedDateTimeFormat = swissTime.format('%e. %B %Y %H Uhr')

const Update = withT(({
  t,
  data: {
    slug,
    title,
    text,
    children,
    publishedDateTime
  }
}) => {
  const date = new Date(publishedDateTime)

  return (
    <div {...styles.container}>
      <H1 {...styles.title}>{title}</H1>
      <div {...styles.label}>
        {publishedDateTimeFormat(date)}
      </div>
      {
        children
        ? (
          <Content>
            {children}
          </Content>
        )
        : (
          <RawHtml style='serif' type={Content} dangerouslySetInnerHTML={{
            __html: text || ''
          }} />
        )
      }

      <P>
        <Share
          url={`${PUBLIC_BASE_URL}/updates/${slug}`}
          emailSubject={title}
          tweet={title} />
      </P>
    </div>
  )
})

export default Update

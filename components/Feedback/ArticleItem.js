import React from 'react'
import { css } from 'glamor'

import withT from '../../lib/withT'

import { Interaction, colors } from '@project-r/styleguide'

const { P } = Interaction

const styles = {
  container: css({
    display: 'inline-block',
    position: 'relative',
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }),
  count: css({
    fontFeatureSettings: '"tnum" 1, "kern" 1',
    color: colors.primary,
    position: 'absolute',
    right: 0
  })
}

export const NoResultsItem = ({ title }) => (
  <P style={{ color: colors.disabled }}>{title}</P>
)

const DefaultWrapper = ({ children, ...props }) => (
  <span {...props}>{children}</span>
)

const ArticleItem = ({
  t,
  title,
  selected,
  iconSize,
  count,
  Wrapper = DefaultWrapper
}) => (
  <Wrapper
    {...styles.container}
    style={{
      paddingRight: count ? 10 + String(count).length * 12 : 0
    }}
  >
    <span style={{ color: selected ? colors.primary : undefined }}>
      {title}
    </span>
    {count && <span {...styles.count}>{count}</span>}
  </Wrapper>
)

export default withT(ArticleItem)

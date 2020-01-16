import React from 'react'
import { css } from 'glamor'

import withT from '../../lib/withT'

import { Interaction, colors } from '@project-r/styleguide'

import Icon from '../Icons/Discussion'

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
    color: colors.primary
  }),
  icon: css({
    position: 'absolute',
    right: 0,
    marginTop: '-2px'
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
  countIcon,
  Wrapper = DefaultWrapper
}) => (
  <Wrapper
    {...styles.container}
    style={{
      paddingRight:
        countIcon && count
          ? iconSize + 6
          : 0 + count
          ? 5 + String(count).length * 15
          : 0
    }}
  >
    <span style={{ color: selected ? colors.primary : undefined }}>
      {title}
    </span>
    {count && (
      <span {...styles.icon} {...styles.count}>
        {countIcon && <Icon size={iconSize} fill={colors.primary} />} {count}
      </span>
    )}
  </Wrapper>
)

export default withT(ArticleItem)

import React from 'react'
import { css } from 'glamor'

import withT from '../../lib/withT'

import NewPage from 'react-icons/lib/md/open-in-new'

import {
  Interaction,
  colors
} from '@project-r/styleguide'

const { P } = Interaction

const styles = {
  container: css({
    display: 'inline-block',
    position: 'relative',
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
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

const ArticleItem = ({ t, title, newPage, selected, iconSize, Wrapper = DefaultWrapper }) => (
  <Wrapper
    {...styles.container}
    style={{ paddingRight: newPage && iconSize ? `${iconSize * 1.5}px` : undefined }}
  >
    <span style={{ color: selected ? colors.primary : undefined }}>{title}</span>
    {newPage && (
      <span {...styles.icon} title={t('feedback/articleItem/newPage/title')}>
        <NewPage size={iconSize} fill={colors.disabled} />
      </span>
    )}
  </Wrapper>
)

export default withT(ArticleItem)

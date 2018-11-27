import React from 'react'
import { css } from 'glamor'

import withT from '../../lib/withT'

import NewPage from 'react-icons/lib/md/open-in-new'

import {
  Interaction,
  colors,
  mediaQueries
} from '@project-r/styleguide'

const { P } = Interaction

const containerStyle = {
  display: 'inline-block',
  position: 'relative',
  maxWidth: '100%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}

const styles = {
  container: css({
    ...containerStyle
  }),
  containerWithIcon: css({
    ...containerStyle,
    paddingRight: '30px',
    [mediaQueries.mUp]: {
      paddingRight: '40px'
    }
  }),
  icon: css({
    position: 'absolute',
    right: 0,
    marginTop: '-2px',
    [mediaQueries.mUp]: {

    }
  })
}

export const NoResultsItem = ({ title }) => (
  <P style={{ color: colors.disabled }}>{title}</P>
)

const ArticleItem = ({ t, title, newPage, selected }) => (
  <P {...(newPage ? styles.containerWithIcon : styles.container)}>
    <span style={{ color: selected ? colors.primary : undefined }}>{title}</span>
    {newPage && (
      <span {...styles.icon} title={'Zur Debattenseite'}>
        <NewPage size={24} fill={colors.disabled} />
      </span>
    )}
  </P>
)

export default withT(ArticleItem)

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

const styles = {
  title: css({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }),
  icon: css({
    display: 'inline-block',
    marginLeft: 10,
    marginTop: '-2px',
    [mediaQueries.mUp]: {

    }
  })
}

const ArticleItem = ({ t, title, newPage }) => (
  <P>
    <span {...styles.title}>{title}</span>
    {newPage && (
      <div {...styles.icon} title={'Zur Debattenseite'}>
        <NewPage size={24} fill={colors.disabled} />
      </div>
    )}
  </P>
)

export default withT(ArticleItem)

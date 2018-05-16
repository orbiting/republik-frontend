import React, {Fragment} from 'react'
import {css} from 'glamor'
import withT from '../../lib/withT'
import {colors, fontStyles} from '@project-r/styleguide'

import IconLink from '../IconLink'

const styles = {
  markdown: css({
    display: 'inline-block',
    margin: '-5px 12px 0 0',
    verticalAlign: 'middle'
  }),
  link: css({
    ...fontStyles.sansSerifRegular16,
    color: colors.primary,
    cursor: 'pointer',
    textDecoration: 'none'
  })
}

const SecondaryActions = ({t}) => (
  <Fragment>
    <span {...styles.markdown}>
      <IconLink
        fill={colors.primary}
        size={28}
        icon='markdown'
        href='/markdown'
        target='_blank'
        title={t('components/Discussion/markdown/title')}
      />
    </span>
    <a {...styles.link} href='/etikette' target='_blank'>
      {t('components/Discussion/etiquette')}
    </a>
  </Fragment>
)

export default withT(SecondaryActions)

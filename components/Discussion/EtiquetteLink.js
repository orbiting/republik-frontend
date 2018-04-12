import React from 'react'
import {css} from 'glamor'
import withT from '../../lib/withT'
import {colors, fontStyles} from '@project-r/styleguide'

const styles = {
  link: css({
    ...fontStyles.sansSerifRegular16,
    color: colors.primary,
    cursor: 'pointer',
    textDecoration: 'none'
  })
}

const EtiquetteLink = ({t}) => (
  <a {...styles.link} href='/etikette' target='_blank'>
    {t('components/Discussion/etiquette')}
  </a>
)

export default withT(EtiquetteLink)

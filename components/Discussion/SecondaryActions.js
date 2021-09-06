import React from 'react'
import { css } from 'glamor'
import withT from '../../lib/withT'
import { IconButton } from '@project-r/styleguide'
import { EtiquetteIcon, MarkdownIcon } from '@project-r/styleguide/icons'

const styles = {
  container: css({
    display: 'flex'
  })
}

const SecondaryActions = ({ t }) => (
  <div {...styles.container}>
    <IconButton
      size={28}
      Icon={EtiquetteIcon}
      href='/etikette'
      target='_blank'
      title={t('components/Discussion/etiquette')}
    />
    <IconButton
      size={28}
      Icon={MarkdownIcon}
      href='/markdown'
      target='_blank'
      title={t('components/Discussion/markdown/title')}
    />
  </div>
)

export default withT(SecondaryActions)

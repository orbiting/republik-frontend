import React, { Fragment } from 'react'
import { css } from 'glamor'
import withT from '../../lib/withT'
import {
  CommentComposerSecondaryAction,
  IconButton
} from '@project-r/styleguide'
import { EtiquetteIcon, MarkdownIcon } from '@project-r/styleguide/icons'

const styles = {
  action: css({
    '& svg': {
      display: 'block'
    }
  })
}

const SecondaryActions = ({ t }) => (
  <Fragment>
    <CommentComposerSecondaryAction as='span' {...styles.action}>
      <IconButton
        size={28}
        Icon={EtiquetteIcon}
        href='/etikette'
        target='_blank'
        title={t('components/Discussion/etiquette')}
      />
    </CommentComposerSecondaryAction>
    <CommentComposerSecondaryAction as='span' {...styles.action}>
      <IconButton
        size={28}
        Icon={MarkdownIcon}
        href='/markdown'
        target='_blank'
        title={t('components/Discussion/markdown/title')}
      />
    </CommentComposerSecondaryAction>
  </Fragment>
)

export default withT(SecondaryActions)

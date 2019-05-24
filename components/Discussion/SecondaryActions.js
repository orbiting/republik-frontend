import React, { Fragment } from 'react'
import { css } from 'glamor'
import withT from '../../lib/withT'
import { CommentComposerSecondaryAction } from '@project-r/styleguide'

import IconLink from '../IconLink'

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
      <IconLink
        size={28}
        icon='etiquette'
        href='/etikette'
        target='_blank'
        title={t('components/Discussion/etiquette')}
      />
    </CommentComposerSecondaryAction>
    <CommentComposerSecondaryAction as='span' {...styles.action}>
      <IconLink
        size={28}
        icon='markdown'
        href='/markdown'
        target='_blank'
        title={t('components/Discussion/markdown/title')}
      />
    </CommentComposerSecondaryAction>
  </Fragment>
)

export default withT(SecondaryActions)

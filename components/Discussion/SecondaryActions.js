import React from 'react'
import { css } from 'glamor'
import withT from '../../lib/withT'
import { IconButton } from '@project-r/styleguide'
import { TextFormatIcon } from '@project-r/styleguide'

const styles = {
  container: css({
    display: 'flex'
  })
}

const SecondaryActions = ({ t }) => (
  <div {...styles.container}>
    <IconButton
      Icon={TextFormatIcon}
      href='/markdown'
      target='_blank'
      title={t('components/Discussion/markdown/title')}
    />
  </div>
)

export default withT(SecondaryActions)

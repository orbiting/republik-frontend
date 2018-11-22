import React from 'react'
import { compose } from 'react-apollo'
import { css } from 'glamor'

import { Link } from '../../lib/routes'
import withT from '../../lib/withT'

import {
  Interaction,
  colors,
  linkRule,
  mediaQueries
} from '@project-r/styleguide'

const styles = {
  container: css({
    padding: '15px',
    backgroundColor: colors.primaryBg,
    [mediaQueries.mUp]: {
      padding: '30px'
    }
  })
}

const AutoDiscussionTeaser = ({ t, discussionId }) => (
  <div {...styles.container}>
    <Interaction.P>
      {t.elements('article/autodiscussionteaser/text', { link: <Link route='feedback' params={{ id: discussionId }}>
        <a {...linkRule}>
          {t('article/autodiscussionteaser/linktext')}
        </a>
      </Link> })}
    </Interaction.P>
  </div>
)

export default compose(withT)(AutoDiscussionTeaser)

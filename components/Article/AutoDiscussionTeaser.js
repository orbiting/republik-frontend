import React from 'react'
import { compose } from 'react-apollo'

import { Link } from '../../lib/routes'
import withT from '../../lib/withT'

import {
  InfoBox,
  InfoBoxTitle,
  InfoBoxText,
  linkRule
} from '@project-r/styleguide'

const AutoDiscussionTeaser = ({ t, discussionId }) => (
  <InfoBox>
    <InfoBoxTitle>{t('article/autodiscussionteaser/title')}</InfoBoxTitle>
    <InfoBoxText>
      {t.elements('article/autodiscussionteaser/text', {
        link: <Link key='feedback' route='discussion' params={{ t: 'article', id: discussionId }}>
          <a {...linkRule}>
            {t('article/autodiscussionteaser/linktext')}
          </a>
        </Link> })}
    </InfoBoxText>
  </InfoBox>
)

export default compose(withT)(AutoDiscussionTeaser)

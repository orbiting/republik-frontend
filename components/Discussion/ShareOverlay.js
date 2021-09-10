import React from 'react'
import { flowRight as compose } from 'lodash'
import withT from '../../lib/withT'

import ShareOverlay from '../ActionBar/ShareOverlay'

const DiscussionShareOverlay = ({ t, onClose, url, title }) => (
  <ShareOverlay
    onClose={onClose}
    url={url}
    title={t('discussion/share/title')}
    tweet={''}
    emailSubject={t('discussion/share/emailSubject', {
      title
    })}
    emailBody={''}
    emailAttachUrl={url}
  />
)

export default compose(withT)(DiscussionShareOverlay)

import React from 'react'

import { TeaserFeed } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import SubscribeDocumentCallout from './SubscribeDocumentCallout'

export default compose(withT)(({ t, node, isNew, me }) => {
  const { subscription, object } = node
  return (
    <TeaserFeed
      {...object.meta}
      title={object.meta.shortTitle || object.meta.title}
      description={!object.meta.shortTitle && object.meta.description}
      t={t}
      key={object.meta.path}
      menu={<SubscribeDocumentCallout subscription={subscription} />}
      highlighted={isNew}
    />
  )
})

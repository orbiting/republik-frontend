import React from 'react'

import { TeaserFeed } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'

export default compose(withT)(({ t, node }) => {
  const { content, object } = node
  return (
    <TeaserFeed
      {...object.meta}
      title={object.meta.shortTitle || object.meta.title}
      description={!object.meta.shortTitle && object.meta.description}
      t={t}
      credits={object.meta.credits}
      publishDate={object.meta.publishDate}
      kind={
        object.meta.template === 'editorialNewsletter'
          ? 'meta'
          : object.meta.kind
      }
      key={object.meta.path}
    />
  )
})

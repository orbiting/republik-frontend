import React from 'react'

import { TeaserFeed } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import SubscribeDocumentCallout from './SubscribeDocumenCallout'

export default compose(withT)(({ t, node, isNew, me }) => {
  const { object } = node
  return (
    <TeaserFeed
      kind='editorial'
      format={{ meta: { title: object.meta.title } }}
      title='The quick brown fox jumps over the lazy dog'
      description='Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.'
      t={t}
      credits={[
        { type: 'text', value: 'An article by ' },
        {
          type: 'link',
          url: 'https://republik.ch/~moser',
          children: [{ type: 'text', value: 'Christof Moser' }]
        }
      ]}
      key={object.meta.path}
      menu={
        <SubscribeDocumentCallout
          me={me}
          formatId={object.id}
          formatName={object.meta.title}
          subscription={object.subscribedByMe}
        />
      }
      focus={isNew}
    />
  )
})

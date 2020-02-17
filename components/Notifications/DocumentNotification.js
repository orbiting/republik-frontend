import React from 'react'

import { TeaserFeed } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'

export default compose(withT)(({ t, node }) => {
  return (
    <TeaserFeed
      format={{ meta: { title: 'Format', color: 'purple', kind: 'meta' } }}
      title='The quick brown fox jumps over the lazy dog'
      description='Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.'
      credits={[
        { type: 'text', value: 'Vor 5 Tag von ' },
        {
          type: 'link',
          url: 'https://republik.ch/~moser',
          children: [{ type: 'text', value: 'Christof Moser' }]
        }
      ]}
    />
  )
})

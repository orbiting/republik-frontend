import React from 'react'

import { TeaserNotification } from '@project-r/styleguide'

export default () => (
  <TeaserNotification
    title='Top Stories'
    notification='<b>Neuer Debattenbeitrag</b> von Patrick Recher'
    createdDate='2020-02-15T13:17:08.643Z'
    type='Community'
    source={{
      color: '#3CAD00',
      name: 'Debatte',
      href: 'https://www.republik.ch/format/debatte'
    }}
    href='/top-storys'
  />
)

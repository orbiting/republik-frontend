import { createRequire } from '@project-r/styleguide/lib/components/DynamicComponent'
import * as reactApollo from 'react-apollo'
import * as graphqlTag from 'graphql-tag'

export const dynamicComponentRequire = createRequire().alias({
  'react-apollo': reactApollo,
  'graphql-tag': graphqlTag
})

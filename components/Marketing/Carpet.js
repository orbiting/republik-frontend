import React, { useState } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { Loader } from '@project-r/styleguide'

import TeaserBlock from '../Overview/TeaserBlock'
import { getTeasersFromDocument } from '../Overview/utils'
const query = gql`
  query MarketingPage {
    front: document(path: "/") {
      id
      children(first: 60) {
        nodes {
          body
        }
      }
    }
  }
`

const Carpet = ({ isMobile, t, data: { loading, front } }) => {
  const [highlight, setHighlight] = useState()

  // ensure the highlighFunction is not dedected as an state update function
  const onHighlight = highlighFunction => setHighlight(() => highlighFunction)
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: 50,
          zIndex: 2,
          width: '100%',
          height: 100,
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0))'
        }}
      />
      <Loader
        loading={loading}
        style={{ minHeight: 300 }}
        render={() => (
          <TeaserBlock
            teasers={getTeasersFromDocument(front)}
            highlight={highlight}
            onHighlight={onHighlight}
            maxHeight={isMobile ? 300 : 500}
            maxColumns={6}
            noHover
          />
        )}
      />
    </div>
  )
}

export default compose(graphql(query))(Carpet)

import React, { Component } from 'react'
import { compose } from 'react-apollo'
import { css } from 'glamor'
import gql from 'graphql-tag'
import Frame from '../Frame'
import withT from '../../lib/withT'
import withInNativeApp from '../../lib/withInNativeApp'

import {
  mediaQueries,
  Center,
  Interaction
} from '@project-r/styleguide'
import DocumentListContainer, { documentQueryFragment } from './DocumentListContainer'

const styles = {
  container: css({
    padding: '15px 15px 120px',
    [mediaQueries.mUp]: {
      padding: '40px 0 120px'
    }
  }),
  more: css({
    position: 'relative',
    height: 50,
    padding: '10px 0 0 0'
  })
}

const getDocuments = gql`
  query getDocuments($cursor: String) {
    greeting {
      text
      id
    }
    ${documentQueryFragment}
  }
`

class Feed extends Component {
  render () {
    const { meta } = this.props

    return (
      <Frame raw meta={meta}>
        <Center {...styles.container}>
          <DocumentListContainer
            renderBefore={({ greeting }) => greeting && (
              <Interaction.H1 style={{ marginBottom: '40px' }}>
                {greeting.text}
              </Interaction.H1>
            )}
            query={getDocuments}
          />
        </Center>
      </Frame>
    )
  }
}

export default compose(
  withT,
  withInNativeApp
)(Feed)

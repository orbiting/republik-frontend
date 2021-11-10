import React, { useEffect, useState } from 'react'
import { css } from 'glamor'
import { gql } from '@apollo/client'
import { graphql } from '@apollo/client/react/hoc'
import compose from 'lodash/flowRight'
import Frame from '../Frame'
import withT from '../../lib/withT'
import withInNativeApp from '../../lib/withInNativeApp'
import Loader from '../Loader'
import { MdAdd } from '@react-icons/all-files/md/MdAdd'

import {
  mediaQueries,
  Center,
  Interaction,
  IconButton,
  useColorContext
} from '@project-r/styleguide'
import DocumentList from './DocumentList'
import { makeLoadMore } from './DocumentListContainer'
import { documentFragment } from './fragments'
import EditorOverlay from '../Shorts/EditorOverlay'

const styles = {
  container: css({
    paddingTop: 15,
    paddingBottom: 120,
    [mediaQueries.mUp]: {
      paddingTop: 40
    }
  }),
  editorLink: css({
    position: 'fixed',
    bottom: 20,
    right: 30,
    borderRadius: 50,
    height: 50,
    width: 50,
    padding: 7,
    zIndex: 10
  })
}

const query = gql`
  query getFeed($cursor: String) {
    greeting {
      text
      id
    }
    documents: search(
      filters: [
        { key: "template", not: true, value: "section" }
        { key: "template", not: true, value: "format" }
        { key: "template", not: true, value: "front" }
      ]
      filter: { feed: true }
      sort: { key: publishedAt, direction: DESC }
      first: 30
      after: $cursor
    ) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        entity {
          ...FeedDocument
        }
      }
    }
  }
  ${documentFragment}
`

const greetingSubscription = gql`
  subscription {
    greeting {
      id
      text
    }
  }
`

const Feed = ({
  meta,
  data: {
    error,
    loading,
    greeting,
    documents: connection,
    fetchMore,
    subscribeToMore
  }
}) => {
  const [colorScheme] = useColorContext()
  const [showEditor, setShowEditor] = useState(false)
  const mapNodes = node => node.entity

  useEffect(() => {
    if (!subscribeToMore) {
      return
    }
    let unsubscribe = subscribeToMore({
      document: greetingSubscription,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        const { greeting } = subscriptionData.data.greeting
        if (greeting) {
          return {
            ...prev,
            greeting: {
              ...greeting
            }
          }
        } else {
          return prev
        }
      }
    })
    return () => {
      unsubscribe()
    }
  }, [subscribeToMore])

  return (
    <Frame hasOverviewNav stickySecondaryNav raw meta={meta}>
      <div
        {...styles.editorLink}
        {...colorScheme.set('backgroundColor', 'overlay')}
        {...colorScheme.set('boxShadow', 'overlayShadow')}
      >
        <IconButton
          Icon={MdAdd}
          size={36}
          onClick={() => setShowEditor(true)}
        />
        {showEditor && <EditorOverlay onClose={() => setShowEditor(false)} />}
      </div>
      <Center {...styles.container}>
        <Loader
          error={error}
          loading={loading}
          render={() => {
            return (
              <>
                {greeting && (
                  <Interaction.H1 style={{ marginBottom: '40px' }}>
                    {greeting.text}
                  </Interaction.H1>
                )}

                <DocumentList
                  documents={connection.nodes.map(mapNodes)}
                  totalCount={connection.totalCount}
                  hasMore={connection.pageInfo.hasNextPage}
                  loadMore={makeLoadMore({
                    fetchMore,
                    connection,
                    mapNodes
                  })}
                />
              </>
            )
          }}
        />
      </Center>
    </Frame>
  )
}

export default compose(graphql(query), withT, withInNativeApp)(Feed)

import React, { ReactElement, useMemo } from 'react'
import { useRouter } from 'next/router'
import { GENERAL_FEEDBACK_DISCUSSION_ID } from '../../lib/constants'
import GET_PLEADINGS_QUERY from './graphql/GetPleadings.graphql'
import { useQuery } from '@apollo/client'
import { DiscussionContext } from '../../../styleguide'
import PleadingList from './PleadingList'

type Props = {
  discussionId: string
  tagMappings: any
}

const StatementDiscussion = ({
  discussionId,
  tagMappings
}: Props): ReactElement => {
  /*
   * DiscussionOrder ('HOT' | 'DATE' | 'VOTES' | 'REPLIES')
   * If 'AUTO' DiscussionOrder is returned by backend via resolvedOrderBy
   */
  const router = useRouter()
  const { query } = router
  const orderBy =
    query.order ||
    (discussionId === GENERAL_FEEDBACK_DISCUSSION_ID ? 'DATE' : 'AUTO')
  const activeTag = query.tag

  const {
    data: { discussion } = {},
    error,
    loading,
    fetchMore,
    subscribeToMore,
    refetch,
    previousData
  } = useQuery(GET_PLEADINGS_QUERY, {
    variables: {
      discussionId,
      orderBy,
      activeTag,
      focusId: query.focusId,
      first: 50
    }
  })

  const filteredStatements = useMemo(
    () =>
      discussion && discussion.comments
        ? discussion.comments.nodes.filter(
            comment => !comment.adminUnpublished && !comment.unpublished
          )
        : [],
    [discussion]
  )

  return (
    <DiscussionContext.Provider value={{}}>
      <PleadingList pleadings={filteredStatements} tagMappings={tagMappings} />
    </DiscussionContext.Provider>
  )
}

export default StatementDiscussion

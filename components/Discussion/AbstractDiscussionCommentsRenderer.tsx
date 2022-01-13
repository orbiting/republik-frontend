import { DiscussionFragmentType } from './DiscussionProvider/graphql/fragments/DiscussionFragment.graphql'
import { CommentFragmentType } from './DiscussionProvider/graphql/fragments/CommentFragment.graphql'
import StatementNodeWrapper from './StatementsDiscussion/StatementNodeWrapper'
import React from 'react'
import { useTranslation } from '../../lib/withT'
import { StatementList } from '../../../styleguide'
import { FetchDiscussionFunctionType } from './DiscussionProvider/hooks/useDiscussionData'

type Props = {
  comments: CommentFragmentType[]
  fetchMore: FetchDiscussionFunctionType
  meta?: DiscussionFragmentType['meta']
}

const AbstractDiscussionCommentsRenderer = ({
  comments = [],
  fetchMore,
  meta
}: Props) => {
  const { t } = useTranslation()

  if (meta?.discussionType === 'statements') {
    const tagMapping = meta?.tagMapping ?? []

    return (
      <StatementList t={t} tagMappings={tagMapping}>
        {comments.map(comment => (
          <StatementNodeWrapper
            key={comment.id}
            comment={comment}
            tagMappings={tagMapping}
          />
        ))}
      </StatementList>
    )
  }

  return <>Regular Dialog: With {comments.length} comments</>
}

export default AbstractDiscussionCommentsRenderer

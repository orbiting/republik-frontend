import { CommentFragmentType } from '../graphql/fragments/CommentFragment.graphql'

type CommentsData = {
  totalCount: number
  directTotalCount: number
  pageInfo: {
    hasNextPage: boolean
    endCursor: string
  }
  nodes: CommentFragmentType[]
}

function makeCommentTree({
  nodes,
  pageInfo,
  directTotalCount,
  totalCount
}: CommentsData): CommentsData {
  const convertComment = node => ({
    ...node,
    comments: {
      ...node.comments,
      nodes: childrenOfComment(node.id)
    }
  })

  const childrenOfComment = id =>
    nodes
      .filter(n => n.parentIds[n.parentIds.length - 1] === id)
      .map(convertComment)

  return {
    totalCount,
    directTotalCount,
    pageInfo,
    nodes: nodes.filter(n => n.parentIds.length === 0).map(convertComment)
  }
}

export default makeCommentTree

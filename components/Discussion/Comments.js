import React from 'react'
import { css } from 'glamor'
import { compose } from 'react-apollo'

import withT from '../../lib/withT'
import { Router } from '../../lib/routes'

import { isAdmin } from './graphql/enhancers/isAdmin'
import { withDiscussionDisplayAuthor } from './graphql/enhancers/withDiscussionDisplayAuthor'
import { withCommentActions } from './graphql/enhancers/withCommentActions'
import { withSubmitComment } from './graphql/enhancers/withSubmitComment'
import { withDiscussionComments } from './graphql/enhancers/withDiscussionComments'

import DiscussionPreferences from './DiscussionPreferences'
import SecondaryActions from './SecondaryActions'
import ShareOverlay from './ShareOverlay'
import CommentLink, { getFocusUrl, getFocusRoute } from './CommentLink'

import {
  Loader,
  DiscussionContext,
  CommentList,
  A,
  colors,
  fontStyles,
  convertStyleToRem,
  pxToRem,
  mediaQueries,
  useMediaQuery,
  inQuotes
} from '@project-r/styleguide'

import Meta from '../Frame/Meta'
import { focusSelector } from '../../lib/utils/scroll'
import { RootCommentOverlay } from './RootCommentOverlay'

const styles = {
  orderByContainer: css({
    margin: '20px 0'
  }),
  orderBy: css({
    ...convertStyleToRem(fontStyles.sansSerifRegular16),
    outline: 'none',
    color: colors.text,
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 'none',
    padding: '0',
    cursor: 'pointer',
    marginRight: '20px',
    [mediaQueries.mUp]: {
      marginRight: '40px'
    }
  }),
  selectedOrderBy: css({
    textDecoration: 'underline'
  }),
  emptyDiscussion: css({
    margin: '20px 0'
  }),
  reloadLink: css({
    float: 'right',
    lineHeight: pxToRem('25px'),
    fontSize: pxToRem('16px'),
    cursor: 'pointer'
  })
}

const Comments = props => {
  const {
    t,
    now,
    isAdmin,
    focusId,
    orderBy,
    discussionComments: { loading, error, discussion, fetchMore },
    meta,
    setOrderBy,
    board,
    parent,
    parentId
  } = props

  /*
   * Subscribe to GraphQL updates of the dicsussion query.
   */
  React.useEffect(() => props.discussionComments.subscribe(), [
    props.discussionComments.subscribe
  ])

  /*
   * Local state: share overlay and discussion preferences.
   */
  const [shareUrl, setShareUrl] = React.useState()
  const [showPreferences, setShowPreferences] = React.useState(false)

  /*
   * Fetching comment that is in focus.
   */
  const [
    { currentFocusId, focusLoading, focusError },
    setFocusState
  ] = React.useState({})
  const fetchFocus = () => {
    /*
     * If we're still loading, or not trying to focus a comment, there is nothing
     * to do for us.
     *
     * If the discussion doesn't exist, someone else will hopefully render a nice
     * 404 / not found message.
     */
    if (loading || !focusId || !discussion) {
      return
    }

    /*
     * If we're loading the focused comment or encountered an error during the loading
     * process, return.
     */
    if (focusLoading || focusError) {
      return
    }

    /*
     * 'focusInfo' is of type Comment, but we only use it to for its parentIds.
     * To get to the content we look up the comment in the nodes list.
     */
    const focusInfo = discussion.comments.focus
    if (!focusInfo) {
      setFocusState({
        focusError: t('discussion/focus/notFound'),
        focusLoading: false
      })
      return
    }

    /*
     * Try to locate the comment in the discussion. If we find it, we can scroll
     * it into the viewport.
     *
     * If we don't find the comment, we attempt to load it. We do it by finding
     * the closests ancestor that we have, and then use the 'fetchMore()' function
     * to load more comments beneath that ancestor. We may have to repeat that
     * process multiple times until we make the comment we want available.
     */
    const focus = discussion.comments.nodes.find(
      comment => comment.id === focusId
    )
    if (focus) {
      /*
       * To make sure we don't run 'focusSelector()' multiple times, we store
       * the focused comment in the component state.
       */
      if (currentFocusId !== focus.id) {
        setFocusState(p => ({ ...p, currentFocusId: focus.id }))

        /*
         * Wrap 'focusSelector()' in a timeout to work around a bug. See
         * https://github.com/orbiting/republik-frontend/issues/243 for more
         * details
         */
        setTimeout(() => {
          focusSelector(`[data-comment-id='${focusInfo.id}']`)
        }, 50)
      }
    } else {
      const parentIds = focusInfo.parentIds

      /*
       * Look up the closest parent that is available.
       */
      const closestParentId = []
        .concat(parentIds)
        .reverse()
        .find(id => discussion.comments.nodes.find(node => node.id === id))

      /*
       * We could try to 'fetchMore()' comments at the root level before giving up
       * completely.
       *
       * But hopefully the server will return at least the top-level comment when
       * we include the focusId during the GraphQL request.
       */
      if (!closestParentId) {
        setFocusState({ focusError: t('discussion/focus/missing') })
        return
      }

      /*
       * Fetch missing comments. Calculate the depth to cover just what we need
       * to reach the focused comment.
       */
      const depth = parentIds.length - parentIds.indexOf(closestParentId)
      setFocusState({ focusLoading: true })
      fetchMore({ parentId: closestParentId, depth })
        .then(() => {
          setFocusState({ focusLoading: false })
        })
        .catch(() => {
          setFocusState({ focusError: t('discussion/focus/loadError') })
        })
    }
  }

  React.useEffect(() => {
    fetchFocus()
  })

  const isDesktop = useMediaQuery(mediaQueries.mUp)

  return (
    <Loader
      loading={loading || (focusId && focusLoading)}
      error={
        error ||
        (focusId && focusError) ||
        (discussion === null && t('discussion/missing'))
      }
      render={() => {
        const { focus } = discussion.comments

        if (discussion.comments.totalCount === 0) {
          return <EmptyDiscussion t={t} />
        }

        const onReload = e => {
          e.preventDefault()
          const result = getFocusRoute(discussion)
          if (result) {
            Router.replaceRoute(result.route, result.params).then(() => {
              props.discussionComments.refetch({
                focusId: undefined
              })
            })
          } else {
            props.discussionComments.refetch()
          }
        }

        /*
         * Convert the flat comments list into a tree.
         */
        const comments = asTree(discussion.comments, parentId ? 1 : undefined)

        /*
         * Construct the value for the DiscussionContext.
         */
        const discussionContextValue = {
          isAdmin,
          highlightedCommentId: focusId,

          discussion,

          actions: {
            previewComment: props.previewComment,
            submitComment: (parentComment, content, tags) =>
              props
                .submitComment(parentComment, content, tags)
                .then(() => ({ ok: true }), error => ({ error })),
            editComment: (comment, text, tags) =>
              props
                .editComment(comment, text, tags)
                .then(() => ({ ok: true }), error => ({ error })),
            upvoteComment: props.upvoteComment,
            downvoteComment: props.downvoteComment,
            unvoteComment: props.unvoteComment,
            unpublishComment: comment => {
              const message = t(
                `styleguide/CommentActions/unpublish/confirm${
                  comment.userCanEdit ? '' : '/admin'
                }`,
                {
                  name: comment.displayAuthor.name
                }
              )
              if (!window.confirm(message)) {
                return Promise.reject(new Error())
              } else {
                return props.unpublishComment(comment)
              }
            },
            fetchMoreComments: ({ parentId, after, appendAfter }) => {
              if (board) {
                const result = getFocusRoute(discussion)
                if (result) {
                  result.params.parent = parentId
                  return Router.pushRoute(result.route, result.params)
                }
              }
              return fetchMore({ parentId, after, appendAfter })
            },
            shareComment: comment => {
              setShareUrl(getFocusUrl(discussion, comment.id))
              return Promise.resolve({ ok: true })
            },
            openDiscussionPreferences: () => {
              setShowPreferences(true)
              return Promise.resolve({ ok: true })
            }
          },

          clock: {
            now,
            isDesktop,
            t
          },

          links: {
            Profile: ({ displayAuthor, ...props }) => {
              return <CommentLink {...props} displayAuthor={displayAuthor} />
            },
            Comment: ({ comment, ...props }) => {
              return (
                <CommentLink
                  {...props}
                  discussion={discussion}
                  commentId={comment.id}
                />
              )
            }
          },
          composerSecondaryActions: <SecondaryActions />
        }

        return (
          <>
            <div {...styles.orderByContainer}>
              <OrderBy
                t={t}
                orderBy={orderBy}
                setOrderBy={setOrderBy}
                value='DATE'
              />
              <OrderBy
                t={t}
                orderBy={orderBy}
                setOrderBy={setOrderBy}
                value='VOTES'
              />
              <OrderBy
                t={t}
                orderBy={orderBy}
                setOrderBy={setOrderBy}
                value='REPLIES'
              />
              <A
                {...styles.reloadLink}
                href={getFocusUrl(discussion)}
                onClick={onReload}
              >
                {t('components/Discussion/reload')}
              </A>
              <br style={{ clear: 'both' }} />
            </div>

            <DiscussionContext.Provider value={discussionContextValue}>
              {focus && (
                <Meta
                  data={{
                    title: t('discussion/meta/focus/title', {
                      authorName: focus.displayAuthor.name,
                      quotedDiscussionTitle: inQuotes(discussion.title)
                    }),
                    description: focus.preview
                      ? focus.preview.string
                      : undefined,
                    url: getFocusUrl(discussion, focus.id)
                  }}
                />
              )}
              {!focus && meta && (
                <Meta
                  data={{
                    title: t('discussion/meta/title', {
                      quotedDiscussionTitle: inQuotes(discussion.title)
                    }),
                    url: getFocusUrl(discussion)
                  }}
                />
              )}

              <CommentList t={t} comments={comments} />

              {showPreferences && (
                <DiscussionPreferences
                  key='discussionPreferenes'
                  discussionId={discussion.id}
                  onClose={() => {
                    setShowPreferences(false)
                  }}
                />
              )}

              {!!parent && (
                <RootCommentOverlay
                  discussionId={discussion.id}
                  parent={parent}
                  parentComment={discussion.comments.nodes.find(
                    c => c.id === parent
                  )}
                  discussion={discussion}
                  onClose={() => {
                    const result = getFocusRoute(discussion)
                    return (
                      result && Router.pushRoute(result.route, result.params)
                    )
                  }}
                />
              )}

              {!!shareUrl && (
                <ShareOverlay
                  discussionId={discussion.id}
                  onClose={() => {
                    setShareUrl()
                  }}
                  url={shareUrl}
                  title={discussion.title}
                />
              )}
            </DiscussionContext.Provider>
          </>
        )
      }}
    />
  )
}

export default compose(
  withT,
  withDiscussionDisplayAuthor,
  withCommentActions,
  isAdmin,
  withSubmitComment,
  withDiscussionComments
)(Comments)

const asTree = (
  { totalCount, directTotalCount, pageInfo, nodes },
  startDepth = 0
) => {
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
    nodes: nodes
      .filter(n => n.parentIds.length === startDepth)
      .map(convertComment)
  }
}

const EmptyDiscussion = ({ t }) => (
  <div {...styles.emptyDiscussion}>{t('components/Discussion/empty')}</div>
)

const OrderBy = ({ t, orderBy, setOrderBy, value }) => (
  <button
    {...styles.orderBy}
    {...(orderBy === value ? styles.selectedOrderBy : {})}
    onClick={() => {
      setOrderBy(value)
    }}
  >
    {t(`components/Discussion/OrderBy/${value}`)}
  </button>
)

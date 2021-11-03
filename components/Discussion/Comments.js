import React, { useMemo } from 'react'
import { css } from 'glamor'
import compose from 'lodash/flowRight'
import { useRouter } from 'next/router'
import Link from 'next/link'

import withT from '../../lib/withT'
import withInNativeApp, { postMessage } from '../../lib/withInNativeApp'

import { isAdmin } from './graphql/enhancers/isAdmin'
import { withDiscussionDisplayAuthor } from './graphql/enhancers/withDiscussionDisplayAuthor'
import { withCommentActions } from './graphql/enhancers/withCommentActions'
import { withSubmitComment } from './graphql/enhancers/withSubmitComment'
import { withDiscussionComments } from './graphql/enhancers/withDiscussionComments'

import DiscussionPreferences from './DiscussionPreferences'
import SecondaryActions from './SecondaryActions'
import ShareOverlay from './ShareOverlay'
import CommentLink, { getFocusHref, getFocusUrl } from './CommentLink'
import { composerHints } from './constants'

import {
  Loader,
  DiscussionContext,
  CommentList,
  A,
  fontStyles,
  convertStyleToRem,
  pxToRem,
  mediaQueries,
  useMediaQuery,
  inQuotes,
  useColorContext
} from '@project-r/styleguide'

import { withEditor } from '../Auth/checkRoles'
import Meta from '../Frame/Meta'
import { focusSelector } from '../../lib/utils/scroll'
import { RootCommentOverlay } from './RootCommentOverlay'
import { FeatureCommentOverlay } from './FeatureCommentOverlay'
import { withMarkAsReadMutation } from '../Notifications/enhancers'
import { rerouteDiscussion } from './DiscussionLink'

const styles = {
  orderByContainer: css({
    margin: '20px 0'
  }),
  orderBy: css({
    ...convertStyleToRem(fontStyles.sansSerifRegular16),
    outline: 'none',
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
  regular: css({
    textDecoration: 'none'
  }),
  selected: css({
    textDecoration: 'underline',
    textDecorationSkip: 'ink'
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
    isAdmin,
    isEditor,
    focusId,
    orderBy,
    activeTag,
    discussionComments: { loading, error, discussion, fetchMore },
    meta,
    board,
    parent,
    parentId: initialParentId,
    includeParent,
    discussionId,
    rootCommentOverlay,
    markAsReadMutation,
    inNativeApp
  } = props

  const router = useRouter()
  // const discussionUrlObject = getDiscussionUrlObject(discussion)
  /*
   * Subscribe to GraphQL updates of the dicsussion query.
   */
  React.useEffect(() => props.discussionComments.subscribe(), [
    initialParentId,
    discussionId
  ])

  /*
   * Local state: share overlay and discussion preferences.
   */
  const [shareUrl, setShareUrl] = React.useState()
  const [showPreferences, setShowPreferences] = React.useState(false)
  const [featureComment, setFeatureComment] = React.useState()

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

  const markNotificationsAsRead = () => {
    if (!discussion) return
    const { comments } = discussion
    if (!comments && !comments.nodes && !comments.nodes.length) return
    comments.nodes.forEach(comment => {
      const unreadNotifications =
        comment.unreadNotifications &&
        comment.unreadNotifications.nodes &&
        comment.unreadNotifications.nodes.filter(n => !n.readAt)

      if (unreadNotifications && unreadNotifications.length) {
        unreadNotifications.forEach(n => markAsReadMutation(n.id))
      }
    })
  }

  React.useEffect(() => {
    fetchFocus()
  })

  React.useEffect(() => {
    markNotificationsAsRead()
  }, [discussion])

  const isDesktop = useMediaQuery(mediaQueries.mUp)
  const resolvedOrderBy = discussion?.comments?.resolvedOrderBy || orderBy

  return (
    <Loader
      loading={loading || (focusId && focusLoading)}
      error={
        error ||
        (focusId && focusError) ||
        (discussion === null && t('discussion/missing'))
      }
      render={() => {
        if (!discussion) return null
        const { focus } = discussion.comments
        const metaFocus =
          focus ||
          (includeParent &&
            initialParentId &&
            discussion.comments.nodes.find(n => n.id === initialParentId))

        if (discussion.comments.totalCount === 0) {
          return <EmptyDiscussion t={t} />
        }

        const onReload = e => {
          e.preventDefault()
          const href = getFocusHref(discussion)
          if (href) {
            router.replace(href).then(() => {
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
        const comments = asTree(discussion.comments)

        /*
         * Construct the value for the DiscussionContext.
         */
        const discussionContextValue = {
          isAdmin,
          highlightedCommentId: focusId,
          activeTag,

          discussion,

          actions: {
            previewComment: props.previewComment,
            submitComment: (parentComment, content, tags) =>
              props.submitComment(parentComment, content, tags).then(
                () => ({ ok: true }),
                error => ({ error })
              ),
            editComment: (comment, text, tags) =>
              props.editComment(comment, text, tags).then(
                () => ({ ok: true }),
                error => ({ error })
              ),
            upvoteComment: props.upvoteComment,
            downvoteComment: props.downvoteComment,
            unvoteComment: props.unvoteComment,
            reportComment: props.reportComment,
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
              if (board && parentId) {
                const href = getFocusHref(discussion)
                if (href) {
                  href.query.parent = parentId
                  return router.push(href)
                }
              }
              return fetchMore({
                parentId: parentId || initialParentId,
                after,
                appendAfter
              })
            },
            shareComment: comment => {
              if (inNativeApp) {
                postMessage({
                  type: 'share',
                  payload: {
                    title: discussion.title,
                    url: getFocusUrl(discussion, comment),
                    subject: t('discussion/share/emailSubject', {
                      title: discussion.title
                    }),
                    dialogTitle: t('article/share/title')
                  }
                })
              } else {
                setShareUrl(getFocusUrl(discussion, comment))
              }
              return Promise.resolve({ ok: true })
            },
            openDiscussionPreferences: () => {
              setShowPreferences(true)
              return Promise.resolve({ ok: true })
            },
            featureComment:
              isEditor &&
              (comment => {
                setFeatureComment(comment)
                return Promise.resolve({ ok: true })
              })
          },

          clock: {
            isDesktop,
            t
          },

          Link: CommentLink,
          composerHints: composerHints(t),
          composerSecondaryActions: <SecondaryActions />
        }

        return (
          <>
            {!rootCommentOverlay && (
              <div {...styles.orderByContainer}>
                {board && (
                  <OrderByLink t={t} orderBy={resolvedOrderBy} value='HOT' />
                )}
                <OrderByLink t={t} orderBy={resolvedOrderBy} value='DATE' />
                <OrderByLink t={t} orderBy={resolvedOrderBy} value='VOTES' />
                <OrderByLink t={t} orderBy={resolvedOrderBy} value='REPLIES' />
                <A
                  {...styles.reloadLink}
                  href={getFocusUrl(discussion)}
                  onClick={onReload}
                >
                  {t('components/Discussion/reload')}
                </A>
                <br style={{ clear: 'both' }} />
              </div>
            )}

            <DiscussionContext.Provider value={discussionContextValue}>
              {metaFocus && (
                <Meta
                  data={{
                    title: t('discussion/meta/focus/title', {
                      authorName: metaFocus.displayAuthor.name,
                      quotedDiscussionTitle: inQuotes(discussion.title)
                    }),
                    description: metaFocus.preview
                      ? metaFocus.preview.string
                      : undefined,
                    url: getFocusUrl(discussion, metaFocus)
                  }}
                />
              )}
              {!metaFocus && meta && (
                <Meta
                  data={{
                    title: t('discussion/meta/title', {
                      quotedDiscussionTitle: inQuotes(discussion.title)
                    }),
                    url: getFocusUrl(discussion)
                  }}
                />
              )}

              <CommentList
                t={t}
                comments={comments}
                board={board}
                rootCommentOverlay={rootCommentOverlay}
              />

              {showPreferences && (
                <DiscussionPreferences
                  key='discussionPreferenes'
                  discussionId={discussion.id}
                  onClose={() => {
                    setShowPreferences(false)
                  }}
                />
              )}

              {featureComment && (
                <FeatureCommentOverlay
                  discussion={discussion}
                  comment={featureComment}
                  onClose={() => {
                    setFeatureComment()
                  }}
                />
              )}

              {!!parent && (
                <RootCommentOverlay
                  discussionId={discussion.id}
                  parent={parent}
                  onClose={() => {
                    const href = getFocusHref(discussion)
                    return href && router.push(href)
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
  withEditor,
  withSubmitComment,
  withDiscussionComments,
  withMarkAsReadMutation,
  withInNativeApp
)(Comments)

const asTree = ({ totalCount, directTotalCount, pageInfo, nodes }) => {
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

const EmptyDiscussion = ({ t }) => (
  <div {...styles.emptyDiscussion}>{t('components/Discussion/empty')}</div>
)

const OrderByLink = ({ t, orderBy, value }) => {
  const [colorScheme] = useColorContext()
  const route = useRouter()
  const isSelected = orderBy === value
  const targetHref = rerouteDiscussion(route, {
    order: value
  })
  const hoverRule = useMemo(() => {
    return css({
      '@media (hover)': {
        ':hover': {
          color: colorScheme.getCSSColor('textSoft')
        }
      }
    })
  }, [colorScheme])
  return (
    <Link href={targetHref} scroll={false} passHref>
      <a
        {...styles.orderBy}
        {...colorScheme.set('color', 'text')}
        {...styles[isSelected ? 'selected' : 'regular']}
        {...(!isSelected && hoverRule)}
      >
        {t(`components/Discussion/OrderBy/${value}`)}
      </a>
    </Link>
  )
}

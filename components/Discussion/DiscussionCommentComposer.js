import React from 'react'
import { compose } from 'react-apollo'
import Link from 'next/link'
import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'
import withInNativeApp from '../../lib/withInNativeApp'
import produce from '../../lib/immer'

import { withDiscussionDisplayAuthor } from './graphql/enhancers/withDiscussionDisplayAuthor'
import { withDiscussionPreferences } from './graphql/enhancers/withDiscussionPreferences'
import { withDiscussionComments } from './graphql/enhancers/withDiscussionComments'
import { withSubmitComment } from './graphql/enhancers/withSubmitComment'

import DiscussionPreferences from './DiscussionPreferences'
import SecondaryActions from './SecondaryActions'
import { composerHints } from './constants'

import {
  Loader,
  DiscussionContext,
  commentComposerStorageKey,
  CommentComposer,
  CommentComposerPlaceholder,
  Interaction,
  Editorial,
  timeahead,
  Label,
  useCurrentMinute
} from '@project-r/styleguide'

import Box from '../Frame/Box'

const DiscussionCommentComposer = props => {
  const {
    t,
    discussionId,
    discussionDisplayAuthor,
    me,
    discussionClosed,
    discussionUserCanComment,
    discussionPreferences,
    parentId,
    inNativeIOSApp,
    showPayNotes
  } = props

  /*
   * isActive: true if we show the CommentComposer, false if we show the CommentComposerPlaceholder.
   * showPreferences: …
   */
  const [isActive, setActive] = React.useState(false)
  const [showPreferences, setShowPreferences] = React.useState(false)
  const now = useCurrentMinute()

  React.useEffect(() => {
    /*
     * Activate the CommentComposer if we detect that the user has an unfinished
     * draft text in localStorage.
     *
     * Note: We don't initialize 'isActive' with this value because then
     * React won't correctly hydrate the UI. The HTML rendered by the server
     * and the first version rendered by the client code SHOULD be equal,
     * otherwise the UI may glitch. For that reason we call setActive() from
     * a React effect.
     */
    try {
      if (localStorage.getItem(commentComposerStorageKey(discussionId))) {
        setActive(true)
      }
    } catch (e) {}
  }, [])

  const timeAheadFromNow = dateString =>
    timeahead(t, (now - Date.parse(dateString)) / 1000)

  return (
    <Loader
      loading={discussionPreferences.loading}
      error={
        discussionPreferences.error ||
        (discussionPreferences.discussion === null && t('discussion/missing'))
      }
      render={() => {
        const { discussion } = discussionPreferences

        const disableTopLevelComments =
          !!discussion?.rules.disableTopLevelComments && parentId === null
        if (disableTopLevelComments) {
          return null
        } else if (discussionClosed) {
          return (
            <Box style={{ padding: '15px 20px' }}>{t('discussion/closed')}</Box>
          )
        } else {
          if (!me || !discussionUserCanComment) {
            if (!showPayNotes || inNativeIOSApp) {
              return null
            }
            return (
              <Box style={{ padding: '15px 20px' }}>
                <Interaction.P>
                  {t.elements('submitComment/notEligible', {
                    pledgeLink: (
                      <Link href='/angebote' key='pledge' passHref>
                        <Editorial.A>
                          {t('submitComment/notEligible/pledgeText')}
                        </Editorial.A>
                      </Link>
                    )
                  })}
                </Interaction.P>
              </Box>
            )
          }

          const waitUntilDate =
            discussion.userWaitUntil && new Date(discussion.userWaitUntil)
          if (waitUntilDate && waitUntilDate > new Date()) {
            return (
              <Box style={{ padding: '15px 20px' }}>
                <Interaction.P>
                  {t('styleguide/CommentComposer/wait', {
                    time: timeAheadFromNow(waitUntilDate)
                  })}
                </Interaction.P>
              </Box>
            )
          }

          // workaround to know if there is a userPreference record with potentially credential null
          const noPreferences = discussion.userPreference.notifications === null
          const autoCredential =
            noPreferences &&
            !discussion.userPreference.anonymity &&
            discussionPreferences.me &&
            discussionPreferences.me.credentials.find(c => c.isListed)
          const displayAuthor = {
            ...discussionDisplayAuthor,
            ...(autoCredential ? { credential: autoCredential } : {})
          }
          const submitComment = ({ text, tags }) => {
            if (autoCredential) {
              props.setDiscussionPreferences(
                undefined,
                autoCredential.description
              )
            }
            return props.submitComment(null, text, tags).then(
              () => {
                setActive(false)
                return { ok: true }
              },
              error => ({ error: `${error}` })
            )
          }

          if (isActive) {
            /*
             * We don't fully initialize the DiscussionContext value. We only set fields which are
             * required by the CommentComposer.
             */
            const discussionContextValue = {
              discussion: produce(discussion, draft => {
                draft.displayAuthor = displayAuthor
              }),

              actions: {
                previewComment: props.previewComment,
                openDiscussionPreferences: () => {
                  setShowPreferences(true)
                }
              },
              composerHints: composerHints(t),
              composerSecondaryActions: <SecondaryActions />
            }

            return (
              <DiscussionContext.Provider value={discussionContextValue}>
                <CommentComposer
                  t={t}
                  isRoot
                  onClose={() => {
                    setActive(false)
                  }}
                  onSubmit={submitComment}
                  onSubmitLabel={t('submitComment/rootSubmitLabel')}
                />

                {showPreferences && (
                  <DiscussionPreferences
                    discussionId={discussionId}
                    autoCredential={autoCredential}
                    onClose={() => {
                      setShowPreferences(false)
                    }}
                  />
                )}
              </DiscussionContext.Provider>
            )
          } else {
            return (
              <CommentComposerPlaceholder
                t={t}
                displayAuthor={displayAuthor}
                onClick={() => {
                  setActive(true)
                }}
              />
            )
          }
        }
      }}
    />
  )
}

export default compose(
  withT,
  withMe,
  withDiscussionDisplayAuthor,
  withDiscussionPreferences,
  withDiscussionComments,
  withSubmitComment,
  withInNativeApp
)(DiscussionCommentComposer)

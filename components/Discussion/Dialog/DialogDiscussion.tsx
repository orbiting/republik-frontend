import React, { ReactElement } from 'react'
import { Loader } from '@project-r/styleguide'
import { useDiscussion } from '../DiscussionProvider/context/DiscussionContext'
import DiscussionComposerWrapper from '../DiscussionProvider/components/DiscussionComposerWrapper'
import TagFilter from '../TagFilter'
import CommentsOptions from '../CommentsOptions'
import { useTranslation } from '../../../lib/withT'
import { getFocusHref } from '../CommentLink'
import { useRouter } from 'next/router'
import DiscussionComposer from '../shared/DiscussionComposer'

const DialogDiscussion = (): ReactElement => {
  const { t } = useTranslation()
  const router = useRouter()
  const { orderBy } = router.query
  const { discussion, loading, error, refetch } = useDiscussion()

  const handleReload = e => {
    e.preventDefault()
    const href = getFocusHref(discussion)
    if (href) {
      router.replace(href).then(() => {
        refetch({
          focusId: undefined
        })
      })
    } else {
      refetch()
    }
  }

  return (
    <Loader
      loading={loading || !discussion}
      error={error}
      render={() => (
        <div>
          <div>
            <DiscussionComposerWrapper isTopLevel showPayNotes>
              <DiscussionComposer isRootLevel />
            </DiscussionComposerWrapper>
          </div>
          <div>
            <TagFilter discussion={discussion} />
            <CommentsOptions
              t={t}
              resolvedOrderBy={
                discussion.comments.resolvedOrderBy || (orderBy as string)
              }
              handleReload={handleReload}
              discussion={discussion}
              discussionType='statements'
              router={router}
            />
            <p>comments</p>
          </div>
        </div>
      )}
    />
  )
}

export default DialogDiscussion

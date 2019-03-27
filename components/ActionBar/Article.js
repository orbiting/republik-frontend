import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import ActionBar from './'
import DiscussionIconLink from '../Discussion/IconLink'
import { getDiscussionIconLinkProps } from './utils'
import UserProgress from './UserProgress'

import {
  colors
} from '@project-r/styleguide'

class ArticleActionBar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      alive: false
    }
  }
  componentDidMount () {
    /* This Component is used within SSRCachingBoundary and can not
     * use context, live or personalised data until after componentDidMount
     */
    this.setState({ alive: true })
  }
  render () {
    const { alive } = this.state
    const { title, template, path, linkedDiscussion, ownDiscussion, documentId, dossierUrl, estimatedReadingMinutes, estimatedConsumptionMinutes, onAudioClick, onGalleryClick, onPdfClick, pdfUrl, showBookmark, t, url, inNativeApp } = this.props
    const { userBookmark, userProgress, restoreArticleProgress } = this.context
    const {
      discussionId,
      discussionPath,
      discussionQuery,
      discussionCount,
      isDiscussionPage
    } = getDiscussionIconLinkProps(linkedDiscussion, ownDiscussion, template, path)

    return (
      <Fragment>
        <ActionBar
          url={url}
          title={title}
          shareOverlayTitle={t('article/share/title')}
          fill={colors.text}
          dossierUrl={dossierUrl}
          onPdfClick={onPdfClick}
          pdfUrl={pdfUrl}
          emailSubject={t('article/share/emailSubject', {
            title
          })}
          onAudioClick={onAudioClick}
          inNativeApp={inNativeApp}
          onGalleryClick={onGalleryClick}
          showBookmark={alive && showBookmark}
          documentId={documentId}
          bookmarked={alive ? !!userBookmark : undefined}
          estimatedReadingMinutes={estimatedReadingMinutes}
          estimatedConsumptionMinutes={estimatedConsumptionMinutes}
        />
        {discussionId && alive &&
          <DiscussionIconLink
            discussionId={discussionId}
            discussionPage={isDiscussionPage}
            path={discussionPath}
            query={discussionQuery}
            count={discussionCount}
            style={{ marginLeft: 7 }} />
        }
        {userProgress && estimatedReadingMinutes > 1 && (
          <div style={{
            marginTop: 10,
            cursor: restoreArticleProgress ? 'pointer' : undefined
          }} onClick={restoreArticleProgress}>
            <UserProgress
              fill={restoreArticleProgress && colors.text}
              userProgress={userProgress}
              text={t('article/progress/restore')} />
          </div>
        )}
      </Fragment>
    )
  }
}

ArticleActionBar.contextTypes = {
  userBookmark: PropTypes.object,
  userProgress: PropTypes.object,
  restoreArticleProgress: PropTypes.func
}

export default ArticleActionBar

import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import ActionBar from './'
import DiscussionIconLink from '../Discussion/IconLink'
import { getDiscussionIconLinkProps } from './utils'

import {
  colors
} from '@project-r/styleguide'
import ShareButtons from './ShareButtons'

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
    const {
      animate,
      title,
      tweet,
      emailBody,
      emailAttachUrl,
      template,
      path,
      linkedDiscussion,
      ownDiscussion,
      documentId,
      dossierUrl,
      estimatedReadingMinutes,
      estimatedConsumptionMinutes,
      onAudioClick,
      onGalleryClick,
      onPdfClick,
      pdfUrl,
      showBookmark,
      t,
      url,
      inNativeApp,
      inIOS,
      renderSocialButtons
    } = this.props
    const { userBookmark } = this.context
    const {
      discussionId,
      discussionPath,
      discussionQuery,
      discussionCount,
      isDiscussionPage
    } = getDiscussionIconLinkProps(linkedDiscussion, ownDiscussion, template, path)
    const emailSubject = t('article/share/emailSubject', { title })

    return (
      <Fragment>
        <ActionBar
          url={url}
          title={title}
          shareOverlayTitle={t('article/share/title')}
          animate={animate}
          fill={colors.text}
          dossierUrl={dossierUrl}
          onPdfClick={onPdfClick}
          pdfUrl={pdfUrl}
          emailSubject={emailSubject}
          onAudioClick={onAudioClick}
          inNativeApp={inNativeApp}
          inIOS={inIOS}
          onGalleryClick={onGalleryClick}
          showBookmark={alive && showBookmark}
          showShare={!renderSocialButtons}
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
        {!!renderSocialButtons &&
          <div style={{ marginTop: 40, marginBottom: 20 }}>
            <h3>Share this article</h3>
            <ShareButtons
              isWide
              url={url}
              tweet={tweet}
              emailSubject={emailSubject}
              emailBody={emailBody}
              emailAttachUrl={emailAttachUrl} />
          </div>
        }

      </Fragment>
    )
  }
}

ArticleActionBar.contextTypes = {
  userBookmark: PropTypes.object
}

ArticleActionBar.defaultProps = {
  tweet: '',
  emailSubject: '',
  emailBody: '',
  emailAttachUrl: true
}

export default ArticleActionBar

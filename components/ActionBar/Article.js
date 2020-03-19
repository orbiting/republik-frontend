import React, { Component, Fragment } from 'react'
import ActionBar from './'
import DiscussionIconLink from '../Discussion/IconLink'
import { getDiscussionIconLinkProps } from './utils'

import { fontStyles } from '@project-r/styleguide'
import ShareButtons from './ShareButtons'

class ArticleActionBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      alive: false
    }
  }
  componentDidMount() {
    /* This Component is used within SSRCachingBoundary and can not
     * use context, live or personalised data until after componentDidMount
     */
    this.setState({ alive: true })
  }
  render() {
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
      repoId,
      isEditor,
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
      showShare = true,
      grandSharing,
      fontSize,
      userBookmark,
      showSubscribe,
      format,
      subscription
    } = this.props
    const {
      discussionId,
      discussionPath,
      discussionQuery,
      discussionCount,
      isDiscussionPage
    } = getDiscussionIconLinkProps(
      linkedDiscussion,
      ownDiscussion,
      template,
      path
    )
    const emailSubject = t('article/share/emailSubject', { title })

    return (
      <Fragment>
        <ActionBar
          url={url}
          pocket
          title={title}
          shareOverlayTitle={t('article/share/title')}
          animate={animate}
          dossierUrl={dossierUrl}
          onPdfClick={onPdfClick}
          pdfUrl={pdfUrl}
          emailSubject={emailSubject}
          onAudioClick={onAudioClick}
          inNativeApp={inNativeApp}
          inIOS={inIOS}
          onGalleryClick={onGalleryClick}
          showBookmark={showBookmark}
          showShare={showShare && !grandSharing}
          fontSize={fontSize}
          documentId={documentId}
          repoId={repoId}
          isEditor={isEditor}
          bookmarked={!!userBookmark}
          estimatedReadingMinutes={estimatedReadingMinutes}
          estimatedConsumptionMinutes={estimatedConsumptionMinutes}
          format={format}
          subscription={subscription}
          showSubscribe={showSubscribe}
        />
        {discussionId && alive && (
          <DiscussionIconLink
            discussionId={discussionId}
            discussionPage={isDiscussionPage}
            path={discussionPath}
            query={discussionQuery}
            count={discussionCount}
            style={{ marginLeft: 7 }}
          />
        )}
        {!!grandSharing && (
          <div style={{ marginBottom: 20, marginTop: 20 }}>
            <h3 style={{ marginBottom: 0, ...fontStyles.sansSerifMedium16 }}>
              {t('article/share/title')}
            </h3>
            <ShareButtons
              url={url}
              pocket
              tweet={tweet}
              emailSubject={emailSubject}
              emailBody={emailBody}
              emailAttachUrl={emailAttachUrl}
              eventCategory='ArticleShareButtons'
            />
          </div>
        )}
      </Fragment>
    )
  }
}

ArticleActionBar.defaultProps = {
  tweet: '',
  emailSubject: '',
  emailBody: '',
  emailAttachUrl: true,
  fontSize: true
}

export default ArticleActionBar

import React, { Component, Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ActionBar from './'
import DiscussionIconLink from '../Discussion/IconLink'
import { getDiscussionIconLinkProps } from './utils'

import { fontStyles, plainButtonRule } from '@project-r/styleguide'
import ShareButtons from './ShareButtons'
import UserProgress from './UserProgress'

const ArticleActionBar = (
  {
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
    userProgress,
    showSubscribe,
    subscription,
    isDiscussion
  },
  { restoreArticleProgress }
) => {
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
  const [alive, setAlive] = useState(false)
  useEffect(() => {
    setAlive(true)
  }, [])

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
        subscription={subscription}
        showSubscribe={showSubscribe}
        ownDiscussion={ownDiscussion}
        isDiscussion={isDiscussion}
      />
      {userProgress && estimatedReadingMinutes > 1 && (
        <button
          {...plainButtonRule}
          onClick={restoreArticleProgress}
          style={{ marginLeft: 7 }}
        >
          <UserProgress
            userProgress={
              !userProgress.percentage &&
              userProgress.max &&
              userProgress.max.percentage === 1
                ? userProgress.max
                : userProgress
            }
          />
        </button>
      )}
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

ArticleActionBar.defaultProps = {
  tweet: '',
  emailSubject: '',
  emailBody: '',
  emailAttachUrl: true,
  fontSize: true
}

ArticleActionBar.contextTypes = {
  restoreArticleProgress: PropTypes.func
}

export default ArticleActionBar

import React, { useState, Fragment } from 'react'
import { css } from 'glamor'
import { MdPictureAsPdf, MdQueryBuilder } from 'react-icons/md'
import { IconButton, mediaQueries } from '@project-r/styleguide'

import { shouldIgnoreClick } from '../../lib/utils/link'
import { trackEvent } from '../../lib/piwik'
import { getDiscussionIconLinkProps } from './utils'
import { PUBLIC_BASE_URL } from '../../lib/constants'
import PdfOverlay, { getPdfUrl, countImages } from '../Article/PdfOverlay'
import FontSizeOverlay from '../FontSize/Overlay'
import ShareOverlay from './ShareOverlay'

import FontSizeIcon from '../Icons/FontSize'
import ShareIOSIcon from '../Icons/ShareIOS'
import SubscribeMenu from '../Notifications/SubscribeMenu'
import Bookmark from './Bookmark'
import DiscussionButton from './DiscussionButton'
import UserProgress from './UserProgress'

const ActionBar = ({ t, mode, document, inNativeApp }) => {
  const [pdfOverlayVisible, setPdfOverlayVisible] = useState(false)
  const [fontSizeOverlayVisible, setFontSizeOverlayVisible] = useState(false)
  const [shareOverlayVisible, setShareOverlayVisible] = useState(false)

  const meta = document && {
    ...document.meta,
    url: `${PUBLIC_BASE_URL}${document.meta.path}`
  }
  const hasPdf = meta && meta.template === 'article'
  const isDiscussion = meta && meta.template === 'discussion'
  const emailSubject = t('article/share/emailSubject', {
    title: document.title
  })

  const {
    discussionId,
    discussionPath,
    discussionQuery,
    discussionCount,
    isDiscussionPage
  } = getDiscussionIconLinkProps(
    meta.linkedDiscussion,
    meta.ownDiscussion,
    meta.template,
    meta.path
  )

  const displayMinutes = Math.max(
    meta.estimatedConsumptionMinutes,
    meta.estimatedReadingMinutes
  )
  const displayHours = Math.floor(displayMinutes / 60)

  const ActionItems = [
    {
      title: t(`article/actionbar/pdf/options}`),
      Icon: MdPictureAsPdf,
      href: hasPdf && getPdfUrl(meta),
      onClick: e => {
        if (shouldIgnoreClick(e)) {
          return
        }
        e.preventDefault()
        hasPdf && countImages(document.content) > 0
          ? setPdfOverlayVisible(!pdfOverlayVisible)
          : undefined
      },
      modes: ['article-top', 'article-bottom']
    },
    {
      title: t('article/actionbar/fontSize/title'),
      Icon: FontSizeIcon,
      href: meta.url,
      onClick: e => {
        e.preventDefault()
        setFontSizeOverlayVisible(!fontSizeOverlayVisible)
      },
      modes: ['article-top']
    },
    {
      title: 'Folgen',
      element: (
        <SubscribeMenu
          discussionId={
            isDiscussion && meta.ownDiscussion && meta.ownDiscussion.id
          }
          subscriptions={document.subscribedBy.nodes}
          label={t('SubscribeMenu/title')}
        />
      ),
      modes: ['article-top', 'article-bottom']
    },
    {
      title: 'Lesezeichen',
      element: (
        <Bookmark
          bookmarked={!!document.userBookmark}
          documentId={document.id}
          label={t('bookmark/label')}
        />
      ),
      modes: ['article-top', 'article-overlay']
    },
    {
      title: t('article/actionbar/share'),
      Icon: ShareIOSIcon,
      href: meta.url,
      onClick: e => {
        e.preventDefault()
        trackEvent(['ActionBar', 'share', meta.url])
        if (inNativeApp) {
          postMessage({
            type: 'share',
            payload: {
              title: document.title,
              url: meta.url,
              subject: emailSubject,
              dialogTitle: t('article/share/title')
            }
          })
          e.target.blur()
        } else {
          setShareOverlayVisible(!shareOverlayVisible)
        }
      },
      label: 'Teilen',
      modes: ['article-top', 'article-bottom', 'article-overlay']
    },
    {
      title: 'Leseposition',
      element:
        document.userProgress && displayMinutes > 1 ? (
          <UserProgress
            documentId={document.id}
            userProgress={
              !document.userProgress.percentage &&
              document.userProgress.max &&
              document.userProgress.max.percentage === 1
                ? document.userProgress.max
                : document.userProgress
            }
          />
        ) : (
          <></>
        ),
      modes: ['article-overlay']
    },
    {
      title: 'Dialog',
      element: (
        <DiscussionButton
          discussionId={discussionId}
          discussionPath={discussionPath}
          discussionQuery={discussionQuery}
          discussionCount={discussionCount}
          isDiscussionPage={isDiscussionPage}
        />
      ),
      modes: ['article-top', 'article-bottom', 'article-overlay']
    }
  ]
  const ActionItemsSecondary = [
    {
      title: 'Lesezeit',
      Icon: MdQueryBuilder,
      label: `Lesezeit: ${displayHours ? `${displayHours}h\u202F` : ''}
      ${displayMinutes} Minuten`,
      labelShort: `${displayHours ? `${displayHours}h\u202F` : ''}
      ${displayMinutes}'`,
      noClick: true
    },
    {
      title: 'Leseposition',
      element:
        document.userProgress && displayMinutes > 1 ? (
          <UserProgress
            documentId={document.id}
            userProgress={
              !document.userProgress.percentage &&
              document.userProgress.max &&
              document.userProgress.max.percentage === 1
                ? document.userProgress.max
                : document.userProgress
            }
          />
        ) : (
          <></>
        )
    }
  ]
  return (
    <>
      <div
        {...styles.topRow}
        {...(mode === 'article-overlay' && { ...styles.overlay })}
      >
        {ActionItems.filter(item => item.modes.includes(mode)).map(props => (
          <Fragment key={props.title}>
            {props.element || <IconButton {...props} />}
          </Fragment>
        ))}
      </div>
      {mode === 'article-top' && (
        <div {...styles.bottomRow}>
          {ActionItemsSecondary.map(props => (
            <Fragment key={props.title}>
              {props.element || <IconButton {...props} />}
            </Fragment>
          ))}
        </div>
      )}

      {/* OVERLAYS */}
      {pdfOverlayVisible && (
        <PdfOverlay
          article={document}
          onClose={() => setPdfOverlayVisible(false)}
        />
      )}
      {fontSizeOverlayVisible && (
        <FontSizeOverlay onClose={() => setFontSizeOverlayVisible(false)} />
      )}
      {shareOverlayVisible && (
        <ShareOverlay
          onClose={() => setShareOverlayVisible(false)}
          url={meta.url}
          title={t('article/actionbar/share')}
          tweet={''}
          emailSubject={emailSubject}
          emailBody={''}
          emailAttachUrl
        />
      )}
    </>
  )
}

const styles = {
  topRow: css({
    display: 'flex',
    marginTop: 24
  }),
  bottomRow: css({
    display: 'flex',
    marginTop: 24
  }),
  overlay: css({
    marginTop: 0,
    width: '100%',
    padding: '0 16px',
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    [mediaQueries.mUp]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    }
  })
}

export default ActionBar

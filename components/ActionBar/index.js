import React, { useState, Fragment, useContext } from 'react'
import { css } from 'glamor'
import { compose } from 'react-apollo'
import {
  MdPictureAsPdf,
  MdQueryBuilder,
  MdPlayCircleOutline,
  MdFileDownload,
  MdMic
} from 'react-icons/md'
import { IconButton } from '@project-r/styleguide'
import withT from '../../lib/withT'
import withInNativeApp, { postMessage } from '../../lib/withInNativeApp'

import { splitByTitle } from '../../lib/utils/mdast'
import { shouldIgnoreClick } from '../../lib/utils/link'
import { trackEvent } from '../../lib/piwik'
import { getDiscussionIconLinkProps } from './utils'
import { PUBLIC_BASE_URL } from '../../lib/constants'
import PdfOverlay, { getPdfUrl, countImages } from '../Article/PdfOverlay'
import FontSizeOverlay from '../FontSize/Overlay'
import ShareOverlay from './ShareOverlay'
import PodcastOverlay from './PodcastOverlay'
import { AudioContext } from '../Audio'

import FontSizeIcon from '../Icons/FontSize'
import ShareIOSIcon from '../Icons/ShareIOS'
import SubscribeMenu from '../Notifications/SubscribeMenu'
import Bookmark from './Bookmark'
import DiscussionButton from './DiscussionButton'
import UserProgress from './UserProgress'

const ActionBar = ({
  mode,
  document,
  t,
  inNativeApp,
  share,
  download,
  discussion,
  fontSize,
  isCentered
}) => {
  const [pdfOverlayVisible, setPdfOverlayVisible] = useState(false)
  const [fontSizeOverlayVisible, setFontSizeOverlayVisible] = useState(false)
  const [shareOverlayVisible, setShareOverlayVisible] = useState(false)
  const [podcastOverlayVisible, setPodcastOverlayVisible] = useState(false)

  if (!document) {
    return (
      <div {...styles.topRow} {...(isCentered && { ...styles.centered })}>
        {download && (
          <IconButton
            href={download}
            Icon={MdFileDownload}
            label={share.label || ''}
            target='_blank'
          />
        )}
        {fontSize && (
          <IconButton
            Icon={FontSizeIcon}
            onClick={e => {
              e.preventDefault()
              setFontSizeOverlayVisible(!fontSizeOverlayVisible)
            }}
          />
        )}
        {discussion && (
          <SubscribeMenu
            discussionId={discussion}
            label={t('SubscribeMenu/title')}
          />
        )}
        {share && (
          <IconButton
            label={share.label || ''}
            Icon={ShareIOSIcon}
            href={share.url}
            onClick={e => {
              e.preventDefault()
              trackEvent(['ActionBar', 'share', share.url])
              if (inNativeApp) {
                postMessage({
                  type: 'share',
                  payload: {
                    title: share.title,
                    url: share.url,
                    subject: share.emailSubject || '',
                    dialogTitle: t('article/share/title')
                  }
                })
                e.target.blur()
              } else {
                setShareOverlayVisible(!shareOverlayVisible)
              }
            }}
          />
        )}
        {shareOverlayVisible && (
          <ShareOverlay
            onClose={() => setShareOverlayVisible(false)}
            url={share.url}
            title={share.overlayTitle || t('article/actionbar/share')}
            tweet={share.tweet || ''}
            emailSubject={share.emailSubject || ''}
            emailBody={share.emailBody || ''}
            emailAttachUrl={share.emailAttachUrl}
          />
        )}
        {fontSizeOverlayVisible && (
          <FontSizeOverlay onClose={() => setFontSizeOverlayVisible(false)} />
        )}
      </div>
    )
  }

  const meta = document && {
    ...document.meta,
    url: `${PUBLIC_BASE_URL}${document.meta.path}`
  }
  const podcast =
    (meta && meta.podcast) ||
    (meta && meta.audioSource && meta.format && meta.format.meta.podcast)
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

  const { toggleAudioPlayer } = useContext(AudioContext)

  const displayMinutes = Math.max(
    meta.estimatedConsumptionMinutes,
    meta.estimatedReadingMinutes
  )
  const displayHours = Math.floor(displayMinutes / 60)

  const forceShortLabel = mode === 'article-overlay' || mode === 'feed'

  // centering
  const splitContent = document.content && splitByTitle(document.content)
  const titleNode =
    splitContent &&
    splitContent.title &&
    splitContent.title.children[splitContent.title.children.length - 1]
  const centered =
    (titleNode && titleNode.data && titleNode.data.center) ||
    meta.template === 'format' ||
    meta.template === 'section'

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
      modes: ['article-top', 'article-bottom'],
      show: true
    },
    {
      title: t('article/actionbar/fontSize/title'),
      Icon: FontSizeIcon,
      href: meta.url,
      onClick: e => {
        e.preventDefault()
        setFontSizeOverlayVisible(!fontSizeOverlayVisible)
      },
      modes: ['article-top'],
      show: true
    },
    {
      title: 'Folgen',
      element: (
        <SubscribeMenu
          discussionId={
            isDiscussion && meta.ownDiscussion && meta.ownDiscussion.id
          }
          subscriptions={document.subscribedBy && document.subscribedBy.nodes}
          label={t('SubscribeMenu/title')}
        />
      ),
      modes: ['article-top', 'article-bottom'],
      show: true
    },
    {
      title: 'Lesezeichen',
      element: (
        <Bookmark
          bookmarked={!!document.userBookmark}
          documentId={document.id}
          label={!forceShortLabel ? t('bookmark/label') : ''}
        />
      ),
      modes: ['article-top', 'article-overlay', 'feed'],
      show: true
    },
    {
      title: 'Lesezeit',
      Icon: MdQueryBuilder,
      label: !forceShortLabel
        ? `${displayHours ? `${displayHours}h\u202F` : ''}
      ${displayMinutes} Minuten`
        : `${displayHours ? `${displayHours}h\u202F` : ''}
      ${displayMinutes}'`,
      labelShort: `${displayHours ? `${displayHours}h\u202F` : ''}
      ${displayMinutes}'`,
      noClick: true,
      modes: ['feed'],
      show: displayMinutes > 0
    },
    {
      Icon: MdPlayCircleOutline,
      onClick: e => {
        e.preventDefault()
        trackEvent(['ActionBar', 'audio', meta.url])
        toggleAudioPlayer({
          audioSource: meta.audioSource,
          title: meta.title,
          path: meta.path
        })
      },
      label: t('PodcastButtons/play'),
      modes: ['feed'],
      show: !!meta.audioSource
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
      label: !forceShortLabel ? t('article/actionbar/share') : '',
      modes: ['article-top', 'article-bottom', 'article-overlay'],
      show: true
    },
    {
      title: 'Leseposition',
      element:
        document.userProgress && displayMinutes > 1 ? (
          <UserProgress
            documentId={document.id}
            forceShortLabel={forceShortLabel}
            userProgress={
              !document.userProgress.percentage &&
              document.userProgress.max &&
              document.userProgress.max.percentage === 1
                ? document.userProgress.max
                : document.userProgress
            }
            noCallout={mode === 'article-overlay'}
          />
        ) : (
          <></>
        ),
      modes: ['article-overlay', 'feed'],
      show: true
    },
    {
      title: 'Dialog',
      element: (
        <DiscussionButton
          t={t}
          discussionId={discussionId}
          discussionPath={discussionPath}
          discussionQuery={discussionQuery}
          discussionCount={discussionCount}
          isDiscussionPage={isDiscussionPage}
          forceShortLabel={forceShortLabel}
        />
      ),
      modes: ['article-top', 'article-bottom', 'article-overlay', 'feed'],
      show: !!discussionId
    }
  ]
  const ActionItemsSecondary = [
    {
      title: 'Lesezeit',
      Icon: MdQueryBuilder,
      label: `${displayHours ? `${displayHours}h\u202F` : ''}
      ${displayMinutes} Minuten`,
      labelShort: `${displayHours ? `${displayHours}h\u202F` : ''}
      ${displayMinutes}'`,
      noClick: true,
      show: true
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
      show: (document.userProgress && displayMinutes > 1) || !podcast
    },
    {
      Icon: MdPlayCircleOutline,
      onClick: e => {
        e.preventDefault()
        trackEvent(['ActionBar', 'audio', meta.url])
        toggleAudioPlayer({
          audioSource: meta.audioSource,
          title: meta.title,
          path: meta.path
        })
      },
      label: t('PodcastButtons/play'),
      show: !!meta.audioSource
    },
    {
      Icon: MdMic,
      onClick: e => {
        e.preventDefault()
        trackEvent(['ActionBar', 'podcasts', meta.url])
        setPodcastOverlayVisible(!podcastOverlayVisible)
      },
      label: t('PodcastButtons/title'),
      show: !podcast && !!meta.audioSource
    }
  ]
  return (
    <>
      <div
        {...styles.topRow}
        {...(mode === 'article-overlay' && { ...styles.overlay })}
        {...(!!centered && { ...styles.centered })}
      >
        {ActionItems.filter(item => item.show && item.modes.includes(mode)).map(
          props => (
            <Fragment key={props.title}>
              {props.element || <IconButton {...props} />}
            </Fragment>
          )
        )}
      </div>
      {mode === 'article-top' && (
        <div {...styles.bottomRow} {...(!!centered && { ...styles.centered })}>
          {ActionItemsSecondary.filter(item => item.show).map(props => (
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
      {podcastOverlayVisible && (
        <PodcastOverlay
          onClose={() => setPodcastOverlayVisible(false)}
          title={t('article/actionbar/share')}
          podcast={podcast}
        />
      )}
    </>
  )
}

const styles = {
  topRow: css({
    display: 'flex'
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
    justifyContent: 'space-between'
  }),
  centered: css({
    justifyContent: 'center'
  })
}

export default compose(withT, withInNativeApp)(ActionBar)

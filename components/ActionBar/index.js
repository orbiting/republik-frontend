import React, { useState, Fragment, useContext } from 'react'
import { css } from 'glamor'
import { compose } from 'react-apollo'
import {
  MdPictureAsPdf,
  MdQueryBuilder,
  MdPlayCircleOutline,
  MdFileDownload,
  MdMic,
  MdModeEdit
} from 'react-icons/md'
import { IconButton, colors, Interaction } from '@project-r/styleguide'
import withT from '../../lib/withT'
import withInNativeApp, { postMessage } from '../../lib/withInNativeApp'
import { withEditor } from '../Auth/checkRoles'

import { splitByTitle } from '../../lib/utils/mdast'
import { shouldIgnoreClick } from '../../lib/utils/link'
import { trackEvent } from '../../lib/piwik'
import { getDiscussionLinkProps } from './utils'
import { PUBLIC_BASE_URL, PUBLIKATOR_BASE_URL } from '../../lib/constants'
import PdfOverlay, { getPdfUrl } from '../Article/PdfOverlay'
import FontSizeOverlay from '../FontSize/Overlay'
import ShareOverlay from './ShareOverlay'
import PodcastOverlay from './PodcastOverlay'
import { AudioContext } from '../Audio'

import FontSizeIcon from '../Icons/FontSize'
import ShareIOSIcon from '../Icons/ShareIOS'
import MdInsertChartOutlined from '../Icons/MdInsertChartOutlined'
import SubscribeMenu from '../Notifications/SubscribeMenu'
import BookmarkButton from './BookmarkButton'
import DiscussionLinkButton from './DiscussionLinkButton'
import UserProgress from './UserProgress'
import ShareButtons from './ShareButtons'

const ActionBar = ({
  mode,
  document,
  t,
  isEditor,
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

  const { toggleAudioPlayer } = useContext(AudioContext)

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
  const notBookmarkable = meta && meta.template === 'page'
  const isDiscussion = meta && meta.template === 'discussion'
  const emailSubject = t('article/share/emailSubject', {
    title: document.meta.title
  })
  const { discussionId } = getDiscussionLinkProps(
    meta.linkedDiscussion,
    meta.ownDiscussion,
    meta.template,
    meta.path
  )

  const readingMinutes = Math.max(
    meta.estimatedConsumptionMinutes,
    meta.estimatedReadingMinutes
  )

  const displayMinutes = readingMinutes % 60
  const displayHours = Math.floor(readingMinutes / 60)
  const forceShortLabel =
    mode === 'article-overlay' || mode === 'feed' || mode === 'bookmark'

  // centering
  const splitContent = document.content && splitByTitle(document.content)
  const titleNode =
    splitContent &&
    splitContent.title &&
    splitContent.title.children[splitContent.title.children.length - 1]
  const centered =
    (titleNode &&
      titleNode.data &&
      titleNode.data.center &&
      mode !== 'article-bottom') ||
    meta.template === 'format' ||
    meta.template === 'section'
  const readingTimeTitle = `${
    displayHours ? `${displayHours}h\u202F` : ''
  } ${displayMinutes} Minuten`
  const readingTimeLabel = !forceShortLabel
    ? `${displayHours ? `${displayHours}h\u202F` : ''}
      ${displayMinutes} Minuten`
    : `${displayHours ? `${displayHours}h\u202F` : ''}
      ${displayMinutes}'`
  const showReadingTime =
    (displayMinutes > 0 || displayHours > 0) &&
    (meta.template === 'article' || meta.template === 'editorialNewsletter')

  const ActionItems = [
    {
      title: readingTimeTitle,
      Icon: MdQueryBuilder,
      label: readingTimeLabel,
      labelShort: `${displayHours ? `${displayHours}h\u202F` : ''}
      ${displayMinutes}'`,
      modes: ['feed'],
      show: showReadingTime
    },
    {
      title: t('article/actionbar/userprogress'),
      element:
        document.userProgress && displayMinutes > 1 ? (
          <UserProgress
            documentId={document.id}
            forceShortLabel={forceShortLabel}
            userProgress={document.userProgress}
            noCallout={mode === 'article-overlay'}
            noScroll={mode === 'feed'}
          />
        ) : (
          <></>
        ),
      modes: ['article-overlay', 'feed', 'bookmark'],
      show: true
    },
    {
      title: t('feed/actionbar/chart'),
      Icon: MdInsertChartOutlined,
      modes: ['feed'],
      show: meta && meta.indicateChart
    },
    {
      title: t('article/actionbar/pdf/options'),
      Icon: MdPictureAsPdf,
      href: hasPdf ? getPdfUrl(meta) : undefined,
      onClick: e => {
        if (shouldIgnoreClick(e)) {
          return
        }
        e.preventDefault()
        setPdfOverlayVisible(!pdfOverlayVisible)
      },
      modes: ['article-top', 'article-bottom'],
      show: hasPdf
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
      title: t('SubscribeMenu/title'),
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
      title: t('bookmark/title/default'),
      element: (
        <BookmarkButton
          bookmarked={!!document.userBookmark}
          documentId={document.id}
          label={!forceShortLabel ? t('bookmark/label') : ''}
        />
      ),
      modes: [
        'article-top',
        'article-bottom',
        'article-overlay',
        'feed',
        'bookmark'
      ],
      show: !notBookmarkable
    },
    {
      title: t('PodcastButtons/play'),
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
      modes: ['article-top', 'article-overlay'],
      show: true
    },
    {
      title: t('article/actionbar/discussion'),
      element: (
        <DiscussionLinkButton
          t={t}
          document={document}
          isOnArticlePage={[
            'article-top',
            'article-bottom',
            'article-overlay'
          ].includes(mode)}
          forceShortLabel={forceShortLabel}
        />
      ),
      modes: ['article-top', 'article-bottom', 'article-overlay', 'feed'],
      show: !!discussionId
    },
    {
      Icon: MdModeEdit,
      href: `${PUBLIKATOR_BASE_URL}/repo/${document.repoId}/tree`,
      title: t('feed/actionbar/edit'),
      target: '_blank',
      fill: colors.social,
      modes: ['article-top'],
      show: isEditor && document.repoId && PUBLIKATOR_BASE_URL
    }
  ]

  const ActionItemsSecondary = [
    {
      title: readingTimeTitle,
      Icon: MdQueryBuilder,
      label: readingTimeLabel,
      labelShort: `${displayHours ? `${displayHours}h\u202F` : ''}
      ${displayMinutes}'`,
      no: true,
      show: showReadingTime
    },
    {
      title: t('article/actionbar/userprogress'),
      element:
        document.userProgress && displayMinutes > 1 ? (
          <UserProgress
            documentId={document.id}
            userProgress={document.userProgress}
          />
        ) : (
          <></>
        ),
      show: (document.userProgress && displayMinutes > 1) || !podcast
    },
    {
      title: t('PodcastButtons/play'),
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
      title: t('PodcastButtons/title'),
      Icon: MdMic,
      onClick: e => {
        e.preventDefault()
        trackEvent(['ActionBar', 'podcasts', meta.url])
        setPodcastOverlayVisible(!podcastOverlayVisible)
      },
      label: t('PodcastButtons/title'),
      show: !!podcast && meta.template !== 'format'
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
      {mode === 'article-bottom' && (
        <>
          <Interaction.P style={{ marginTop: 24 }}>
            <strong>{t('article/actionbar/share')}</strong>
          </Interaction.P>
          <ShareButtons
            url={meta.url}
            tweet=''
            emailSubject={emailSubject}
            emailBody=''
            emailAttachUrl
          />
        </>
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
          title={t('PodcastButtons/title')}
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
  }),
  shareTitle: css({
    margin: '16px 0 0 0'
  })
}

export default compose(withT, withInNativeApp, withEditor)(ActionBar)

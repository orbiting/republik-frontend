import React, { useState, Fragment } from 'react'
import { css } from 'glamor'
import { MdPictureAsPdf } from 'react-icons/md'

import { shouldIgnoreClick } from '../../lib/utils/link'
import { trackEvent } from '../../lib/piwik'
import { PUBLIC_BASE_URL } from '../../lib/constants'
import PdfOverlay, { getPdfUrl, countImages } from '../Article/PdfOverlay'
import FontSizeOverlay from '../FontSize/Overlay'
import ShareOverlay from '../ActionBar/ShareOverlay'
import IconButton from '../IconButton'

import FontSizeIcon from '../Icons/FontSize'
import ShareIOSIcon from '../Icons/ShareIOS'
import SubscribeMenu from '../Notifications/SubscribeMenu'
import Bookmark from '../ActionBar/Bookmark'

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
  const ActionItems = [
    {
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
      title: t(`article/actionbar/pdf/options}`),
      modes: ['article-top', 'article-bottom']
    },
    {
      Icon: FontSizeIcon,
      href: meta.url,
      onClick: e => {
        e.preventDefault()
        setFontSizeOverlayVisible(!fontSizeOverlayVisible)
      },
      title: t('article/actionbar/fontSize/title'),
      modes: ['article-top']
    },
    {
      element: (
        <SubscribeMenu
          discussionId={
            isDiscussion && meta.ownDiscussion && meta.ownDiscussion.id
          }
          subscriptions={document.subscribedBy.nodes}
          label={t('SubscribeMenu/title')}
        />
      ),
      modes: ['article-top']
    },
    {
      element: (
        <Bookmark
          bookmarked={!!document.userBookmark}
          documentId={document.id}
          label={t('bookmark/label')}
        />
      ),
      modes: ['article-top']
    },
    {
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
      title: t('article/actionbar/share'),
      label: 'Teilen',
      modes: ['article-top']
    }
  ]
  return (
    <>
      <div {...styles.topRow}>
        {ActionItems.filter(item => item.modes.includes(mode)).map(props => (
          <Fragment key={props.title}>
            {props.element || <IconButton {...props} />}
          </Fragment>
        ))}
      </div>
      {mode === 'article-top' && <div {...styles.bottomRow}></div>}

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
    display: 'flex'
  }),
  bottomRow: css({})
}

export default ActionBar

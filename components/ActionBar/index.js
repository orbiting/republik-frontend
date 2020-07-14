import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { compose } from 'react-apollo'

import UserProgress from './UserProgress'
import Bookmark from './Bookmark'
import IconLink from '../IconLink'
import ReadingTime from './ReadingTime'
import ShareOverlay from './ShareOverlay'
import FontSizeOverlay from '../FontSize/Overlay'
import withT from '../../lib/withT'
import withInNativeApp, { postMessage } from '../../lib/withInNativeApp'
import { trackEvent } from '../../lib/piwik'

import { colors } from '@project-r/styleguide'

import { shouldIgnoreClick } from '../../lib/utils/link'

import { PUBLIKATOR_BASE_URL } from '../../lib/constants'
import SubscribeMenu from '../Notifications/SubscribeMenu'

const styles = {
  buttonGroup: css({
    '@media print': {
      display: 'none'
    }
  })
}

class ActionBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showShareOverlay: false,
      showFontSizeOverlay: false
    }

    this.toggleShare = () => {
      this.setState({
        showShareOverlay: !this.state.showShareOverlay
      })
    }

    this.toggleFontSize = () => {
      this.setState({
        showFontSizeOverlay: !this.state.showFontSizeOverlay
      })
    }
  }

  render() {
    const {
      t,
      url,
      pocket,
      title,
      tweet,
      emailSubject,
      emailBody,
      emailAttachUrl,
      download,
      dossierUrl,
      fill,
      onAudioClick,
      onGalleryClick,
      onPdfClick,
      pdfUrl,
      fontSize,
      estimatedReadingMinutes,
      estimatedConsumptionMinutes,
      shareOverlayTitle,
      showBookmark,
      showShare,
      documentId,
      repoId,
      isEditor,
      bookmarked,
      inNativeApp,
      animate,
      inIOS,
      subscription,
      subscriptions,
      showSubscribe,
      isDiscussion,
      ownDiscussion,
      userProgress
    } = this.props
    const { showShareOverlay, showFontSizeOverlay } = this.state

    const icons = [
      showShare && {
        icon: inIOS ? 'shareIOS' : 'share',
        href: url,
        onClick: e => {
          e.preventDefault()

          trackEvent(['ActionBar', 'share', url])
          if (inNativeApp) {
            postMessage({
              type: 'share',
              payload: {
                title,
                url,
                subject: emailSubject,
                dialogTitle: shareOverlayTitle
              }
            })
            e.target.blur()
          } else {
            this.toggleShare()
          }
        },
        title: t('article/actionbar/share')
      },
      dossierUrl && {
        href: dossierUrl,
        icon: 'dossier',
        title: t('article/actionbar/dossier')
      },
      download && {
        target: '_blank',
        download: true,
        href: download,
        icon: 'download',
        title: t('article/actionbar/download')
      },
      pdfUrl && {
        icon: 'pdf',
        href: pdfUrl,
        onClick:
          onPdfClick &&
          (e => {
            if (shouldIgnoreClick(e)) {
              return
            }
            e.preventDefault()
            onPdfClick()
          }),
        title: t(`article/actionbar/pdf/${onPdfClick ? 'options' : 'open'}`)
      },
      fontSize && {
        icon: 'fontSize',
        href: url,
        onClick: e => {
          e.preventDefault()
          this.toggleFontSize()
        },
        title: t('article/actionbar/fontSize/title')
      },
      onAudioClick && {
        icon: 'audio',
        href: '#audio',
        onClick: e => {
          e.preventDefault()
          trackEvent(['ActionBar', 'audio', url])
          onAudioClick && onAudioClick()
        },
        title: t('article/actionbar/audio'),
        animate
      },
      onGalleryClick && {
        icon: 'gallery',
        href: '#gallery',
        onClick: e => {
          e.preventDefault()
          trackEvent(['ActionBar', 'gallery', url])
          onGalleryClick && onGalleryClick()
        },
        title: t('feed/actionbar/gallery'),
        size: 23
      }
    ]

    const editorIcons = [
      repoId &&
        PUBLIKATOR_BASE_URL && {
          icon: 'edit',
          href: `${PUBLIKATOR_BASE_URL}/repo/${repoId}/tree`,
          title: t('feed/actionbar/edit'),
          size: 23,
          target: '_blank'
        }
    ]

    const displayConsumptionMinutes =
      estimatedConsumptionMinutes > estimatedReadingMinutes
        ? estimatedConsumptionMinutes
        : estimatedReadingMinutes

    return (
      <Fragment>
        {showShareOverlay && (
          <ShareOverlay
            onClose={this.toggleShare}
            url={url}
            pocket={pocket}
            title={shareOverlayTitle || t('article/actionbar/share')}
            tweet={tweet}
            emailSubject={emailSubject}
            emailBody={emailBody}
            emailAttachUrl={emailAttachUrl}
          />
        )}
        {showFontSizeOverlay && (
          <FontSizeOverlay onClose={this.toggleFontSize} />
        )}
        <span {...styles.buttonGroup}>
          {showBookmark && (
            <Bookmark
              bookmarked={bookmarked}
              documentId={documentId}
              active={false}
              size={28}
              style={{ marginLeft: '-4px', paddingRight: 0 }}
            />
          )}
          {showSubscribe && subscriptions && (
            <SubscribeMenu
              discussionId={isDiscussion && ownDiscussion && ownDiscussion.id}
              subscriptions={subscriptions}
              style={{ marginRight: -2, marginLeft: 2 }}
            />
          )}
          {icons.filter(Boolean).map((props, i) => (
            <IconLink key={props.icon} fill={fill} {...props} />
          ))}
          {displayConsumptionMinutes > 1 && (
            <ReadingTime minutes={displayConsumptionMinutes} />
          )}
          {userProgress && estimatedReadingMinutes > 1 && (
            <UserProgress
              userProgress={
                !userProgress.percentage &&
                userProgress.max &&
                userProgress.max.percentage === 1
                  ? userProgress.max
                  : userProgress
              }
            />
          )}
          {isEditor &&
            editorIcons
              .filter(Boolean)
              .map((props, i) => (
                <IconLink key={props.icon} fill={colors.social} {...props} />
              ))}
        </span>
      </Fragment>
    )
  }
}

ActionBar.propTypes = {
  url: PropTypes.string.isRequired,
  tweet: PropTypes.string.isRequired,
  emailSubject: PropTypes.string.isRequired,
  emailBody: PropTypes.string.isRequired,
  emailAttachUrl: PropTypes.bool.isRequired,
  fill: PropTypes.string,
  onAudioClick: PropTypes.func,
  onGalleryClick: PropTypes.func,
  onPdfClick: PropTypes.func,
  pdfUrl: PropTypes.string,
  estimatedReadingMinutes: PropTypes.number,
  shareOverlayTitle: PropTypes.string,
  showBookmark: PropTypes.bool,
  showSubscribe: PropTypes.bool,
  subscription: PropTypes.object,
  isDiscussion: PropTypes.bool,
  ownDiscussion: PropTypes.object
}

ActionBar.defaultProps = {
  tweet: '',
  emailBody: '',
  emailAttachUrl: true,
  showShare: true
}

export default compose(withInNativeApp, withT)(ActionBar)

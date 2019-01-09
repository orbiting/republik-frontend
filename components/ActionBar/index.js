import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { compose } from 'react-apollo'

import Bookmark, { BOOKMARKS_LIST_NAME } from './Bookmark'
import IconLink from '../IconLink'
import ReadingTime from './ReadingTime'
import ShareOverlay from './ShareOverlay'
import { withEditor } from '../Auth/checkRoles'
import withT from '../../lib/withT'
import { postMessage } from '../../lib/withInNativeApp'
import track from '../../lib/piwik'

import { colors } from '@project-r/styleguide'

import { shouldIgnoreClick } from '../Link/utils'

const styles = {
  buttonGroup: css({
    '@media print': {
      display: 'none'
    }
  })
}

class ActionBar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showShareOverlay: false
    }

    this.toggleShare = () => {
      this.setState({
        showShareOverlay: !this.state.showShareOverlay
      })
    }
  }
  render () {
    const {
      t,
      url,
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
      estimatedReadingMinutes,
      shareOverlayTitle,
      showBookmark,
      documentId,
      userListItems,
      inNativeApp,
      isEditor
    } = this.props
    const { showShareOverlay } = this.state

    const icons = [
      {
        icon: 'share',
        href: url,
        onClick: e => {
          e.preventDefault()

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
            track([
              'trackEvent',
              'ActionBar',
              'share',
              url
            ])
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
        onClick: onPdfClick && (e => {
          if (shouldIgnoreClick(e)) {
            return
          }
          e.preventDefault()
          onPdfClick()
        }),
        title: t(`article/actionbar/pdf/${onPdfClick ? 'options' : 'open'}`)
      },
      onAudioClick && {
        icon: 'audio',
        href: '#audio',
        onClick: e => {
          e.preventDefault()
          onAudioClick && onAudioClick()
        },
        title: t('article/actionbar/audio')
      },
      isEditor && onGalleryClick && {
        icon: 'gallery',
        href: '#gallery',
        onClick: e => {
          e.preventDefault()
          onGalleryClick && onGalleryClick()
        },
        title: t('feed/actionbar/gallery'),
        size: 22
      }
    ]

    const bookmarked =
      userListItems &&
      !!userListItems.length &&
      !!userListItems.find(
        item => item.documentList && item.documentList.name === BOOKMARKS_LIST_NAME
      )

    return (
      <Fragment>
        {showShareOverlay && (
          <ShareOverlay
            onClose={this.toggleShare}
            url={url}
            title={shareOverlayTitle || t('article/actionbar/share')}
            tweet={tweet}
            emailSubject={emailSubject}
            emailBody={emailBody}
            emailAttachUrl={emailAttachUrl} />
        )}
        <span {...styles.buttonGroup}>
          {isEditor && showBookmark && (
            <Bookmark
              bookmarked={bookmarked}
              documentId={documentId}
              active={false}
              size={28}
              style={{ marginLeft: '-4px', paddingRight: 0 }}
            />
          )}
          {icons
            .filter(Boolean)
            .map((props, i) => <IconLink key={props.icon} fill={fill} {...props} />)}
          {isEditor && estimatedReadingMinutes && (
            <ReadingTime minutes={estimatedReadingMinutes} />
          )}
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
  showBookmark: PropTypes.bool
}

ActionBar.defaultProps = {
  fill: colors.secondary,
  tweet: '',
  emailBody: '',
  emailAttachUrl: true
}

export default compose(
  withEditor,
  withT
)(ActionBar)

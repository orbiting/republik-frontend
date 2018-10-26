import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { compose } from 'react-apollo'

import IconLink from '../IconLink'
import ShareOverlay from './ShareOverlay'
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
      onPdfClick,
      pdfUrl,
      shareOverlayTitle,
      inNativeApp
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
      }
    ]

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
          {icons
            .filter(Boolean)
            .map((props, i) => <IconLink key={props.icon} fill={fill} {...props} />)}
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
  onPdfClick: PropTypes.func,
  pdfUrl: PropTypes.string,
  shareOverlayTitle: PropTypes.string
}

ActionBar.defaultProps = {
  fill: colors.secondary,
  tweet: '',
  emailBody: '',
  emailAttachUrl: true
}

export default compose(
  withT
)(ActionBar)

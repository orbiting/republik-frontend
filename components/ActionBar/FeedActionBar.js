import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { compose } from 'react-apollo'

import Bookmark from './Bookmark'
import DiscussionIconLink from '../Discussion/IconLink'
import IconLink from '../IconLink'
import ReadingTime from './ReadingTime'
import withT from '../../lib/withT'

import { colors } from '@project-r/styleguide'

const styles = {
  buttonGroup: css({
    '@media print': {
      display: 'none'
    }
  })
}

const ActionBar = ({
  t,
  bookmarked,
  dossier,
  hasAudio,
  hasGallery,
  hasVideo,
  readingMinutes,
  linkedDiscussion
}) => {
  const icons = [
    dossier && {
      icon: 'dossier',
      title: t('feed/actionbar/dossier')
    },
    hasGallery && {
      icon: 'gallery',
      title: t('feed/actionbar/gallery')
    },
    hasAudio && {
      icon: 'audio',
      title: t('feed/actionbar/audio'),
      size: 22
    },
    hasVideo && {
      icon: 'video',
      title: t('feed/actionbar/video'),
      size: 22,
      style: { paddingTop: 1 }
    }
  ]

  return (
    <Fragment>
      <span {...styles.buttonGroup}>
        <Bookmark
          bookmarked={bookmarked}
          documentId={'foo'}
          listId={'bar'}
          active={false}
          small
          style={{ marginLeft: '-4px' }}
        />
        {icons
          .filter(Boolean)
          .map((props, i) => (
            <IconLink
              key={props.icon}
              size={20}
              fill={colors.lightText}
              {...props}
            />
          ))}
        {readingMinutes && (
          <ReadingTime minutes={readingMinutes} small />
        )}
        {linkedDiscussion &&
        !linkedDiscussion.closed &&
        process.browser && (
          <DiscussionIconLink
            discussionId={linkedDiscussion.id}
            path={linkedDiscussion.path}
            small
            style={{ marginLeft: 5 }}
          />
        )}
      </span>
    </Fragment>
  )
}

ActionBar.propTypes = {
  bookmarked: PropTypes.bool,
  dossier: PropTypes.object,
  hasAudio: PropTypes.bool,
  hasGallery: PropTypes.bool,
  hasVideo: PropTypes.bool,
  readingMinutes: PropTypes.number,
  linkedDiscussion: PropTypes.object
}

// TODO: remove and wire up with API.
ActionBar.defaultProps = {
  dossier: {},
  hasAudio: true,
  hasGallery: true,
  hasVideo: true,
  readingMinutes: 7
}

export default compose(
  withT
)(ActionBar)

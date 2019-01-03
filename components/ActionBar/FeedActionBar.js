import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { compose } from 'react-apollo'

import Bookmark from './Bookmark'
import DiscussionIconLink from '../Discussion/IconLink'
import IconLink from '../IconLink'
import PathLink from '../Link/Path'
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

export const ActionLink = ({ children, path, icon, hasAudio }) => {
  if (icon === 'audio' && hasAudio) {
    return (
      <PathLink path={path} query={{ audio: 1 }} passHref>
        {children}
      </PathLink>
    )
  }

  return children
}

const ActionBar = ({
  t,
  documentId,
  listId,
  audioSource,
  bookmarked,
  dossier,
  hasGallery,
  hasVideo,
  readingMinutes,
  linkedDiscussion,
  path
}) => {
  const hasAudio = !!audioSource
  const icons = [
    dossier && {
      icon: 'dossier',
      title: t('feed/actionbar/dossier')
    },
    hasGallery && {
      icon: 'gallery',
      title: t('feed/actionbar/gallery'),
      size: 22
    },
    hasAudio && {
      icon: 'audio',
      title: t('feed/actionbar/audio'),
      size: 22,
      color: colors.text
    },
    hasVideo && {
      icon: 'video',
      title: t('feed/actionbar/video'),
      size: 17,
      style: { paddingBottom: 2 }
    }
  ]

  return (
    <Fragment>
      <span {...styles.buttonGroup}>
        <Bookmark
          bookmarked={bookmarked}
          documentId={documentId}
          listId={listId}
          active={false}
          small
          style={{ marginLeft: '-4px' }}
        />
        {icons
          .filter(Boolean)
          .map((props, i) => (
            <ActionLink path={path} hasAudio={hasAudio} {...props}>
              <IconLink
                key={props.icon}
                size={20}
                fill={props.color || colors.lightText}
                {...props}
              />
            </ActionLink>
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
          />
        )}
      </span>
    </Fragment>
  )
}

ActionBar.propTypes = {
  documentId: PropTypes.string.isRequired,
  listId: PropTypes.string.isRequired,
  audioSource: PropTypes.object,
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
  documentId: 'foo',
  listId: 'bar',
  dossier: {},
  hasGallery: true,
  hasVideo: true,
  readingMinutes: 7
}

export default compose(
  withT
)(ActionBar)

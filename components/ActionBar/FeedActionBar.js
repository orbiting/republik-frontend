import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { compose } from 'react-apollo'

import Bookmark, { BOOKMARKS_LIST_NAME } from './Bookmark'
import DiscussionIconLink from '../Discussion/IconLink'
import IconLink from '../IconLink'
import PathLink from '../Link/Path'
import ReadingTime from './ReadingTime'
import { withEditor } from '../Auth/checkRoles'
import withT from '../../lib/withT'

import { colors } from '@project-r/styleguide'

const styles = {
  buttonGroup: css({
    '@media print': {
      display: 'none'
    }
  })
}

export const ActionLink = ({ children, path, icon, hasAudio, indicateGallery }) => {
  if (icon === 'audio' && hasAudio) {
    return (
      <PathLink path={path} query={{ audio: 1 }} passHref>
        {children}
      </PathLink>
    )
  }
  if (icon === 'gallery' && indicateGallery) {
    return (
      <PathLink path={path} query={{ gallery: 1 }} passHref>
        {children}
      </PathLink>
    )
  }

  return children
}

const ActionBar = ({
  t,
  documentId,
  audioSource,
  dossier,
  indicateChart,
  indicateGallery,
  indicateVideo,
  estimatedReadingMinutes,
  linkedDiscussion,
  path,
  userListItems,
  isEditor
}) => {
  // TODO: remove guard for public launch.
  if (!isEditor) {
    return null
  }

  const hasAudio = !!audioSource
  const icons = [
    dossier && {
      icon: 'dossier',
      title: t('feed/actionbar/dossier')
    },
    indicateGallery && {
      icon: 'gallery',
      title: t('feed/actionbar/gallery'),
      size: 21,
      color: colors.text
    },
    hasAudio && {
      icon: 'audio',
      title: t('feed/actionbar/audio'),
      size: 22,
      color: colors.text
    },
    indicateVideo && {
      icon: 'video',
      title: t('feed/actionbar/video'),
      size: 17,
      style: { paddingBottom: 2 }
    },
    indicateChart && {
      icon: 'chart',
      title: t('feed/actionbar/chart'),
      size: 18
    }
  ]

  const bookmarked =
    userListItems &&
    !!userListItems.length &&
    !!userListItems.find(
      item => item.list && item.list.name === BOOKMARKS_LIST_NAME
    )

  return (
    <Fragment>
      <span {...styles.buttonGroup}>
        <Bookmark
          bookmarked={bookmarked}
          documentId={documentId}
          active={false}
          small
          style={{ marginLeft: '-4px', paddingRight: '3px' }}
        />
        {icons
          .filter(Boolean)
          .map((props, i) => (
            <ActionLink key={props.icon} path={path} hasAudio={hasAudio} indicateGallery={indicateGallery} {...props}>
              <IconLink
                size={20}
                fill={props.color || colors.lightText}
                {...props}
              />
            </ActionLink>
          ))}
        {estimatedReadingMinutes > 1 && (
          <ReadingTime minutes={estimatedReadingMinutes} small />
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
  audioSource: PropTypes.object,
  dossier: PropTypes.object,
  hasAudio: PropTypes.bool,
  indicateGallery: PropTypes.bool,
  indicateVideo: PropTypes.bool,
  estimatedReadingMinutes: PropTypes.number,
  linkedDiscussion: PropTypes.object
}

export default compose(
  withEditor,
  withT
)(ActionBar)

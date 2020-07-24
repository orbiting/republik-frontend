import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { compose } from 'react-apollo'

import Bookmark from './Bookmark'
import { DiscussionIconLinkWithoutEnhancer } from '../Discussion/IconLink'
import { getDiscussionIconLinkProps } from './utils'
import IconLink from '../IconLink'
import ShadowQueryLink from '../Link/ShadowQuery'
import ReadingTime from './ReadingTime'
import UserProgress from './UserProgress'
import withT from '../../lib/withT'

import { colors } from '@project-r/styleguide'
import SubscribeMenu from '../Notifications/SubscribeMenu'

const styles = {
  buttonGroup: css({
    '@media print': {
      display: 'none'
    }
  })
}

const ActionLink = ({ children, path, icon, hasAudio, indicateGallery }) => {
  if (icon === 'audio' && hasAudio) {
    return (
      <ShadowQueryLink path={path} query={{ audio: 1 }} passHref>
        {children}
      </ShadowQueryLink>
    )
  }
  if (icon === 'gallery' && indicateGallery) {
    return (
      <ShadowQueryLink path={path} query={{ gallery: 1 }} passHref>
        {children}
      </ShadowQueryLink>
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
  estimatedConsumptionMinutes,
  linkedDiscussion,
  ownDiscussion,
  template,
  path,
  userBookmark,
  userProgress,
  subscription,
  showSubscribe
}) => {
  const hasAudio = !!audioSource
  const icons = [
    dossier && {
      icon: 'dossier',
      title: t('feed/actionbar/dossier')
    },
    indicateGallery && {
      icon: 'gallery',
      title: t('feed/actionbar/gallery'),
      size: 24,
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
      style: { marginTop: '-3px' }
    },
    indicateChart && {
      icon: 'chart',
      title: t('feed/actionbar/chart'),
      size: 24
    }
  ]

  const {
    discussionId,
    discussionPath,
    discussionQuery,
    discussionCount
  } = getDiscussionIconLinkProps(
    linkedDiscussion,
    ownDiscussion,
    template,
    path
  )

  const displayConsumptionMinutes =
    estimatedConsumptionMinutes > estimatedReadingMinutes
      ? estimatedConsumptionMinutes
      : estimatedReadingMinutes

  return (
    <Fragment>
      <span {...styles.buttonGroup}>
        <Bookmark
          bookmarked={!!userBookmark}
          documentId={documentId}
          active={false}
          small
          style={{ marginLeft: '-4px', paddingRight: '3px' }}
        />
        {showSubscribe && subscription && (
          <SubscribeMenu
            subscription={subscription}
            style={{ marginRight: -1 }}
          />
        )}
        {icons.filter(Boolean).map((props, i) => (
          <ActionLink
            key={props.icon}
            path={path}
            hasAudio={hasAudio}
            indicateGallery={indicateGallery}
            {...props}
          >
            <IconLink
              size={20}
              fill={props.color || colors.lightText}
              {...props}
            />
          </ActionLink>
        ))}
        {displayConsumptionMinutes > 1 && (
          <ReadingTime minutes={displayConsumptionMinutes} small />
        )}
        {userProgress && estimatedReadingMinutes > 1 && (
          <UserProgress
            small
            userProgress={
              !userProgress.percentage &&
              userProgress.max &&
              userProgress.max.percentage === 1
                ? userProgress.max
                : userProgress
            }
          />
        )}
        {discussionId && (
          <DiscussionIconLinkWithoutEnhancer
            discussionId={discussionId}
            path={discussionPath}
            query={discussionQuery}
            discussionCommentsCount={discussionCount}
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
  estimatedConsumptionMinutes: PropTypes.number,
  linkedDiscussion: PropTypes.object,
  subscription: PropTypes.object,
  showSubscribe: PropTypes.bool
}

export default compose(withT)(ActionBar)

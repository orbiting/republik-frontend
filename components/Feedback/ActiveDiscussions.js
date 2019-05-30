import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css, merge } from 'glamor'
import { compose } from 'react-apollo'

import ArticleItem from './ArticleItem'
import { withActiveDiscussions } from './enhancers'

import { Link } from '../../lib/routes'
import PathLink from '../Link/Path'
import { GENERAL_FEEDBACK_DISCUSSION_ID } from '../../lib/constants'

import {
  Interaction,
  Loader,
  colors,
  fontStyles,
  mediaQueries,
  linkRule
} from '@project-r/styleguide'

const styles = {
  item: merge(linkRule, css({
    color: colors.text,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    textAlign: 'left',
    padding: '10px 0',
    cursor: 'pointer',
    '&:hover': {
      background: colors.secondaryBg,
      margin: '0 -15px',
      padding: '10px 15px',
      width: 'calc(100% + 30px)'
    },
    '& ~ &': {
      borderTop: `1px solid ${colors.divider}`
    },
    '&:hover + &': {
      borderColor: 'transparent'
    },
    '& + &:hover': {
      borderColor: 'transparent'
    },
    ...fontStyles.sansSerifRegular18,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular21
    }
  }))
}

const DiscussionLink = ({
  children,
  discussion
}) => {
  let tab
  if (discussion && discussion.document) {
    const meta = discussion.document.meta || {}
    const ownDiscussion = meta.ownDiscussion && !meta.ownDiscussion.closed
    const template = meta.template
    tab =
      (ownDiscussion && template === 'article' && 'article') ||
      (discussion && discussion.id === GENERAL_FEEDBACK_DISCUSSION_ID && 'general')
  }
  if (tab) {
    return (
      <Link
        route='discussion'
        params={{ t: tab, id: discussion.id }}
        passHref
      >
        {children}
      </Link>
    )
  }
  if (discussion) {
    const path = discussion.document &&
      discussion.document.meta &&
      discussion.document.meta.path
      ? discussion.document.meta.path
      : discussion.path
    if (path) {
      return (
        <PathLink
          path={path}
          passHref
        >
          {children}
        </PathLink>
      )
    }
  }
  return children
}

const ActiveDiscussionItem = ({ discussion, onClick, label, selected, path }) => (
  <DiscussionLink discussion={discussion} passHref>
    <a
      {...styles.item}
      style={{ color: selected ? colors.primary : undefined }}
    >
      <ArticleItem
        title={label}
        newPage={!!path}
        selected={selected}
        iconSize={24}
        Wrapper={Interaction.P}
      />
    </a>
  </DiscussionLink>
)

class ActiveDiscussions extends Component {
  render () {
    const { discussionId, ignoreDiscussionId, data } = this.props

    const activeDiscussions = data &&
      data.activeDiscussions &&
      data.activeDiscussions.filter(
        activeDiscussion => (
          activeDiscussion.discussion.id !== ignoreDiscussionId &&
          !activeDiscussion.discussion.closed
        )
      ).slice(0, 10)

    return (
      <Loader
        loading={data.loading}
        error={data.error}
        render={() => {
          return (
            <div>
              {activeDiscussions && activeDiscussions.map(activeDiscussion => {
                const discussion = activeDiscussion.discussion
                const selected = discussionId && discussionId === discussion.id
                const meta = discussion.document ? discussion.document.meta : {}
                const path = meta && meta.template === 'discussion' && discussion.path
                return (
                  <ActiveDiscussionItem
                    key={discussion.id}
                    label={discussion.title}
                    selected={selected}
                    discussion={discussion}
                    path={path} />
                )
              })}
            </div>
          )
        }}
      />
    )
  }
}

ActiveDiscussions.propTypes = {
  discussionId: PropTypes.string,
  ignoreDiscussionId: PropTypes.string,
  onChange: PropTypes.func
}

export default compose(
  withActiveDiscussions
)(ActiveDiscussions)

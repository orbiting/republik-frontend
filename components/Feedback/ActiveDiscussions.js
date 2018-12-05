import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { compose } from 'react-apollo'

import ArticleItem from './ArticleItem'
import { withActiveDiscussions } from './enhancers'

import { Router } from '../../lib/routes'

import {
  Interaction,
  Loader,
  colors,
  fontStyles,
  mediaQueries
} from '@project-r/styleguide'

const styles = {
  button: css({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    textAlign: 'left',
    padding: '10px 0',
    outline: 'none',
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 'none',
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
  })
}

const ActiveDiscussionItem = ({ onClick, label, selected, path }) => (
  <button
    {...styles.button}
    style={{ color: selected ? colors.primary : undefined }}
    onClick={e => {
      e.preventDefault()
      e.stopPropagation()
      if (path) {
        Router.pushRoute(path)
      } else {
        onClick()
      }
    }}
  >
    <ArticleItem
      title={label}
      newPage={!!path}
      selected={selected}
      iconSize={24}
      Wrapper={Interaction.P}
    />
  </button>
)

class ActiveDiscussions extends Component {
  render () {
    const { discussionId, ignoreDiscussionId, onChange, data } = this.props

    const activeDiscussions = data &&
      data.activeDiscussions &&
      data.activeDiscussions.filter(
        activeDiscussion => activeDiscussion.discussion.id !== ignoreDiscussionId
      ).slice(0, 5)

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
                    onClick={() => {
                      onChange(selected ? null : {
                        discussionId: discussion.id,
                        meta
                      })
                    }}
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

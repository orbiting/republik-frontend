import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { compose } from 'react-apollo'

import withT from '../../lib/withT'

import ArticleItem from './ArticleItem'
import { withActiveDiscussions } from './enhancers'

import { Router } from '../../lib/routes'

import {
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

const RowItem = ({ onClick, label, selected, path }) => (
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
    <ArticleItem title={label} newPage={!!path} />
  </button>
)

class Hitlist extends Component {
  constructor (props, ...args) {
    super(props, ...args)

    this.state = {
      inputValue: null,
      filter: ''
    }

    this.setFocusRef = ref => {
      this.focusRef = ref
    }
  }

  updateFocus () {
    if (this.focusRef && this.focusRef.input) {
      if (this.props.allowFocus) {
        this.focusRef.input.focus()
      } else {
        this.focusRef.input.blur()
      }
    }
  }

  componentDidMount () {
    this.updateFocus()
  }

  componentDidUpdate () {
    this.updateFocus()
  }

  render () {
    const { discussionId, ignoreDiscussionId, onChange, data } = this.props
    console.log(data)

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
                const path = discussion.document && discussion.document.meta.template === 'discussion' && discussion.path
                return (
                  <RowItem
                    key={discussion.id}
                    label={discussion.title}
                    selected={selected}
                    onClick={() => { onChange(selected ? null : discussion.id) }}
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

Hitlist.propTypes = {
  t: PropTypes.func,
  value: PropTypes.object,
  allowSearch: PropTypes.bool,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  onReset: PropTypes.func
}

export default compose(
  withT,
  withActiveDiscussions
)(Hitlist)

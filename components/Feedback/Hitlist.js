import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import withT from '../../lib/withT'

import NewPage from 'react-icons/lib/md/open-in-new'

import {
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
  }),
  label: css({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }),
  icon: css({
    display: 'inline-block',
    marginLeft: 10,
    marginTop: '-2px',
    [mediaQueries.mUp]: {

    }
  })
}

const RowItem = ({ onClick, label, selected, newPage }) => (
  <button
    {...styles.button}
    style={{ color: selected ? colors.primary : undefined }}
    onClick={e => {
      e.preventDefault()
      e.stopPropagation()
      onClick()
    }}
  >
    <span {...styles.label}>{label}</span>
    {newPage && (
      <div {...styles.icon} title={'Zur Debattenseite'}>
        <NewPage size={24} fill={colors.disabled} />
      </div>)}
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
    const { items, value, onChange } = this.props

    return (
      <div>
        {items.slice(0, 5).map(item => {
          const selected = value && value.id === item.value.id
          return (
            <RowItem
              key={item.value.id}
              label={item.text}
              selected={selected}
              onClick={() => { onChange(selected ? null : item.value) }}
              newPage={item.value && item.value.discussion && item.value.discussion.type !== 'auto'} />
          )
        })}
      </div>
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

export default withT(Hitlist)

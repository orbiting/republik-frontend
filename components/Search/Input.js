import React, { Component } from 'react'
import { css } from 'glamor'

import Close from 'react-icons/lib/md/close'
import Search from 'react-icons/lib/md/search'

import {
  Field,
  colors
} from '@project-r/styleguide'

const styles = {
  icon: css({
    cursor: 'pointer'
  })
}

const Icon = ({IconComponent, onClick, title}) => (
  <span title={title} {...styles.icon}>
    <IconComponent
      fill={colors.text}
      size={30}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }} />
  </span>
)

class Input extends Component {
  constructor (props, ...args) {
    super(props, ...args)

    this.setFocusRef = ref => {
      this.focusRef = ref
    }
  }

  autoFocus () {
    if (this.props.allowFocus && this.focusRef && this.focusRef.input) {
      this.focusRef.input.focus()
    }
  }

  componentDidMount () {
    this.autoFocus()
  }

  componentDidUpdate () {
    this.autoFocus()
  }

  render () {
    const { value, allowSearch, onChange, onSearch, onReset } = this.props
    return (
      <div>
        <Field
          label='Suche'
          value={value}
          ref={this.setFocusRef}
          onChange={onChange}
          onSearch={onSearch}
          onReset={() => {}}
          icon={
            !value ? (
              null
            ) : allowSearch ? (
              <Icon IconComponent={Search} onClick={onSearch} title='Suchen' />
            ) : (
              <Icon
                IconComponent={Close}
                onClick={onReset}
                title='Suche zurücksetzen'
              />
            )
          }
        />
      </div>
    )
  }
}

export default Input

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import withT from '../../lib/withT'

import Close from 'react-icons/lib/md/close'

import {
  Field,
  colors
} from '@project-r/styleguide'

const styles = {
  button: css({
    outline: 'none',
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 'none',
    padding: '0',
    cursor: 'pointer'
  })
}

const Icon = ({ IconComponent, onClick, title }) => (
  <button
    title={title}
    {...styles.button}
    onClick={e => {
      e.preventDefault()
      e.stopPropagation()
      onClick()
    }}
  >
    <IconComponent fill={colors.text} size={30} />
  </button>
)

class Input extends Component {
  constructor (props, ...args) {
    super(props, ...args)

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
    const { t, value, allowSearch, onChange, onSearch, onReset } = this.props
    return (
      <div>
        <Field
          label={t('search/input/label')}
          value={value}
          ref={this.setFocusRef}
          onChange={onChange}
          onSearch={onSearch}
          onReset={() => {}}
          icon={
            !value || allowSearch ? (
              null
            ) : (
              <Icon
                IconComponent={Close}
                onClick={onReset}
                title={t('search/input/reset/aria')}
              />
            )
          }
        />
      </div>
    )
  }
}

Input.propTypes = {
  t: PropTypes.func,
  value: PropTypes.string,
  allowSearch: PropTypes.bool,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  onReset: PropTypes.func
}

export default withT(Input)

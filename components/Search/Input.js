import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import withT from '../../lib/withT'

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
            !value ? (
              null
            ) : allowSearch ? (
              <Icon IconComponent={Search} onClick={onSearch} title={t('search/input/submit/aria')} />
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

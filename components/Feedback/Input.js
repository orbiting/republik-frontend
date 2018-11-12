import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import withT from '../../lib/withT'

import Close from 'react-icons/lib/md/close'
import Search from 'react-icons/lib/md/search'

import {
  Autocomplete,
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

const Icon = ({ IconComponent, onClick, title, fill }) => (
  <button
    title={title}
    {...styles.button}
    onClick={onClick ? e => {
      e.preventDefault()
      e.stopPropagation()
      onClick()
    } : undefined}
  >
    <IconComponent fill={fill} size={30} />
  </button>
)

class Input extends Component {
  constructor (props, ...args) {
    super(props, ...args)

    this.state = {
      // filter: '',
      /* items: [
        {text: 'Januar', value: '01'},
        {text: 'Februar', value: '02'},
        {text: 'März', value: '03'},
        {text: 'April', value: '04'},
        {text: 'Mai', value: '05'},
        {text: 'Juni', value: '06'},
        {text: 'Juli', value: '07'},
        {text: 'August', value: '08'},
        {text: 'September', value: '09'},
        {text: 'Oktober', value: '10'},
        {text: 'November', value: '10'},
        {text: 'Dezember', value: '10'}
      ] */
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
    const { t, value, filter, onFilterChange, onChange, onReset, items } = this.props

    return (
      <div>
        <Autocomplete
          label={t('search/input/label')}
          value={value}
          filter={filter}
          onChange={
            valueObj => {
              // this.setState({value: valueObj})
              onChange(valueObj.value)
              // this.setState({filter: 'x'})
            }
          }
          onFilterChange={
            // filter => this.setState({filter})
            onFilterChange
          }
          items={
            items.filter(
              ({ text }) =>
                !filter || text.toLowerCase().includes(filter.toLowerCase())
            )
          }
          icon={
            value && filter ? (
              <Icon
                IconComponent={Close}
                fill={filter ? colors.text : colors.disabled}
                onClick={onReset}
                title={t('search/input/reset/aria')}
              />
            ) : (
              <Icon
                IconComponent={Search}
                fill={filter ? colors.text : colors.disabled}
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
  value: PropTypes.object,
  allowSearch: PropTypes.bool,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  onReset: PropTypes.func
}

export default withT(Input)

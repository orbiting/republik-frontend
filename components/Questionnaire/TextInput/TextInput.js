import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import Textarea from 'react-textarea-autosize'
import { colors, fontStyles } from '@project-r/styleguide'
import TextInputProgress from './TextInputProgress'

const styles = {
  form: css({
    borderTop: '1px solid white'
  }),
  textArea: css({
    width: '100%',
    minWidth: '100%',
    maxWidth: '100%',
    minHeight: '60px',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    ...fontStyles.sansSerifRegular21,
    color: colors.text
  }),
  textAreaEmpty: css({
    color: colors.lightText,
    '::-webkit-input-placeholder': {
      color: colors.lightText
    }
  }),
  maxLength: css({
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '-10px',
    padding: '0 12px'
  }),
  remaining: css({
    ...fontStyles.sansSerifRegular14,
    lineHeight: '20px',
    padding: '0 5px'
  })
}

class TextInput extends Component {
  getStats = () => {
    const { text = '', maxLength } = this.props
    return {
      count: text.length,
      progress: text.length / maxLength * 100
    }
  }

  renderProgress = () => {
    const { maxLength } = this.props
    if (!maxLength) return null

    const { count, progress } = this.getStats()
    const remaining = maxLength - count
    const progressColor = progress > 100 ? colors.error : colors.text
    return (
      <div {...styles.maxLength}>
        {remaining < 21 &&
        <span {...styles.remaining} style={{ color: progressColor }}>
          {remaining}
        </span>}
        <TextInputProgress
          stroke={progressColor}
          radius={9}
          strokeWidth={2}
          progress={Math.min(progress, 100)}
        />
      </div>
    )
  }

  render () {
    const { text, placeholder, onChange } = this.props
    return (
      <div {...styles.form}>
        <Textarea
          {...styles.textArea}
          {...(text === '' ? styles.textAreaEmpty : {})}
          placeholder={placeholder}
          value={text}
          rows='1'
          onChange={onChange}
        />
        {this.renderProgress()}
      </div>
    )
  }
}

TextInput.propTypes = {
  placeholder: PropTypes.string,
  text: PropTypes.string,
  maxLength: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  overflow: PropTypes.bool
}

TextInput.defaultProps = {
  placeholder: '',
  text: '',
  overflow: true
}

export default TextInput

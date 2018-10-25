import React, { Component } from 'react'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import Loader from '../Loader'
import { css, merge } from 'glamor'
import Question, { questionStyles } from './questionStyles'
import debounce from 'lodash.debounce'

import {
  colors,
  NarrowContainer,
  FigureCaption,
  FigureImage,
  Interaction,
  mediaQueries,
  RawHtml,
  fontStyles
} from '@project-r/styleguide'
import TextInput from './TextInput/TextInput'
const { H2 } = Interaction

class TextQuestion extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null,
      updating: null,
      ...this.deriveStateFromProps(props)
    }
  }

  deriveStateFromProps (props) {
    return props.question.userAnswer ? props.question.userAnswer.payload : {value: null}
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.question.userAnswer !== this.props.question.userAnswer) {
      this.setState(this.deriveStateFromProps(nextProps))
    }
  }

  handleChange = (ev) => {
    const { question: { type: { maxLength } }, onChange } = this.props
    const value = ev.target.value
    this.setState({ value })
    if (value.length <= +maxLength) {
      onChange(value, true)
    }
  }

  render () {
    const { question: { text, type: { maxLength } } } = this.props
    const { value } = this.state
    return (
      <div>
        { text &&
        <H2 {...questionStyles.label}>{text}</H2>
        }
        <div {...questionStyles.body}>
          <TextInput
            placeholder='Bitte erläutern Sie Ihre Gründe'
            text={value || ''}
            onChange={this.handleChange}
            maxLength={maxLength}
          />
        </div>
      </div>
    )
  }
}

export default TextQuestion

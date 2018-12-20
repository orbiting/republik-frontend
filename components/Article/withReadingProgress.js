import React, { Component, Fragment } from 'react'

import debounce from 'lodash.debounce'

import ProgressNote from './ProgressNote'

import {
  mediaQueries
} from '@project-r/styleguide'

import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'

const withReadingProgress = WrappedComponent => {
  return class extends Component {
    constructor (props) {
      super(props)

      this.state = {
        showProgressPrompt: false,
        progressElements: null
      }

      this.containerRef = ref => {
        this.container = ref
      }

      this.headerHeight = () =>
        window.innerWidth < mediaQueries.mBreakPoint
          ? HEADER_HEIGHT_MOBILE
          : HEADER_HEIGHT

      this.handleLoad = () => {
        this.measure()
        this.getProgressElements()
      }

      this.measure = () => {
        if (this.container) {
          const { width, height, top } = this.container.getBoundingClientRect()
          const cleanWidth = Math.min(width, 695)
          if (cleanWidth !== this.state.width || height !== this.state.height || top !== this.state.top) {
            this.setState({ width: cleanWidth, height, top })
          }
        }
      }

      this.measureProgress = (downwards = true) => {
        const progressElements = this.getProgressElements()
        const progressElementIndex = this.state.progressElementIndex || 0
        if (!progressElements) {
          return
        }
        const mobile = window.innerWidth < mediaQueries.mBreakPoint
        const headerHeight = mobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT

        let progressElement, nextIndex
        if (downwards) {
          for (let i = progressElementIndex; i < progressElements.length; i++) {
            progressElement = progressElements[i]
            const { top, height } = progressElement.getBoundingClientRect()
            if (i === 0 && top > window.innerHeight) {
              break
            }
            const fillsHeight = top < headerHeight && headerHeight + top + height > window.innerHeight
            if (top > headerHeight || fillsHeight) {
              console.log('found downwards', progressElement)
              nextIndex = i
              break
            }
          }
        } else {
          // search upwards.
          for (let i = progressElementIndex; i > -1; i--) {
            progressElement = progressElements[i]
            const { top } = progressElement.getBoundingClientRect()
            if (top < headerHeight) {
              progressElement = progressElements[i + 1]
              nextIndex = i + 1
              console.log('found upwards', progressElement)
              break
            } else {
              progressElement = undefined
            }
          }
        }
        this.setState({
          progressElement,
          progressElementIndex: nextIndex
        })
      }

      this.getProgressElements = () => {
        if (this.state.progressElements && this.state.progressElements.length > 0) {
          return this.state.progressElements
        }
        const progressElements = this.container
          ? [...this.container.getElementsByClassName('pos')]
          : []
        this.setState({ progressElements })
      }

      this.getProgress = () => {
        this.measure()
        const yFromArticleTop = Math.max(
          0,
          window.pageYOffset -
            (this.state.top + window.pageYOffset - this.headerHeight())
        )
        const percent = yFromArticleTop / this.state.height
        const displayPercent =
          percent === 0
            ? 0
            : Math.min(1, (yFromArticleTop + window.innerHeight) / this.state.height)

        const { progressElement } = this.state
        this.setState({
          percent,
          displayPercent,
          id: progressElement && progressElement.id
        })
        return JSON.stringify({
          percent,
          displayPercent,
          id: progressElement && progressElement.id
        })
      }

      this.saveProgress = debounce(() => {
        const y = window.pageYOffset
        const downwards = this.state.pageYOffset === undefined || y > this.state.pageYOffset

        if (y !== this.state.pageYOffset) {
          this.setState({ pageYOffset: y })
          this.measureProgress(downwards)
        }

        window.localStorage.setItem('progress', this.getProgress())
      }, 300)

      this.restoreProgress = () => {
        const progress = JSON.parse(window.localStorage.getItem('progress') || {})
        const { percent, id } = progress
        const { mobile } = this.state
        const progressElements = this.getProgressElements()
        let foundIndex
        const progressElement = progressElements.find((element, index) => {
          foundIndex = index
          return element.id === id
        })
        if (progressElement) {
          this.setState({
            progressElement: progressElement,
            progressElementIndex: foundIndex
          })
          const { top } = progressElement.getBoundingClientRect()
          window.scrollTo(0, top - HEADER_HEIGHT - (mobile ? 20 : 50))
          return
        }
        if (percent) {
          const offset = (percent * this.state.height) + HEADER_HEIGHT
          window.scrollTo(0, offset)
        }
        this.setState({ showProgressPrompt: false })
      }
    }

    componentDidMount () {
      window.addEventListener('load', this.handleLoad)
      window.addEventListener('resize', this.measure)

      this.measure()

      const progress = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('progress')) : {}
      const { id, percent } = progress
      const showProgressPrompt = !!id || !!percent
      this.setState({ showProgressPrompt })
    }

    componentWillUnmount () {
      window.removeEventListener('load', this.handleLoad)
      window.removeEventListener('resize', this.measure)
    }

    componentDidUpdate () {
      this.measure()
    }

    render () {
      const { showProgressPrompt, width, displayPercent, percent, pageYOffset } = this.state
      const progressPrompt = showProgressPrompt ? (
        <ProgressNote onClick={() => {
          this.restoreProgress()
        }} />
      ) : null
      return <Fragment>
        <WrappedComponent
          progressArticleRef={this.containerRef}
          saveProgress={this.saveProgress}
          progressPrompt={progressPrompt}
          {...this.props} />
        <div style={{ position: 'fixed', bottom: 0, color: '#fff', left: 0, right: 0, background: 'rgba(0, 0, 0, .7)', padding: 10 }}>
          <p>width: {width} – pageYOffset: {pageYOffset} - Percent {percent} - displayPercent {displayPercent}</p>
        </div>
      </Fragment>
    }
  }
}

export default withReadingProgress

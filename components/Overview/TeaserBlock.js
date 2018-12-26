import React, { Component } from 'react'
import { css } from 'glamor'
import { range, sum, max } from 'd3-array'
import debounce from 'lodash/debounce'

import {
  LazyLoad
} from '@project-r/styleguide'

import { ASSETS_SERVER_BASE_URL, RENDER_FRONTEND_BASE_URL } from '../../lib/constants'

import TeaserHover from './TeaserHover'
import TeaserNodes from './TeaserNodes'

const SIZES = [
  { minWidth: 0, columns: 3 },
  { minWidth: 330, columns: 4 },
  { minWidth: 450, columns: 5 },
  { minWidth: 570, columns: 6 },
  { minWidth: 690, columns: 7 },
  { minWidth: 810, columns: 8 }
]

const PADDING = 10

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    width: '100%'
  }),
  item: css({
    paddingBottom: PADDING,
    paddingRight: PADDING,
    lineHeight: 0,
    ...SIZES.reduce((styles, size) => {
      const width = `${100 / size.columns}%`
      if (size.minWidth) {
        styles[`@media only screen and (min-width: ${size.minWidth}px)`] = {
          width
        }
      } else {
        styles.width = width
      }
      return styles
    }, {})
  })
}

class TeaserBlock extends Component {
  constructor (props, ...args) {
    super(props, ...args)
    this.blockRef = React.createRef()
    this.state = {}
  }
  measure = debounce(() => {
    const parent = this.blockRef.current
    if (!parent) {
      return
    }

    const teaserElements = Array.from(
      parent.querySelectorAll('[data-teaser]')
    )
    if (!teaserElements.length) {
      return
    }

    const { left, top, width } = parent.getBoundingClientRect()

    this.measurements = teaserElements.map(teaser => {
      const rect = teaser.getBoundingClientRect()

      return {
        id: teaser.getAttribute('data-teaser'),
        x: rect.left - left,
        y: rect.top - top,
        height: rect.height,
        width: rect.width,
        left: rect.left
        // absoluteY: window.pageYOffset + rect.top
      }
    })

    if (this.measurements.filter(m => m.height).length !== this.props.teasers.length) {
      // waiting for content to load
      return
    }

    const innerWidth = window.innerWidth
    const { columns } = SIZES.filter(size => size.minWidth <= innerWidth).pop()

    const perColumn = Math.round(this.measurements.length / columns)
    const height = max(range(columns).map(column => {
      const begin = column * perColumn
      return sum(
        this.measurements
          .slice(
            begin,
            column === columns - 1
              ? undefined
              : begin + perColumn
          )
          .map(measurement => measurement.height + PADDING)
      )
    }))

    if (this.state.width !== width || this.state.height !== height) {
      this.setState({ width, height })
    }
  }, 33)
  componentDidMount () {
    window.addEventListener('resize', this.measure)
    this.measure()
  }
  componentDidUpdate () {
    this.measure()
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.measure)
    clearTimeout(this.hoverTimeout)
  }
  render () {
    const { hover, width, height } = this.state
    const { teasers, highlight, onHighlight, lazy } = this.props

    const hoverOff = () => {
      // prevent flicker
      this.hoverTimeout = setTimeout(() => {
        if (this.state.hover === hover) {
          this.setState({ hover: false })
          onHighlight()
        }
      }, 66)
    }

    return (
      <div ref={this.blockRef} style={{ position: 'relative' }}>
        <LazyLoad key={height} visible={!lazy} attributes={{
          ...styles.container,
          ...css({
            ...SIZES.reduce((styles, size) => {
              // SSR approximation
              const height = teasers.length / size.columns * 66
              if (size.minWidth) {
                styles[`@media only screen and (min-width: ${size.minWidth}px)`] = {
                  height
                }
              } else {
                styles.height = height
              }
              return styles
            }, {})
          })
        }} style={{ height }}>
          {teasers.map(teaser => {
            let touch
            const focus = event => {
              if (!this.measurements) {
                return
              }
              const measurement = this.measurements.find(m => m.id === teaser.id)
              if (!measurement) {
                return
              }

              let currentEvent = event
              if (currentEvent.changedTouches) {
                currentEvent = currentEvent.changedTouches[0]
              }

              const x = (currentEvent.clientX - measurement.left) / measurement.width
              if (x >= 1) {
                hoverOff()
                return
              }

              this.setState({
                hover: {
                  touch,
                  teaser,
                  measurement
                }
              }, () => {
                const index = Math.floor(x * teaser.nodes.length)
                const activeNode = teaser.nodes[index]
                const urlMeta = (activeNode && activeNode.data.urlMeta) || {}

                if (urlMeta.format) {
                  onHighlight(data => data.urlMeta && data.urlMeta.format === urlMeta.format)
                } else if (urlMeta.series) {
                  onHighlight(data => data.urlMeta && data.urlMeta.series === urlMeta.series)
                } else if (activeNode) {
                  onHighlight(data => data.id === activeNode.data.id)
                }
              })
            }
            return <div key={teaser.id}
              {...styles.item}
              onTouchStart={() => { touch = true }}
              onMouseEnter={focus}
              onMouseMove={focus}
              onMouseLeave={hoverOff}
              onClick={() => { touch = undefined }}>
              {hover && hover.teaser.id === teaser.id &&
                <TeaserHover {...hover} contextWidth={width - PADDING} highlight={highlight} />}
              <div style={{ position: 'relative' }} data-teaser={teaser.id}>
                <img
                  onLoad={this.measure}
                  src={`${ASSETS_SERVER_BASE_URL}/render?width=1200&height=1&url=${encodeURIComponent(`${RENDER_FRONTEND_BASE_URL}/?extractId=${teaser.id}`)}&resize=160`}
                  style={{
                    display: 'block',
                    width: '100%'
                  }} />
                <TeaserNodes
                  nodes={teaser.nodes}
                  highlight={highlight}
                  noClick={hover && hover.touch} />
              </div>
            </div>
          })}
        </LazyLoad>
      </div>
    )
  }
}

export default TeaserBlock

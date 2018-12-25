import React, { Component } from 'react'
import { css } from 'glamor'

import {
  LazyLoad
} from '@project-r/styleguide'

import HrefLink from '../Link/Href'

import { ASSETS_SERVER_BASE_URL, RENDER_FRONTEND_BASE_URL } from '../../lib/constants'

import TeaserHover from './TeaserHover'

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
  measure = () => {
    const parent = this.blockRef.current
    if (!parent) {
      return
    }

    const { left, top, width } = parent.getBoundingClientRect()
    if (this.state.width !== width) {
      this.setState({ width })
    }

    this.measurements = Array.from(
      parent.querySelectorAll('[data-teaser]')
    ).map(teaser => {
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
  }
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
    const { hover, width } = this.state
    const { teasers, lazy } = this.props

    return (
      <div ref={this.blockRef} style={{ position: 'relative' }}>
        <LazyLoad visible={!lazy} attributes={{
          ...styles.container,
          ...css({
            ...SIZES.reduce((styles, size) => {
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
        }}>
          {teasers.map(teaser => {
            const nodeWidth = 100 / teaser.nodes.length

            return <div key={teaser.id}
              {...styles.item}
              onMouseOver={event => {
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

                const focusX = currentEvent.clientX - measurement.left

                this.setState({
                  hover: {
                    x: focusX / measurement.width,
                    teaser,
                    measurement
                  }
                })
              }}
              onMouseLeave={() => {
                // prevent flicker
                this.hoverTimeout = setTimeout(() => {
                  if (this.state.hover === hover) {
                    this.setState({ hover: false })
                  }
                }, 33)
              }}>
              {hover && hover.teaser === teaser && <TeaserHover {...hover} width={width} />}
              <div style={{ position: 'relative' }} data-teaser={teaser.id}>
                <img
                  onLoad={this.measure}
                  src={`${ASSETS_SERVER_BASE_URL}/render?width=1200&height=1&url=${encodeURIComponent(`${RENDER_FRONTEND_BASE_URL}/?extractId=${teaser.id}`)}&resize=160`}
                  style={{
                    width: '100%'
                  }} />
                {teaser.nodes.map((node, i) => {
                  const area = (
                    <a key={node.data.id} style={{
                      display: 'block',
                      position: 'absolute',
                      left: `${nodeWidth * i}%`,
                      width: `${nodeWidth}%`,
                      top: 0,
                      bottom: 0
                    }} />
                  )
                  if (node.data.url) {
                    return <HrefLink key={node.data.id} href={node.data.url} passHref>
                      {area}
                    </HrefLink>
                  }
                  return area
                })}
              </div>
            </div>
          })}
        </LazyLoad>
      </div>
    )
  }
}

export default TeaserBlock

import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import { withRouter } from 'next/router'

import { nest } from 'd3-collection'

import { swissTime } from '../lib/utils/format'
import { ASSETS_SERVER_BASE_URL, RENDER_FRONTEND_BASE_URL } from '../lib/constants'

import { Link } from '../lib/routes'
import withT from '../lib/withT'

import StatusError from '../components/StatusError'
import Loader from '../components/Loader'
import withMembership from '../components/Auth/withMembership'
import Frame from '../components/Frame'
import { negativeColors } from '../components/Frame/constants'
import HrefLink from '../components/Link/Href'

import { A, P } from '../components/Overview/Elements'
import text18 from '../components/Overview/2018'

import {
  Button,
  Interaction,
  LazyLoad
} from '@project-r/styleguide'

const texts = {
  2018: text18
}

const getDocument = gql`
query getFrontOverview {
  front: document(path: "/") {
    id
    content
  }
}
`

const formatMonth = swissTime.format('%B')

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
  }),
  hoverArea: css({
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  })
}

class TeaserBlock extends Component {
  constructor (props, ...args) {
    super(props, ...args)
    this.blockRef = React.createRef()
    this.hoverRef = React.createRef()
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
        width: rect.width
        // absoluteY: window.pageYOffset + rect.top
      }
    })
  }
  componentDidMount () {
    window.addEventListener('resize', this.measure)
    this.hoverRef.current.addEventListener('touchstart', this.focus, { passive: false })
    this.hoverRef.current.addEventListener('touchmove', this.focus)
    this.hoverRef.current.addEventListener('touchend', this.blur)
    this.measure()
  }
  componentDidUpdate () {
    this.measure()
  }
  componentWillUnmount () {
    if (this.hoverRef.current) {
      this.hoverRef.current.removeEventListener('touchstart', this.focus)
      this.hoverRef.current.removeEventListener('touchmove', this.focus)
      this.hoverRef.current.removeEventListener('touchend', this.blur)
    }
    window.removeEventListener('resize', this.measure)
  }
  focus = (event) => {
    const parent = this.blockRef.current
    if (!parent || !this.measurements) {
      return
    }
    const { left, top } = parent.getBoundingClientRect()

    let hoverTouch = false
    let currentEvent = event
    if (currentEvent.changedTouches) {
      hoverTouch = true
      currentEvent = currentEvent.changedTouches[0]
    }

    const focusX = currentEvent.clientX - left
    const focusY = currentEvent.clientY - top

    const measurement = this.measurements.find(teaser => {
      return (
        focusX + PADDING >= teaser.x &&
        focusX <= teaser.x + teaser.width + PADDING &&
        focusY + PADDING >= teaser.y &&
        focusY <= teaser.y + teaser.height + PADDING
      )
    })

    const hover = measurement
      ? {
        measurement,
        teaser: this.props.teasers.find(t => t.id === measurement.id)
      }
      : false
    if (hover) {
      event.preventDefault()
    }

    this.setState({ hover, hoverTouch })
  }
  blur = () => {
    this.setState({ hover: undefined })
  }
  render () {
    const { hover, hoverTouch, width } = this.state
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
            // `${ASSETS_SERVER_BASE_URL}/render?width=1200&height=1&url=${encodeURIComponent(`${RENDER_FRONTEND_BASE_URL}/?extractId=${teaser.node.data.id}`)}`

            const nodeWidth = 100 / teaser.nodes.length

            return <div key={teaser.id} {...styles.item}>
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
        {hover && <div style={{
          position: 'absolute',
          top: hover.measurement.y - (hoverTouch ? 40 : 20),
          left: hover.measurement.x > 300 / 2
            ? hover.measurement.x + 300 / 2 > width
              ? width - 300
              : hover.measurement.x + hover.measurement.width / 2 - 150
            : 0
        }}>
          <img
            style={{
              width: 300,
              position: 'absolute',
              bottom: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,.4)'
            }}
            key={hover.teaser.id}
            src={`${ASSETS_SERVER_BASE_URL}/render?width=1200&height=1&url=${encodeURIComponent(`${RENDER_FRONTEND_BASE_URL}/?extractId=${hover.teaser.id}`)}&resize=600`} />
        </div>}
        <div
          {...styles.hoverArea}
          onMouseEnter={this.focus}
          onMouseMove={this.focus}
          onMouseLeave={this.blur}
          ref={
            /* touch events are added via ref for { passive: false } on touchstart
             * react does not support setting passive, which defaults to true in newer browsers
             * https://github.com/facebook/react/issues/6436
             */
            this.hoverRef
          } />
      </div>
    )
  }
}

class FrontOverview extends Component {
  render () {
    const { data, isMember, me, router: { query }, t } = this.props

    const year = +query.year
    const startDate = new Date(`${year - 1}-12-31T23:00:00.000Z`)
    const endDate = new Date(`${year}-12-31T23:00:00.000Z`)

    const meta = {
      title: t.first([
        `overview/${year}/meta/title`,
        'overview/meta/title'
      ], { year }),
      description: t.first([
        `overview/${year}/meta/description`,
        'overview/meta/description'
      ], { year }, '')
    }

    const teasers = data.front && data.front.content.children.reduce((agg, rootChild) => {
      agg.push({
        id: rootChild.data.id,
        nodes: rootChild.identifier === 'TEASERGROUP'
          ? rootChild.children
          : [rootChild]
      })
      return agg
    }, []).reverse().filter((teaser, i, all) => {
      const node = teaser.nodes.find(node => node.data.urlMeta)

      teaser.publishDate = node
        ? new Date(node.data.urlMeta.publishDate)
        : i > 0 ? all[i - 1].publishDate : undefined
      return teaser.publishDate &&
        teaser.publishDate >= startDate &&
        teaser.publishDate < endDate
    })

    if (!teasers.length) {
      return (
        <Frame raw>
          <StatusError
            statusCode={404}
            serverContext={this.props.serverContext} />
        </Frame>
      )
    }

    return (
      <Frame meta={meta} dark>
        <Interaction.H1 style={{ color: negativeColors.text, marginBottom: 5 }}>
          {t.first([`overview/${year}/title`, 'overview/title'], { year })}
        </Interaction.H1>

        <P>
          {isMember
            ? <Fragment>
              {t.first([`overview/${year}/lead`, 'overview/lead'], { year }, '')}
            </Fragment>
            : t.elements(`overview/lead/${me ? 'pledge' : 'signIn'}`, {
              pledgeLink: <Link key='pledge' route='pledge' passHref>
                <A>{t('overview/lead/pledgeText')}</A>
              </Link>
            })}
        </P>

        <Loader loading={data.loading} error={data.error} render={() => {
          return nest()
            .key(d => formatMonth(d.publishDate))
            .entries(teasers)
            .map(({ key: month, values }, i) => {
              return (
                <div style={{ marginTop: 50 }} key={month}>
                  <Interaction.H2 style={{ color: negativeColors.text, marginBottom: 5, marginTop: 0 }}>
                    {month}
                  </Interaction.H2>
                  <P style={{ marginBottom: 20 }}>
                    {texts[year] && texts[year][month]}
                  </P>
                  <TeaserBlock teasers={values} lazy={i !== 0} />
                </div>
              )
            })
        }} />

        {!isMember && <Fragment>
          <P style={{ marginBottom: 10, marginTop: 100 }}>
            {t('overview/after/pledge')}
          </P>
          <Button white>{t('overview/after/pledgeButton')}</Button>
        </Fragment>}
      </Frame>
    )
  }
}

export default compose(
  graphql(getDocument),
  withMembership,
  withRouter,
  withT
)(FrontOverview)

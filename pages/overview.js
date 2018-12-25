import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import { withRouter } from 'next/router'

import { nest } from 'd3-collection'
// import { lab } from 'd3-color'

import { swissTime } from '../lib/utils/format'
import { ASSETS_SERVER_BASE_URL, RENDER_FRONTEND_BASE_URL } from '../lib/constants'

import {
  Button,
  Interaction
} from '@project-r/styleguide'

import StatusError from '../components/StatusError'
import Loader from '../components/Loader'
import withMembership from '../components/Auth/withMembership'
import Frame from '../components/Frame'
import { negativeColors } from '../components/Frame/constants'

import { Link } from '../lib/routes'
import withT from '../lib/withT'

import { A, P } from '../components/Overview/Elements'
import text18 from '../components/Overview/2018'

const texts = {
  2018: text18
}

const getDocument = gql`
query getFrontOverview {
  front: document(path: "/") {
    id
    content
    links {
      entity {
        __typename
        ... on Document {
          meta {
            path
            publishDate
          }
        }
      }
    }
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
    paddingBottom: 10,
    paddingRight: 10,
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
      // if (rootChild.identifier === 'TEASERGROUP') {
      //   rootChild.children.forEach(child => {
      //     agg.push({size: 1 / rootChild.children.length, node: child})
      //   })
      // } else {
      agg.push({ size: 1, node: rootChild })
      // }
      return agg
    }, []).reverse().filter((teaser, i, all) => {
      let node = teaser.node
      if (teaser.node.identifier === 'TEASERGROUP') {
        node = teaser.node.children[0]
      }

      const link = data.front.links.find(l => (
        l.entity.__typename === 'Document' &&
        l.entity.meta.path === node.data.url
      ))
      if (!link) {
        // console.warn('no link found', teaser)
      }
      teaser.index = i
      teaser.publishDate = link
        ? new Date(link.entity.meta.publishDate)
        : all[i - 1].publishDate
      return teaser.publishDate >= startDate && teaser.publishDate < endDate
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
            .map(({ key: month, values }) => {
              return (
                <div style={{ marginTop: 50 }} key={month}>
                  <Interaction.H2 style={{ color: negativeColors.text, marginBottom: 5, marginTop: 0 }}>
                    {month}
                  </Interaction.H2>
                  <P style={{ marginBottom: 20 }}>
                    {texts[year] && texts[year][month]}
                  </P>
                  <div {...styles.container} {...css({
                    ...SIZES.reduce((styles, size) => {
                      const height = values.length / size.columns * 66
                      if (size.minWidth) {
                        styles[`@media only screen and (min-width: ${size.minWidth}px)`] = {
                          height
                        }
                      } else {
                        styles.height = height
                      }
                      return styles
                    }, {})
                  })}>
                    {values.map(teaser => {
                      return <div key={teaser.node.data.id} {...styles.item}>
                        <a
                          href={`${ASSETS_SERVER_BASE_URL}/render?width=1200&height=1&url=${encodeURIComponent(`${RENDER_FRONTEND_BASE_URL}/?extractId=${teaser.node.data.id}`)}`}
                          target='_blank'>
                          <img
                            src={`${ASSETS_SERVER_BASE_URL}/render?width=1200&height=1&url=${encodeURIComponent(`${RENDER_FRONTEND_BASE_URL}/?extractId=${teaser.node.data.id}`)}&resize=160`}
                            style={{
                              width: '100%'
                            }} />
                        </a>
                      </div>
                    })}
                  </div>
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

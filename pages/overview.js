import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'next/router'
import { max } from 'd3-array'
import { timeMonth } from 'd3-time'

import { swissTime } from '../lib/utils/format'

import { Link } from '../lib/routes'
import withT from '../lib/withT'
import {
  CDN_FRONTEND_BASE_URL
} from '../lib/constants'

import StatusError from '../components/StatusError'
import withMembership from '../components/Auth/withMembership'
import Frame from '../components/Frame'
import { negativeColors } from '../components/Frame/constants'

import TeaserBlock from '../components/Overview/TeaserBlock'
import { P } from '../components/Overview/Elements'
import text18 from '../components/Overview/2018'
import text19 from '../components/Overview/2019'
import { getTeasersFromDocument } from '../components/Overview/utils'

import {
  Button,
  Interaction,
  Loader
} from '@project-r/styleguide'

const texts = {
  2018: text18,
  2019: text19
}

const knownYears = {
  // 2l7waBIDo 2019-01-01T03:50:00.000Z: Die Ehre Albaniens, Teil 1
  2018: { after: '2l7waBIDo' },
  // B3fTOtcv9 2018-12-31T03:50:00.000Z: Statuspanik – die Krankheit des Mannes
  2019: { before: 'B3fTOtcv9' }
}

const getAll = gql`
query getCompleteFrontOverview {
  front: document(path: "/") {
    id
    content
  }
}
`
const getKnownYear = gql`
query getFrontOverviewYear($after: ID, $before: ID) {
  front: document(path: "/") {
    id
    children(after: $after, before: $before) {
      nodes {
        body
      }
    }
  }
}
`

const formatMonth = swissTime.format('%B')

class FrontOverview extends Component {
  constructor (props, ...args) {
    super(props, ...args)
    this.state = {}
    this.onHighlight = highlight => this.setState({ highlight })
  }
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
      ], { year }, ''),
      image: [2018, 2019].includes(year)
        ? `${CDN_FRONTEND_BASE_URL}/static/social-media/overview${year}.png`
        : `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`
    }

    const teasers = getTeasersFromDocument(data.front)
      .reverse()
      .filter((teaser, i, all) => {
        const publishDates = teaser.nodes
          .map(node => (
            node.data.urlMeta &&
            // workaround for «aufdatierte» tutorials and meta texts
            node.data.urlMeta.format !== 'republik/format-aus-der-redaktion' &&
            new Date(node.data.urlMeta.publishDate)
          ))
          .filter(Boolean)

        teaser.publishDate = publishDates.length
          ? max(publishDates)
          : i > 0 ? all[i - 1].publishDate : undefined
        return teaser.publishDate &&
          teaser.publishDate >= startDate &&
          teaser.publishDate < endDate
      })

    if (!data.loading && !data.error && !teasers.length) {
      return (
        <Frame raw>
          <StatusError
            statusCode={404}
            serverContext={this.props.serverContext} />
        </Frame>
      )
    }

    const { highlight } = this.state

    const teasersByMonth = teasers.reduce(
      ([all, last], teaser) => {
        const key = formatMonth(teaser.publishDate)
        if (!last || key !== last.key) {
          // ignore unexpected jumps
          // - this happens when a previously published article was placed
          // - or an articles publish date was later updated
          // mostly happens for debates or meta articles
          const prevKey = formatMonth(timeMonth.offset(teaser.publishDate, -1))
          if (!last || prevKey === last.key) {
            const newMonth = { key, values: [teaser] }
            all.push(newMonth)
            return [all, newMonth]
          }
        }
        last.values.push(teaser)
        return [all, last]
      },
      [[]]
    )[0]

    return (
      <Frame meta={meta} dark>
        <Interaction.H1 style={{ color: negativeColors.text, marginBottom: 5 }}>
          {t.first([`overview/${year}/title`, 'overview/title'], { year })}
        </Interaction.H1>

        <P style={{ marginBottom: 10 }}>
          {isMember
            ? t.first([`overview/${year}/lead`, 'overview/lead'], { year }, '')
            : t.elements(`overview/lead/${me ? 'pledge' : 'signIn'}`)}
        </P>
        {!isMember && <Link key='pledge' route='pledge' passHref>
          <Button white>{t('overview/lead/pledgeButton')}</Button>
        </Link>}

        <Loader loading={data.loading} error={data.error} style={{ minHeight: `calc(90vh)` }} render={() => {
          return teasersByMonth.map(({ key: month, values }, i) => {
            const Text = texts[year] && texts[year][month]
            return (
              <div style={{ marginTop: 50 }} key={month} onClick={() => {
                // a no-op for mobile safari
                // - causes mouse enter and leave to be triggered
              }}>
                <Interaction.H2 style={{ color: negativeColors.text, marginBottom: 5, marginTop: 0 }}>
                  {month}
                </Interaction.H2>
                <P style={{ marginBottom: 20 }}>
                  {Text && <Text
                    highlight={highlight}
                    onHighlight={this.onHighlight} />}
                </P>
                <TeaserBlock
                  teasers={values}
                  highlight={highlight}
                  onHighlight={this.onHighlight}
                  lazy={i !== 0} />
              </div>
            )
          })
        }} />

        {!isMember && <Link key='pledge' route='pledge' passHref>
          <Button white style={{ marginTop: 100 }}>{t('overview/after/pledgeButton')}</Button>
        </Link>}
      </Frame>
    )
  }
}

export default compose(
  withRouter,
  graphql(getAll, {
    skip: props => knownYears[+props.router.query.year]
  }),
  graphql(getKnownYear, {
    skip: props => !knownYears[+props.router.query.year],
    options: props => ({
      variables: knownYears[+props.router.query.year]
    })
  }),
  withMembership,
  withT
)(FrontOverview)

import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import Head from 'next/head'

import { nest } from 'd3-collection'
// import { lab } from 'd3-color'

import { swissTime } from '../lib/utils/format'
import { ASSETS_SERVER_BASE_URL, RENDER_FRONTEND_BASE_URL } from '../lib/constants'

import {
  Button,
  Editorial,
  Interaction,
  Logo,
  mediaQueries,
  Label
} from '@project-r/styleguide'

import Loader from '../components/Loader'
import Footer, { negativeColors } from '../components/Frame/Footer'

import { Link } from '../lib/routes'

import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  LOGO_WIDTH,
  LOGO_PADDING,
  LOGO_WIDTH_MOBILE,
  LOGO_PADDING_MOBILE
} from '../components/constants'

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

const styles = {
  container: css({
    backgroundColor: '#000',
    color: '#fff',
    minHeight: '100vh'
  }),
  bar: css({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    textAlign: 'center',
    height: HEADER_HEIGHT_MOBILE,
    [mediaQueries.mUp]: {
      height: HEADER_HEIGHT
    },
    '@media print': {
      position: 'absolute',
      backgroundColor: 'transparent'
    },
    borderBottom: `1px solid ${negativeColors.divider}`
  }),
  padHeader: css({
    // minus 1px for first sticky hr from header
    // - otherwise there is a jump when scroll 0 and opening hamburger
    paddingTop: HEADER_HEIGHT_MOBILE - 1,
    [mediaQueries.mUp]: {
      paddingTop: HEADER_HEIGHT - 1
    }
  }),
  div: css({
    position: 'relative',
    display: 'inline-block',
    padding: LOGO_PADDING_MOBILE,
    width: LOGO_WIDTH_MOBILE + LOGO_PADDING_MOBILE * 2,
    [mediaQueries.mUp]: {
      padding: LOGO_PADDING,
      width: LOGO_WIDTH + LOGO_PADDING * 2
    },
    verticalAlign: 'middle'
  }),
  content: css({
    maxWidth: 620,
    margin: '0 auto',
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased',
    '& ::selection': {
      color: '#000',
      backgroundColor: '#fff'
    }
  })
}

const getMonth = swissTime.format('%B')

class FrontOverview extends Component {
  render () {
    const { data } = this.props
    const meta = {}

    return (
      <div {...styles.container}>
        <Head>
          <title>Republik</title>
          <meta name='description' content={meta.description} />
          <meta property='og:type' content='website' />
          <meta property='og:url' content={meta.url} />
          <meta property='og:title' content={meta.title} />
          <meta property='og:description' content={meta.description} />
          <meta property='og:image' content={meta.image} />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:site' content='@RepublikMagazin' />
          <meta name='twitter:creator' content='@RepublikMagazin' />
        </Head>
        <div {...styles.bar}>
          <div {...styles.div}>
            <Logo fill='#fff' />
          </div>
        </div>
        <div {...styles.content} {...styles.padHeader}>

          <Interaction.H1 style={{ color: '#fff', marginBottom: 5, marginTop: 40 }}>
            2018, Monat für Monat
          </Interaction.H1>

          <Interaction.P style={{ color: '#fff' }}>
            <Label>signed_out</Label> Melden Sie sich an um alle Artikel lesen zu können. Noch nicht Mitglied? <Link route='pledge' passHref>
              <Editorial.A style={{ color: '#fff' }}>Kommen Sie an Board!</Editorial.A>
            </Link>
          </Interaction.P>
          <Interaction.P style={{ color: '#fff' }}>
            <Label>no_membership</Label> Werden Sie Mitglied um alle Artikel alle Artikel lesen zu können. <Link route='pledge' passHref>
              <Editorial.A style={{ color: '#fff' }}>Kommen Sie an Board!</Editorial.A>
            </Link>
          </Interaction.P>
          <Interaction.P style={{ color: '#fff' }}>
            <Label>members</Label> Lassen Sie das Jahr Revue passieren.
          </Interaction.P>

          <Loader loading={data.loading} error={data.error} render={() => {
            const teasers = data.front.content.children.reduce((agg, rootChild) => {
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
              return teaser.publishDate
            })

            const texts = {
              Januar: <span>Mit irrational langen Beiträgen geht die Republik an den Start. Der erste <Editorial.A style={{ color: '#fff' }} href='https://www.republik.ch/2018/01/17/warum-justiz'>Schwerpunkt Justiz</Editorial.A> wird gesetzt. Unsere erste Serie «Race, Class, Guns and God» erscheint.</span>,
              Februar: <span>
                Die Doping-Recherche sorgt international für Aufsehen. Die Republik beleuchtet die involvierten Schweizer. Sybylle Berg startet mit ihrer Kolumne, wir publizieren unseren ersten Audio-Podcast.
              </span>
            }

            return nest()
              .key(d => getMonth(d.publishDate))
              .entries(teasers)
              .slice(0, 5)
              .map(({ key: month, values }) => {
                return (
                  <div style={{ marginTop: 50 }} key={month}>
                    <Interaction.H2 style={{ color: '#fff', marginBottom: 5, marginTop: 0 }}>
                      {month}
                    </Interaction.H2>
                    <Interaction.P style={{ color: '#fff', marginBottom: 20 }}>
                      {texts[month]}
                    </Interaction.P>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      flexWrap: 'wrap',
                      justifyContent: 'flex-start',
                      height: values.length * 8
                    }}>
                      {values.map(teaser => {
                        return <a key={teaser.node.data.id} href={`${ASSETS_SERVER_BASE_URL}/render?width=1200&height=1&url=${encodeURIComponent(`${RENDER_FRONTEND_BASE_URL}/?extractId=${teaser.node.data.id}`)}`} target='_blank'><img
                          src={`${ASSETS_SERVER_BASE_URL}/render?width=1200&height=1&url=${encodeURIComponent(`${RENDER_FRONTEND_BASE_URL}/?extractId=${teaser.node.data.id}`)}&resize=160`}
                          style={{
                            width: 80,
                            // width: 55 * teaser.size,
                            marginBottom: 5,
                            marginRight: 5
                            // flex: '1 1 80px'
                          }} /></a>
                      })}
                    </div>
                  </div>
                )
              })
          }} />

          <Interaction.P style={{ color: '#fff', marginBottom: 10, marginTop: 100 }}>
            <Label>not members</Label> Geniessen Sie die stillen Stunden zum Lesen:
          </Interaction.P>
          <Button white>Jetzt Mitglied werden</Button>
          <div style={{ height: 100 }} />
        </div>
        <Footer black />
      </div>
    )
  }
}

export default compose(
  graphql(getDocument)
)(FrontOverview)

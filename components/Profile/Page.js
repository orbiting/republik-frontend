import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css, merge } from 'glamor'

import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'

import { Link, Router } from '../../lib/routes'

import Loader from '../Loader'
import Frame, { MainContainer } from '../Frame'
import Box from '../Frame/Box'

import Badge from './Badge'
import LatestComments from './LatestComments'
import PointerList from './PointerList'
import Update from './Update'

import ArticleLink from '../Link/Article'
import Testimonial from '../Testimonial'

import { HEADER_HEIGHT, TESTIMONIAL_IMAGE_SIZE } from '../constants'

import {
  TeaserFeed,
  Interaction,
  colors,
  fontStyles,
  linkRule,
  mediaQueries
} from '@project-r/styleguide'

const SIDEBAR_TOP = 20

const styles = {
  container: css({
    borderTop: `1px solid ${colors.divider}`,
    paddingTop: '80px',
    position: 'relative',
    paddingLeft: `${TESTIMONIAL_IMAGE_SIZE + 20}px`,
    [mediaQueries.onlyS]: {
      paddingLeft: 0,
      paddingTop: '10px'
    },
    paddingBottom: 60
  }),
  sidebar: css({
    left: 0,
    paddingBottom: '20px',
    position: 'absolute',
    top: `${SIDEBAR_TOP}px`,
    width: `${TESTIMONIAL_IMAGE_SIZE}px`,
    [mediaQueries.onlyS]: {
      position: 'static',
      width: 'auto'
    }
  }),
  credential: css({
    ...fontStyles.sansSerifRegular16
  }),
  badges: css({
    margin: '20px 0 30px 0'
  }),
  contact: css({
    ...fontStyles.sansSerifRegular14,
    '& + &': {
      marginTop: '5px'
    }
  }),
  sticky: {
    position: 'fixed'
  }
}

const getPublicUser = gql`
  query getPublicUser($slug: String!) {
    user(slug: $slug) {
      id
      username
      name
      email
      emailAccessRole
      portrait
      hasPublicProfile
      statement
      isListed
      isAdminUnlisted
      sequenceNumber
      credentials {
        description
        verified
      }
      facebookId
      twitterHandle
      publicUrl
      badges
      documents {
        totalCount
        nodes {
          meta {
            kind
            credits
            title
            description
            publishDate
            slug
          }
        }
      }
      latestComments(limit: 7) {
        id
        content
        discussion {
          id
          title
        }
        createdAt
      }
    }
  }
`

class Profile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sticky: false
    }

    this.onScroll = () => {
      const y = window.pageYOffset
      const mobile = window.innerWidth < mediaQueries.mBreakPoint
      if (!mobile && y + HEADER_HEIGHT > this.y + this.innerHeight) {
        if (!this.state.sticky) {
          this.setState({ sticky: true })
        }
      } else {
        if (this.state.sticky) {
          this.setState({ sticky: false })
        }
      }
    }
    this.innerRef = ref => {
      this.inner = ref
    }
    this.measure = () => {
      if (this.inner) {
        const rect = this.inner.getBoundingClientRect()
        this.y = window.pageYOffset + rect.top
        this.innerHeight = rect.height
        this.x = window.pageXOffset + rect.left
      }
      this.onScroll()
    }
  }

  componentDidMount () {
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.measure)
    this.measure()
  }
  componentDidUpdate () {
    this.measure()
  }
  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.measure)
  }

  render () {
    const {
      url,
      t,
      me,
      data: { loading, error, user }
    } = this.props

    const metaData = {
      title: user
        ? t('pages/profile/pageTitle', { name: user.name })
        : t('pages/profile/empty/pageTitle')
    }

    return (
      <Frame url={url} meta={metaData} raw>
        <Loader
          loading={loading}
          error={error}
          render={() => {
            if (!user) {
              return (
                <MainContainer>
                  <br /><br />
                  <Interaction.H2>{t('pages/profile/empty/title')}</Interaction.H2>
                  <p>
                    {t.elements('pages/profile/empty/content', {
                      link: (
                        <Link key='account' route='account'>
                          <a {...linkRule}>{t('Frame/Popover/myaccount')}</a>
                        </Link>
                      )
                    })}
                  </p>
                </MainContainer>
              )
            }

            return (
              <Fragment>
                {!user.hasPublicProfile && (
                  <Box>
                    <MainContainer>
                      {t('profile/preview')}
                    </MainContainer>
                  </Box>
                )}
                <MainContainer>
                  <div ref={this.innerRef}>
                    <Testimonial testimonial={{
                      image: user.portrait,
                      quote: user.statement,
                      sequenceNumber: user.sequenceNumber
                    }} />
                  </div>
                  <div {...styles.container}>
                    <div
                      {...(this.state.sticky
                        ? merge(styles.sidebar, styles.sticky, {
                          top: `${HEADER_HEIGHT + SIDEBAR_TOP}px`,
                          left: `${this.x}px`
                        })
                        : styles.sidebar)}
                    >
                      <Interaction.H3>{user.name}</Interaction.H3>
                      {user.credentials && user.credentials.map(credential => (
                        <div {...styles.credential}>
                          {credential.description}
                        </div>
                      ))}

                      {user.badges && (
                        <div {...styles.badges}>
                          {user.badges.map(badge => (
                            <Badge badge={badge} size={27} />
                          ))}
                        </div>
                      )}
                      {me && me.id === user.id
                        ? <Update />
                        : <PointerList user={user} />}
                    </div>
                    <div>
                      {user.documents &&
                        user.documents.nodes.map(doc => (
                          <TeaserFeed
                            {...doc.meta}
                            Link={ArticleLink}
                            key={doc.meta.slug}
                          />
                        ))}
                    </div>
                    <LatestComments comments={user.latestComments} />
                  </div>
                </MainContainer>
              </Fragment>
            )
          }}
        />
      </Frame>
    )
  }
}

export default compose(
  withT,
  withMe,
  graphql(getPublicUser, {
    options: ({url}) => ({
      variables: {
        slug: url.query.slug
      }
    }),
    props: ({data, ownProps: {serverContext, url, me}}) => {
      const slug = url.query.slug
      if (serverContext && !data.error && !data.loading && !data.user) {
        serverContext.res.statusCode = 404
      }
      let redirect
      if (slug === 'me') {
        redirect = me
      }
      const username = data.user && data.user.username
      if (username && username !== slug) {
        redirect = data.user
      }
      if (redirect) {
        const targetSlug = redirect.username || redirect.id
        if (serverContext) {
          serverContext.res.redirect(301, `/~${targetSlug}`)
          serverContext.res.end()
        } else {
          Router.replaceRoute(
            'profile',
            {slug: targetSlug}
          )
        }
      }

      return {
        data
      }
    }
  })
)(Profile)

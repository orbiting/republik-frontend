import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'

import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'

import { Link, Router } from '../../lib/routes'

import Loader from '../Loader'
import Frame, { MainContainer } from '../Frame'
import Box from '../Frame/Box'

import ArticleLink from '../Link/Article'

import { HEADER_HEIGHT, TESTIMONIAL_IMAGE_SIZE } from '../constants'

import Badge from './Badge'
import LatestComments from './LatestComments'
import Contact from './Contact'
import Portrait from './Portrait'
import Statement from './Statement'
import Biography from './Biography'
import Edit from './Edit'

import {
  TeaserFeed,
  Interaction,
  colors,
  fontStyles,
  linkRule,
  mediaQueries,
  FieldSet
} from '@project-r/styleguide'

const SIDEBAR_TOP = 20

const PORTRAIT_SIZE_M = TESTIMONIAL_IMAGE_SIZE
const PORTRAIT_SIZE_S = 101

const styles = {
  container: css({
    borderTop: `1px solid ${colors.divider}`,
    paddingTop: SIDEBAR_TOP + 5,
    position: 'relative',
    paddingLeft: `${PORTRAIT_SIZE_M + 20}px`,
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
    width: `${PORTRAIT_SIZE_M}px`,
    [mediaQueries.onlyS]: {
      position: 'static',
      width: 'auto'
    }
  }),
  head: css({
    position: 'relative',
    paddingTop: 20
  }),
  statement: css({
    [mediaQueries.mUp]: {
      float: 'right',
      width: `calc(100% - ${PORTRAIT_SIZE_M + 20}px)`,
      paddingBottom: 30
    }
  }),
  portrait: css({
    width: PORTRAIT_SIZE_S,
    height: PORTRAIT_SIZE_S,
    [mediaQueries.mUp]: {
      width: PORTRAIT_SIZE_M,
      height: PORTRAIT_SIZE_M
    }
  }),
  headInfo: css({
    ...fontStyles.sansSerifRegular16,
    position: 'absolute',
    bottom: 5,
    left: PORTRAIT_SIZE_S + 10,
    [mediaQueries.mUp]: {
      left: PORTRAIT_SIZE_M + 20
    }
  }),
  credential: css({
    ...fontStyles.sansSerifRegular16
  }),
  badges: css({
    margin: '20px 0 30px 0'
  })
}

const getPublicUser = gql`
  query getPublicUser($slug: String!) {
    user(slug: $slug) {
      id
      username
      firstName
      lastName
      name
      email
      emailAccessRole
      phoneNumber
      phoneNumberNote
      phoneNumberAccessRole
      portrait
      hasPublicProfile
      statement
      biography
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
      isMobile: false,
      sticky: false,
      isEditing: false,
      showErrors: false,
      values: {},
      errors: {},
      dirty: {}
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
      const isMobile = window.innerWidth < mediaQueries.mBreakPoint
      if (isMobile !== this.state.isMobile) {
        this.setState({isMobile})
      }
      if (this.inner) {
        const rect = this.inner.getBoundingClientRect()
        this.y = window.pageYOffset + rect.top
        this.innerHeight = rect.height
        this.x = window.pageXOffset + rect.left
      }
      this.onScroll()
    }

    this.startEditing = () => {
      const { me, data: { user } } = this.props
      const { isEditing } = this.state
      if (!isEditing && me && me.id === user.id) {
        this.setState({
          isEditing: true,
          values: {
            ...user,
            portrait: undefined
          }
        })
        window.scrollTo(0, 0)
      }
    }
    this.autoEditStart = () => {
      const { data: { user } } = this.props
      if (!user.username) {
        this.startEditing() // will check if it's me
      }
    }
    this.onChange = fields => {
      this.startEditing()
      this.setState(FieldSet.utils.mergeFields(fields))
    }
  }

  componentDidMount () {
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.measure)
    this.measure()
    this.autoEditStart()
  }
  componentDidUpdate (prevProps) {
    this.measure()
    if (!prevProps.data.user) {
      this.autoEditStart()
    }
  }
  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.measure)
  }

  render () {
    const {
      url,
      t,
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

            const {
              isEditing,
              values, errors, dirty,
              isMobile
            } = this.state

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
                  <div ref={this.innerRef} {...styles.head}>
                    <p {...styles.statement}>
                      <Statement
                        user={user}
                        isEditing={isEditing}
                        onChange={this.onChange}
                        values={values}
                        errors={errors}
                        dirty={dirty} />
                    </p>
                    <div {...styles.portrait}>
                      <Portrait
                        user={user}
                        isEditing={isEditing}
                        onChange={this.onChange}
                        values={values}
                        errors={errors}
                        dirty={dirty} />
                    </div>
                    <div {...styles.headInfo}>
                      {t('memberships/sequenceNumber/label', {
                        sequenceNumber: user.sequenceNumber
                      })}
                    </div>
                  </div>
                  <div {...styles.container}>
                    <div
                      {...styles.sidebar}
                      style={this.state.sticky && !isEditing
                        ? {
                          position: 'fixed',
                          top: `${HEADER_HEIGHT + SIDEBAR_TOP}px`,
                          left: `${this.x}px`
                        }
                        : {}}
                    >
                      <Interaction.H3>{user.name}</Interaction.H3>
                      {user.credentials && user.credentials.map((credential, i) => (
                        <div key={i} {...styles.credential}>
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
                      <Contact
                        user={user}
                        isEditing={isEditing}
                        onChange={this.onChange}
                        values={values}
                        errors={errors}
                        dirty={dirty} />
                      {!isMobile && <Edit
                        user={user}
                        state={this.state}
                        setState={this.setState.bind(this)}
                        startEditing={this.startEditing} />}
                    </div>
                    <Biography
                      user={user}
                      isEditing={isEditing}
                      onChange={this.onChange}
                      values={values}
                      errors={errors}
                      dirty={dirty} />
                    {isMobile && <div style={{marginBottom: 40}}>
                      <Edit
                        user={user}
                        state={this.state}
                        setState={this.setState.bind(this)}
                        startEditing={this.startEditing} />
                    </div>}
                    <div>
                      {user.documents && user.documents.totalCount &&
                        <Interaction.H3 style={{marginBottom: 20}}>
                          {t.pluralize('profile/documents/title', {
                            count: user.documents.totalCount
                          })}
                        </Interaction.H3>
                      }
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

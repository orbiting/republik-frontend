import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import { withRouter } from 'next/router'

import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'

import { Link, Router } from '../../lib/routes'

import Loader from '../Loader'
import Frame, { MainContainer } from '../Frame'
import Box from '../Frame/Box'
import ActionBar from '../ActionBar'
import FeedActionBar from '../ActionBar/Feed'

import HrefLink from '../Link/Href'
import StatusError from '../StatusError'

import { HEADER_HEIGHT, TESTIMONIAL_IMAGE_SIZE } from '../constants'
import { ASSETS_SERVER_BASE_URL, PUBLIC_BASE_URL } from '../../lib/constants'

import Badge from './Badge'
import Comments from './Comments'
import Contact from './Contact'
import Portrait from './Portrait'
import Statement from './Statement'
import Biography from './Biography'
import Edit from './Edit'
import Credentials from './Credentials'
import Settings from './Settings'

import {
  A,
  colors,
  FieldSet,
  fontStyles,
  Interaction,
  linkRule,
  mediaQueries,
  TeaserFeed
} from '@project-r/styleguide'
import ElectionBallotRow from '../Vote/ElectionBallotRow'
import { documentListQueryFragment } from '../Feed/DocumentListContainer'

const SIDEBAR_TOP = 20

const PORTRAIT_SIZE_M = TESTIMONIAL_IMAGE_SIZE
const PORTRAIT_SIZE_S = 101

const styles = {
  container: css({
    borderTop: `1px solid ${colors.divider}`,
    position: 'relative',
    paddingBottom: 60,
    paddingTop: 10,
    [mediaQueries.mUp]: {
      paddingTop: SIDEBAR_TOP + 5
    }
  }),
  sidebar: css({
    paddingBottom: '20px',
    [mediaQueries.mUp]: {
      float: 'left',
      width: PORTRAIT_SIZE_M
    }
  }),
  mainColumn: css({
    [mediaQueries.mUp]: {
      float: 'left',
      paddingLeft: 20,
      width: `calc(100% - ${PORTRAIT_SIZE_M}px)`
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
    right: 0,
    left: PORTRAIT_SIZE_S + 10,
    [mediaQueries.mUp]: {
      left: PORTRAIT_SIZE_M + 20
    }
  }),
  headInfoNumber: css({
    display: 'inline-block',
    paddingTop: 3,
    float: 'right',
    marginRight: 10,
    verticalAlign: 'middle',
    [mediaQueries.mUp]: {
      marginRight: 0,
      float: 'left'
    }
  }),
  headInfoShare: css({
    display: 'inline-block',
    float: 'right',
    verticalAlign: 'middle'
  }),
  badges: css({
    margin: '20px 0 30px 0'
  }),
  candidacy: css({
    marginTop: 0,
    marginBottom: 20
  })
}

export const DEFAULT_VALUES = {
  publicUrl: 'https://'
}

const getPublicUser = gql`
  query getPublicUser($slug: String!) {
    user(slug: $slug) {
      id
      username
      firstName
      lastName
      updatedAt
      name
      email
      emailAccessRole
      phoneNumber
      phoneNumberNote
      phoneNumberAccessRole
      portrait
      hasPublicProfile
      isEligibleForProfile
      statement
      biography
      isListed
      isAdminUnlisted
      sequenceNumber
      pgpPublicKey
      pgpPublicKeyId
      credentials {
        isListed
        description
        verified
      }
      facebookId
      twitterHandle
      publicUrl
      badges
      documents(first: 150) {
        ...DocumentListConnection
      }
      comments(first: 150) {
        totalCount
        nodes {
          id
          content
          preview(length:210) {
            string
            more
          }
          tags
          parentIds
          discussion {
            id
            title
            path
            document {
              id
              meta {
                title
                path
                template
                ownDiscussion {
                  id
                  closed
                }
                linkedDiscussion {
                  id
                  path
                  closed
                }
              }
            }
          }
          createdAt
        }
      }
      candidacies {
        election {
          slug
          description
          beginDate
          endDate
          candidacyEndDate
          discussion {
            id
          }
        }
        id
        yearOfBirth
        city
        recommendation
        comment {
          id
        }
      }
    }
  }
  ${documentListQueryFragment}
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
      let sticky = (
        !mobile &&
        y + HEADER_HEIGHT > this.y + this.innerHeight &&
        this.mainHeight > this.sidebarHeight &&
        this.sidebarHeight < (window.innerHeight - HEADER_HEIGHT - SIDEBAR_TOP)
      )

      if (sticky !== this.state.sticky) {
        this.setState({ sticky })
      }
    }
    this.setInnerRef = ref => {
      this.innerRef = ref
    }
    this.setSidebarInnerRef = ref => {
      this.sidebarInnerRef = ref
    }
    this.setMainRef = ref => {
      this.mainRef = ref
    }
    this.measure = () => {
      const isMobile = window.innerWidth < mediaQueries.mBreakPoint
      if (isMobile !== this.state.isMobile) {
        this.setState({ isMobile })
      }
      if (this.innerRef) {
        const rect = this.innerRef.getBoundingClientRect()
        this.y = window.pageYOffset + rect.top
        this.innerHeight = rect.height
        this.x = window.pageXOffset + rect.left
      }
      if (this.sidebarInnerRef) {
        this.sidebarHeight = this.sidebarInnerRef.getBoundingClientRect().height
      }
      if (this.mainRef) {
        this.mainHeight = this.mainRef.getBoundingClientRect().height
      }
      this.onScroll()
    }
    this.isMe = () => {
      const { me, data: { user } } = this.props
      return me && me.id === user.id
    }
    this.startEditing = () => {
      const { data: { user } } = this.props
      const { isEditing } = this.state
      if (!isEditing && this.isMe()) {
        const credential = user.credentials && user.credentials.find(c => c.isListed)
        this.setState({
          isEditing: true,
          values: {
            ...user,
            publicUrl: user.publicUrl || DEFAULT_VALUES.publicUrl,
            credential: credential && credential.description,
            portrait: undefined
          }
        })
        window.scrollTo(0, 0)
      }
    }
    this.autoEditStart = () => {
      const { data: { user } } = this.props
      if (user && !user.username && user.isEligibleForProfile) {
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
      t,
      me,
      data: { loading, error, user }
    } = this.props

    const metaData = {
      image: user && user.portrait
        ? `${ASSETS_SERVER_BASE_URL}/render?width=1200&height=628&updatedAt=${encodeURIComponent(user.updatedAt)}&url=${encodeURIComponent(`${PUBLIC_BASE_URL}/community?share=${user.id}`)}`
        : '',
      title: user
        ? t('pages/profile/pageTitle', { name: user.name })
        : t('pages/profile/empty/pageTitle')
    }

    return (
      <Frame meta={metaData} raw>
        <Loader
          loading={loading}
          error={error}
          render={() => {
            if (!user) {
              return (
                <StatusError
                  statusCode={404}
                  serverContext={this.props.serverContext}>
                  <Interaction.H2>{t('pages/profile/empty/title')}</Interaction.H2>
                  {!!me && <p>
                    {t.elements('pages/profile/empty/content', {
                      link: (
                        <Link route='profile' params={{ slug: me.username || me.id }}>
                          <a {...linkRule}>{t('pages/profile/empty/content/linktext')}</a>
                        </Link>
                      )
                    })}
                  </p>}
                </StatusError>
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
                      <Interaction.P>{t('profile/private')}</Interaction.P>
                    </MainContainer>
                  </Box>
                )}
                <MainContainer>
                  <div ref={this.setInnerRef} {...styles.head}>
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
                        isMe={this.isMe()}
                        onChange={this.onChange}
                        values={values}
                        errors={errors}
                        dirty={dirty} />
                    </div>
                    <div {...styles.headInfo}>
                      {!!user.hasPublicProfile &&
                      <span {...styles.headInfoShare}>
                        <ActionBar
                          title={t('profile/share/title', { name: user.name })}
                          emailSubject={t('profile/share/emailSubject', { name: user.name })}
                          url={`${PUBLIC_BASE_URL}/~${user.username}`}
                          download={metaData.image}
                          shareOverlayTitle={t('profile/share/overlayTitle')}
                        />
                      </span>
                      }
                      {!!user.sequenceNumber && <span {...styles.headInfoNumber}>
                        {t('memberships/sequenceNumber/label', {
                          sequenceNumber: user.sequenceNumber
                        })}
                      </span>}
                      <div style={{ clear: 'both' }} />
                    </div>
                  </div>
                  <div {...styles.container}>
                    <div {...styles.sidebar}>
                      <div style={this.state.sticky && !isEditing
                        ? {
                          position: 'fixed',
                          top: `${HEADER_HEIGHT + SIDEBAR_TOP}px`,
                          left: `${this.x}px`,
                          width: PORTRAIT_SIZE_M
                        }
                        : {}}>
                        <div ref={this.setSidebarInnerRef}>
                          <Interaction.H3>{user.name}</Interaction.H3>
                          <Credentials
                            user={user}
                            isEditing={isEditing}
                            onChange={this.onChange}
                            values={values}
                            errors={errors}
                            dirty={dirty} />
                          {user.badges && (
                            <div {...styles.badges}>
                              {user.badges.map(badge => (
                                <Badge badge={badge} size={27} />
                              ))}
                            </div>
                          )}
                          <Settings
                            user={user}
                            isEditing={isEditing}
                            onChange={this.onChange}
                            values={values}
                            errors={errors}
                            dirty={dirty} />
                          <Edit
                            user={user}
                            state={this.state}
                            setState={this.setState.bind(this)}
                            startEditing={this.startEditing}
                            onChange={this.onChange} />
                          <Contact
                            user={user}
                            isEditing={isEditing}
                            onChange={this.onChange}
                            values={values}
                            errors={errors}
                            dirty={dirty} />
                        </div>
                      </div>
                    </div>
                    <div {...styles.mainColumn} ref={this.setMainRef}>
                      <Biography
                        user={user}
                        isEditing={isEditing}
                        onChange={this.onChange}
                        values={values}
                        errors={errors}
                        dirty={dirty} />
                      {isMobile && isEditing && <div style={{ marginBottom: 40 }}>
                        <Edit
                          user={user}
                          state={this.state}
                          setState={this.setState.bind(this)}
                          startEditing={this.startEditing} />
                      </div>}
                      {user.candidacies.map((c, i) =>
                        <div key={i} style={{ marginBottom: 60 }}>
                          <Interaction.H3 style={{ marginBottom: 0 }}>
                            {`${c.election.description}`}
                          </Interaction.H3>
                          <div style={{ marginTop: 10 }}>
                            <ElectionBallotRow
                              candidate={{ ...c, user }}
                              expanded
                              maxVotes={0}
                              showMeta={false}
                              profile
                            />
                          </div>
                          { this.isMe() && c.election && (new Date() < new Date(c.election.candidacyEndDate)) &&
                          <div style={{ marginTop: 10 }}>
                            <Link route='voteSubmit' params={{ edit: true }} passHref>
                              <A>Kandidatur bearbeiten</A>
                            </Link>
                          </div>
                          }
                        </div>
                      )
                      }
                      <div>
                        {user.documents && !!user.documents.totalCount &&
                        <Interaction.H3 style={{ marginBottom: 20 }}>
                          {t.pluralize('profile/documents/title', {
                            count: user.documents.totalCount
                          })}
                        </Interaction.H3>
                        }
                        {user.documents &&
                        user.documents.nodes.map(doc => (
                          <TeaserFeed
                            {...doc.meta}
                            title={doc.meta.shortTitle || doc.meta.title}
                            description={!doc.meta.shortTitle && doc.meta.description}
                            Link={HrefLink}
                            key={doc.meta.path}
                            bar={<FeedActionBar
                              documentId={doc.id}
                              userBookmark={doc.userBookmark}
                              userProgress={doc.userProgress}
                              {...doc.meta}
                              meta={doc.meta} />}
                          />
                        ))}
                      </div>
                      <Comments comments={user.comments} />
                    </div>
                    <div style={{ clear: 'both' }} />
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
  withRouter,
  graphql(getPublicUser, {
    options: ({ router }) => ({
      variables: {
        slug: router.query.slug
      }
    }),
    props: ({ data, ownProps: { serverContext, router, me } }) => {
      const slug = router.query.slug
      let redirect
      if (slug === 'me') {
        redirect = me
      }
      if (!data.loading) {
        const username = data.user && data.user.username
        if (username && username !== slug) {
          redirect = data.user
        }
      }
      if (redirect) {
        const targetSlug = redirect.username || redirect.id
        if (serverContext) {
          serverContext.res.redirect(301, `/~${targetSlug}`)
          serverContext.res.end()
        } else if (process.browser) { // SSR does two two-passes: data (with serverContext) & render (without)
          Router.replaceRoute(
            'profile',
            { slug: targetSlug }
          )
        }
      }

      return {
        data
      }
    }
  })
)(Profile)

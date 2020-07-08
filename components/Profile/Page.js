import React, { useState, useRef, useEffect, Fragment } from 'react'
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
import StatusError from '../StatusError'
import { cardFragment } from '../Card/fragments'
import Card, { styles as cardStyles } from '../Card/Card'
import { RawContainer as CardContainer } from '../Card/Container'
import CardDetails from '../Card/Details'
import SubscribeMenu from '../Notifications/SubscribeMenu'

import { TESTIMONIAL_IMAGE_SIZE } from '../constants'
import { ASSETS_SERVER_BASE_URL, PUBLIC_BASE_URL } from '../../lib/constants'
import ShadowQueryLink from '../Link/ShadowQuery'

import Badge from './Badge'
import Comments from './Comments'
import Documents from './Documents'
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
  Button,
  usePrevious,
  useHeaderHeight
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
  query getPublicUser(
    $slug: String!
    $firstDocuments: Int!
    $firstComments: Int!
    $afterDocument: String
    $afterComment: String
  ) {
    user(slug: $slug) {
      id
      slug
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
      biographyContent
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
      documents(first: $firstDocuments, after: $afterDocument) {
        ...DocumentListConnection
      }
      subscribedByMe {
        id
        active
        filters
        object {
          ... on User {
            id
            name
          }
          ... on Document {
            id
            meta {
              title
            }
          }
        }
      }
      comments(first: $firstComments, after: $afterComment) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          id
          published
          adminUnpublished
          preview(length: 210) {
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
      cards(first: 1) {
        nodes {
          id
          ...Card
          group {
            id
            name
            slug
          }
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
  ${cardFragment}
`

const makeLoadMore = (fetchMore, dataType, variables) => () =>
  fetchMore({
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const getConnection = data => data.user[dataType]
      const prevCon = getConnection(previousResult)
      const moreCon = getConnection(fetchMoreResult)
      const nodes = [...prevCon.nodes, ...moreCon.nodes].filter(
        // deduplicating due to off by one in pagination API
        (node, index, all) => all.findIndex(n => n.id === node.id) === index
      )
      return {
        ...previousResult,
        user: {
          ...previousResult.user,
          [dataType]: {
            ...moreCon,
            nodes
          }
        }
      }
    },
    variables
  })

const LoadedProfile = props => {
  const [state, setRawState] = useState({
    isEditing: false,
    showErrors: false,
    values: {},
    errors: {},
    dirty: {}
  })
  const setState = newState =>
    setRawState(prevState => ({
      ...prevState,
      ...(typeof newState === 'function' ? newState(prevState) : newState)
    }))

  const [layout, setLayout] = useState({
    isMobile: false,
    isSticky: false
  })
  const innerRef = useRef()
  const sidebarInnerRef = useRef()
  const mainRef = useRef()

  const [headerHeight] = useHeaderHeight()
  const currentRef = useRef({})
  currentRef.current.headerHeight = headerHeight
  currentRef.current.layout = layout

  useEffect(() => {
    const onScroll = () => {
      const { current } = currentRef
      const y = window.pageYOffset
      const mobile = window.innerWidth < mediaQueries.mBreakPoint
      const isSticky =
        !mobile &&
        y + current.headerHeight > current.y + current.innerHeight &&
        current.mainHeight > current.sidebarHeight &&
        current.sidebarHeight <
          window.innerHeight - current.headerHeight - SIDEBAR_TOP

      if (isSticky !== current.layout.isSticky) {
        setLayout(prev => ({ ...prev, isSticky }))
      }
    }
    const measure = () => {
      const { current } = currentRef
      const isMobile = window.innerWidth < mediaQueries.mBreakPoint
      if (isMobile !== current.layout.isMobile) {
        setLayout(prev => ({ ...prev, isMobile }))
      }
      if (innerRef.current) {
        const rect = innerRef.current.getBoundingClientRect()
        current.y = window.pageYOffset + rect.top
        current.innerHeight = rect.height
        const x = window.pageXOffset + rect.left
        if (x !== current.layout.x) {
          setLayout(prev => ({ ...prev, x }))
        }
      }
      if (sidebarInnerRef.current) {
        current.sidebarHeight = sidebarInnerRef.current.getBoundingClientRect().height
      }
      if (mainRef.current) {
        current.mainHeight = mainRef.current.getBoundingClientRect().height
      }
      onScroll()
    }
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', measure)
    measure()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
    }
  }, [])

  const {
    t,
    me,
    data: { user, fetchMore },
    card,
    metaData
  } = props
  const isMe = me && me.id === user.id

  const startEditing = () => {
    const { isEditing } = state
    if (!isEditing && isMe) {
      const credential =
        user.credentials && user.credentials.find(c => c.isListed)
      setState({
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
  const prevUser = usePrevious(user)
  useEffect(() => {
    if (prevUser) {
      return
    }
    if (user && !user.username && user.isEligibleForProfile) {
      startEditing() // will check if it's me
    }
  }, [prevUser, user])

  const onChange = fields => {
    startEditing()
    setState(FieldSet.utils.mergeFields(fields))
  }

  const { isEditing, values, errors, dirty } = state
  return (
    <Fragment>
      {!user.hasPublicProfile && (
        <Box>
          <MainContainer>
            <Interaction.P>{t('profile/private')}</Interaction.P>
          </MainContainer>
        </Box>
      )}
      {card && (
        <CardContainer imprint={false} style={{ minHeight: 300 * 1.4 + 60 }}>
          <div
            {...css({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap'
            })}
          >
            <div
              {...cardStyles.cardInner}
              style={{
                width: 300,
                height: 300 * 1.4,
                transform: 'rotate(-1deg)',
                margin: '30px 10px'
              }}
            >
              <Card width={300} {...card} t={t} firstSlideOnly />
            </div>
            <div
              {...css({
                padding: 30,
                [mediaQueries.mUp]: {
                  margin: '0 30px'
                }
              })}
            >
              <ShadowQueryLink
                path={`/wahltindaer/${card.group.slug}`}
                query={{ top: card.id }}
              >
                <Button primary>«Wahltindär» spielen</Button>
              </ShadowQueryLink>
            </div>
          </div>
        </CardContainer>
      )}
      <MainContainer>
        <div ref={innerRef} {...styles.head}>
          {!card && (
            <>
              <p {...styles.statement}>
                <Statement
                  user={user}
                  isEditing={isEditing}
                  onChange={onChange}
                  values={values}
                  errors={errors}
                  dirty={dirty}
                />
              </p>
              <div {...styles.portrait}>
                <Portrait
                  user={user}
                  isEditing={isEditing}
                  isMe={isMe}
                  onChange={onChange}
                  values={values}
                  errors={errors}
                  dirty={dirty}
                />
              </div>
              <div {...styles.headInfo}>
                {!!user.hasPublicProfile && (
                  <span {...styles.headInfoShare}>
                    <ActionBar
                      title={t('profile/share/title', {
                        name: user.name
                      })}
                      emailSubject={t('profile/share/emailSubject', {
                        name: user.name
                      })}
                      url={`${PUBLIC_BASE_URL}/~${user.slug}`}
                      download={metaData.image}
                      shareOverlayTitle={t('profile/share/overlayTitle')}
                    />
                  </span>
                )}
                {!!user.sequenceNumber && (
                  <span {...styles.headInfoNumber}>
                    {t('memberships/sequenceNumber/label', {
                      sequenceNumber: user.sequenceNumber
                    })}
                  </span>
                )}
                <div style={{ clear: 'both' }} />
              </div>
            </>
          )}
        </div>
        <div
          {...styles.container}
          style={{ borderTop: card ? 'none' : undefined }}
        >
          <div {...styles.sidebar}>
            <div
              style={
                layout.isSticky && !isEditing
                  ? {
                      position: 'fixed',
                      top: `${headerHeight + SIDEBAR_TOP}px`,
                      left: `${layout.x}px`,
                      width: PORTRAIT_SIZE_M
                    }
                  : {}
              }
            >
              <div ref={sidebarInnerRef}>
                <Interaction.H3>{user.name}</Interaction.H3>
                <Credentials
                  user={user}
                  isEditing={isEditing}
                  onChange={onChange}
                  values={values}
                  errors={errors}
                  dirty={dirty}
                />
                {/* show sequence # of profiles with a card here */}
                {card && !!user.sequenceNumber && (
                  <div style={{ color: colors.text }}>
                    {t('memberships/sequenceNumber/label', {
                      sequenceNumber: user.sequenceNumber
                    })}
                  </div>
                )}
                {user.badges && (
                  <div {...styles.badges}>
                    {user.badges.map((badge, i) => (
                      <Badge key={i} badge={badge} size={27} />
                    ))}
                  </div>
                )}
                <Settings
                  user={user}
                  isEditing={isEditing}
                  onChange={onChange}
                  values={values}
                  errors={errors}
                  dirty={dirty}
                />
                <Edit
                  user={user}
                  state={state}
                  setState={setState}
                  startEditing={startEditing}
                  onChange={onChange}
                />
                <Contact
                  user={user}
                  isEditing={isEditing}
                  onChange={onChange}
                  values={values}
                  errors={errors}
                  dirty={dirty}
                />
                <div>
                  <SubscribeMenu
                    label='Profil Abonnieren'
                    showAuthorFilter={true}
                    subscriptions={{ nodes: Array.of(user.subscribedByMe) }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div {...styles.mainColumn} ref={mainRef}>
            <Biography
              user={user}
              isEditing={isEditing}
              onChange={onChange}
              values={values}
              errors={errors}
              dirty={dirty}
            />
            {card && (
              <div style={{ marginBottom: 40 }}>
                <CardDetails card={card} skipSpider={!card.user.portrait} />
              </div>
            )}
            {layout.isMobile && isEditing && (
              <div style={{ marginBottom: 40 }}>
                <Edit
                  user={user}
                  state={state}
                  setState={setState}
                  startEditing={startEditing}
                />
              </div>
            )}
            {user.candidacies.map((c, i) => (
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
                {isMe &&
                  c.election &&
                  new Date() < new Date(c.election.candidacyEndDate) && (
                    <div style={{ marginTop: 10 }}>
                      <Link route='voteSubmit' params={{ edit: true }} passHref>
                        <A>Kandidatur bearbeiten</A>
                      </Link>
                    </div>
                  )}
              </div>
            ))}
            <Documents
              documents={user.documents}
              loadMore={makeLoadMore(fetchMore, 'documents', {
                firstComments: 0,
                firstDocuments: 20,
                afterDocument:
                  user.documents.pageInfo && user.documents.pageInfo.endCursor
              })}
            />
            <Comments
              comments={user.comments}
              loadMore={makeLoadMore(fetchMore, 'comments', {
                firstDocuments: 0,
                firstComments: 40,
                afterComment:
                  user.comments.pageInfo && user.comments.pageInfo.endCursor
              })}
            />
          </div>
          <div style={{ clear: 'both' }} />
        </div>
      </MainContainer>
    </Fragment>
  )
}

const Profile = props => {
  const {
    t,
    me,
    data: { loading, error, user }
  } = props

  const card = user && user.cards && user.cards.nodes && user.cards.nodes[0]
  const metaData = {
    url: user ? `${PUBLIC_BASE_URL}/~${user.slug}` : undefined,
    image:
      user && user.portrait
        ? `${ASSETS_SERVER_BASE_URL}/render?width=1200&height=628&updatedAt=${encodeURIComponent(
            user.updatedAt
          )}b1&url=${encodeURIComponent(
            `${PUBLIC_BASE_URL}/community?share=${user.id}`
          )}`
        : '',
    title: card
      ? `🔥 ${user.name}`
      : user
      ? t('pages/profile/pageTitle', { name: user.name })
      : t('pages/profile/empty/pageTitle'),
    description: card
      ? 'Profil anschauen und «Republik Wahltindär» spielen.'
      : undefined
  }

  return (
    <Frame meta={metaData} raw>
      <Loader
        loading={loading}
        error={error}
        render={() => {
          if (!user) {
            return (
              <StatusError statusCode={404} serverContext={props.serverContext}>
                <Interaction.H2>
                  {t('pages/profile/empty/title')}
                </Interaction.H2>
                {!!me && (
                  <p>
                    {t.elements('pages/profile/empty/content', {
                      link: (
                        <Link
                          route='profile'
                          params={{ slug: me.username || me.id }}
                        >
                          <a {...linkRule}>
                            {t('pages/profile/empty/content/linktext')}
                          </a>
                        </Link>
                      )
                    })}
                  </p>
                )}
              </StatusError>
            )
          }

          return <LoadedProfile {...props} card={card} metaData={metaData} />
        }}
      />
    </Frame>
  )
}

export default compose(
  withT,
  withMe,
  withRouter,
  graphql(getPublicUser, {
    options: ({ router }) => ({
      variables: {
        slug: router.query.slug,
        firstDocuments: 10,
        firstComments: 10
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
        } else if (process.browser) {
          // SSR does two two-passes: data (with serverContext) & render (without)
          Router.replaceRoute('profile', { slug: targetSlug })
        }
      }

      return {
        data
      }
    }
  })
)(Profile)

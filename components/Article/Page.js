import React, { useRef, useEffect, useMemo, useContext } from 'react'
import { css } from 'glamor'
import Link from 'next/link'
import { useRouter, withRouter } from 'next/router'
import { renderMdast } from 'mdast-react-render'
import compose from 'lodash/flowRight'
import {
  graphql,
  withApollo,
  withMutation,
  withQuery,
  withSubscription
} from '@apollo/client/react/hoc'
import { ApolloConsumer, ApolloProvider, gql, useQuery } from '@apollo/client'

import {
  Center,
  Breakout,
  colors,
  Interaction,
  mediaQueries,
  TitleBlock,
  Editorial,
  ColorContextProvider,
  TeaserEmbedComment,
  SHARE_IMAGE_HEIGHT,
  SHARE_IMAGE_WIDTH,
  IconButton,
  SeriesNav
} from '@project-r/styleguide'
import { EditIcon } from '@project-r/styleguide/icons'
import { createRequire } from '@project-r/styleguide/lib/components/DynamicComponent'
import createArticleSchema from '@project-r/styleguide/lib/templates/Article'
import createFormatSchema from '@project-r/styleguide/lib/templates/Format'
import createDossierSchema from '@project-r/styleguide/lib/templates/Dossier'
import createDiscussionSchema from '@project-r/styleguide/lib/templates/Discussion'
import createNewsletterSchema from '@project-r/styleguide/lib/templates/EditorialNewsletter/web'
import createSectionSchema from '@project-r/styleguide/lib/templates/Section'
import createPageSchema from '@project-r/styleguide/lib/templates/Page'

import ActionBarOverlay from './ActionBarOverlay'
import SeriesNavButton from './SeriesNav'
import TrialPayNoteMini from './TrialPayNoteMini'
import Extract from './Extract'
import { PayNote } from './PayNote'
import Progress from './Progress'
import PodcastButtons from './PodcastButtons'
import {
  getDocumentUserData,
  getPublicDocumentData
} from './graphql/getDocument'
import withT from '../../lib/withT'
import { formatDate } from '../../lib/utils/format'
import withInNativeApp, { postMessage } from '../../lib/withInNativeApp'
import { splitByTitle } from '../../lib/utils/mdast'
import {
  ASSETS_SERVER_BASE_URL,
  PUBLIC_BASE_URL,
  PUBLIKATOR_BASE_URL
} from '../../lib/constants'
import ShareImage from './ShareImage'
import FontSizeSync from '../FontSize/Sync'
import Loader from '../Loader'
import Frame from '../Frame'
import ActionBar from '../ActionBar'
import { BrowserOnlyActionBar } from './BrowserOnly'
import { AudioContext } from '../Audio/AudioProvider'
import Discussion from '../Discussion/Discussion'
import FormatFeed from '../Feed/Format'
import StatusError from '../StatusError'
import NewsletterSignUp from '../Auth/NewsletterSignUp'
import withMembership from '../Auth/withMembership'
import { withEditor } from '../Auth/checkRoles'
import ArticleGallery from '../Gallery/ArticleGallery'
import AutoDiscussionTeaser from './AutoDiscussionTeaser'
import SectionNav from '../Sections/SectionNav'
import SectionFeed from '../Sections/SectionFeed'
import HrefLink from '../Link/Href'
import { withMarkAsReadMutation } from '../Notifications/enhancers'
import { cleanAsPath } from '../../lib/utils/link'

// Identifier-based dynamic components mapping
import dynamic from 'next/dynamic'
import CommentLink from '../Discussion/CommentLink'
import { Mutation, Query, Subscription } from '@apollo/client/react/components'
import { checkRoles } from '../../lib/apollo/withMe'
import { useMe } from '../../lib/context/MeContext'

const dynamicOptions = {
  loading: () => <Loader loading />,
  ssr: false
}
const Manifest = dynamic(() => import('../About/Manifest'), {
  ssr: true
})
const TeamTeaser = dynamic(() => import('../About/TeamTeaser'), dynamicOptions)
const TestimonialList = dynamic(
  () => import('../Testimonial/List').then(m => m.ListWithQuery),
  dynamicOptions
)
const ReasonsVideo = dynamic(() => import('../About/ReasonsVideo'), {
  ssr: true
})
const Votebox = dynamic(() => import('../Vote/Voting'), dynamicOptions)
const VoteCounter = dynamic(() => import('../Vote/VoteCounter'), dynamicOptions)
const VoteResult = dynamic(
  () => import('../Vote/VoteResultAuto'),
  dynamicOptions
)
const ElectionCandidacy = dynamic(
  () => import('../Vote/ElectionCandidacy'),
  dynamicOptions
)

const schemaCreators = {
  editorial: createArticleSchema,
  meta: createArticleSchema,
  article: createArticleSchema,
  format: createFormatSchema,
  dossier: createDossierSchema,
  discussion: createDiscussionSchema,
  editorialNewsletter: createNewsletterSchema,
  section: createSectionSchema,
  page: createPageSchema
}

export const withCommentData = graphql(
  gql`
    ${TeaserEmbedComment.data.query}
  `,
  TeaserEmbedComment.data.config
)

const dynamicComponentRequire = createRequire().alias({
  'react-apollo': {
    // Reexport react-apollo
    // (work around until all dynamic components are updated)
    // ApolloContext is no longer available but is exported in old versions of react-apollo
    ApolloConsumer,
    ApolloProvider,
    Query,
    Mutation,
    Subscription,
    graphql,
    withQuery,
    withMutation,
    withSubscription,
    withApollo,
    compose
  },
  // Reexport graphql-tag to be used by dynamic-components
  'graphql-tag': gql
})

const getSchemaCreator = template => {
  const key = template || Object.keys(schemaCreators)[0]
  const schema = schemaCreators[key]

  if (!schema) {
    try {
      console.error(`Unkown Schema ${key}`)
    } catch (e) {
      console.error(e)
    }
    return () => {
      return
    }
  }
  return schema
}

const runMetaFromQuery = (code, query) => {
  if (!code) {
    return undefined
  }
  let fn
  try {
    /* eslint-disable-next-line */
    fn = new Function('query', code)
    return fn(query)
  } catch (e) {
    typeof console !== 'undefined' &&
      console.warn &&
      console.warn('meta.fromQuery exploded', e)
  }
  return undefined
}

const EmptyComponent = ({ children }) => children

const ArticlePage = ({
  router,
  t,
  inNativeApp,
  inNativeIOSApp,
  payNoteSeed,
  payNoteTryOrBuy,
  hasActiveMembership,
  markAsReadMutation,
  serverContext
}) => {
  const actionBarRef = useRef()
  const bottomActionBarRef = useRef()
  const galleryRef = useRef()

  const { asPath } = useRouter()

  const { me } = useMe()

  const { isMember, isEditor } = useMemo(
    () => ({
      isMember: checkRoles(me, ['member']),
      isEditor: checkRoles(me, ['editor'])
    }),
    [me]
  )

  const cleanedPath = cleanAsPath(asPath)

  // Fetch public article-data
  const {
    data: articleData,
    refetch,
    loading: articleLoading,
    error: articleError
  } = useQuery(getPublicDocumentData, {
    variables: {
      path: cleanedPath
    }
  })
  const { article } = articleData ?? {}

  // Fetch user article-data related to the active-user
  const { data: articleUserData } = useQuery(getDocumentUserData, {
    variables: {
      repoId: article.repoId
    }
  })
  const userData = articleUserData?.article

  const articleMeta = article?.meta
  const articleContent = article?.content
  const articleUnreadNotifications = userData?.unreadNotifications
  const routerQuery = router.query

  const { toggleAudioPlayer, audioPlayerVisible } = useContext(AudioContext)

  const markNotificationsAsRead = () => {
    const unreadNotifications = articleUnreadNotifications?.nodes?.filter(
      n => !n.readAt
    )
    if (unreadNotifications && unreadNotifications.length) {
      unreadNotifications.forEach(n => markAsReadMutation(n.id))
    }
  }

  useEffect(() => {
    markNotificationsAsRead()
  }, [articleUnreadNotifications])

  const metaJSONStringFromQuery = useMemo(() => {
    return (
      articleContent &&
      JSON.stringify(
        runMetaFromQuery(articleContent.meta.fromQuery, routerQuery)
      )
    )
  }, [routerQuery, articleContent])
  const meta = useMemo(
    () =>
      articleMeta &&
      articleContent && {
        ...articleMeta,
        url: `${PUBLIC_BASE_URL}${articleMeta.path}`,
        ...(metaJSONStringFromQuery
          ? JSON.parse(metaJSONStringFromQuery)
          : undefined)
      },
    [articleMeta, articleContent, metaJSONStringFromQuery]
  )

  const hasMeta = !!meta
  const podcast =
    hasMeta &&
    (meta.podcast || (meta.audioSource && meta.format?.meta?.podcast))
  const newsletterMeta =
    hasMeta && (meta.newsletter || meta.format?.meta?.newsletter)

  const isSeriesOverview = hasMeta && meta.series?.overview?.id === article?.id
  const showSeriesNav = hasMeta && !!meta.series && !isSeriesOverview
  const titleBreakout = isSeriesOverview

  const { trialSignup } = routerQuery
  const showInlinePaynote = !isMember || !!trialSignup
  useEffect(() => {
    if (trialSignup === 'success') {
      refetch()
    }
  }, [trialSignup])

  const template = meta?.template
  const schema = useMemo(
    () =>
      template &&
      getSchemaCreator(template)({
        t,
        Link: HrefLink,
        plattformUnauthorizedZoneText: inNativeIOSApp
          ? t('plattformUnauthorizedZoneText/ios')
          : undefined,
        dynamicComponentRequire,
        dynamicComponentIdentifiers: {
          MANIFEST: Manifest,
          TEAM_TEASER: TeamTeaser,
          REASONS_VIDEO: ReasonsVideo,
          VOTEBOX: Votebox,
          VOTE_COUNTER: VoteCounter,
          VOTE_RESULT: VoteResult,
          TESTIMONIAL_LIST: TestimonialList,
          ELECTION_CANDIDACY: ElectionCandidacy
        },
        titleMargin: false,
        titleBreakout,
        onAudioCoverClick: toggleAudioPlayer,
        getVideoPlayerProps:
          inNativeApp && !inNativeIOSApp
            ? props => ({
                ...props,
                fullWindow: true,
                onFull: isFull => {
                  postMessage({
                    type: isFull ? 'fullscreen-enter' : 'fullscreen-exit'
                  })
                }
              })
            : undefined,
        withCommentData,
        CommentLink,
        ActionBar: BrowserOnlyActionBar,
        PayNote: showInlinePaynote ? TrialPayNoteMini : undefined
      }),
    [template, inNativeIOSApp, inNativeApp, showInlinePaynote, titleBreakout]
  )

  const documentId = article?.id
  const repoId = article?.repoId

  const isEditorialNewsletter = template === 'editorialNewsletter'
  const disableActionBar = meta?.disableActionBar
  const actionBar = article && !disableActionBar && (
    <ActionBar mode='articleTop' document={article} userData={userData} />
  )
  const actionBarEnd = actionBar
    ? React.cloneElement(actionBar, {
        mode: isSeriesOverview ? 'seriesOverviewBottom' : 'articleBottom'
      })
    : undefined

  const actionBarOverlay = actionBar
    ? React.cloneElement(actionBar, {
        mode: 'articleOverlay'
      })
    : undefined

  const series = meta?.series
  const episodes = series?.episodes
  const darkMode = article?.content?.meta?.darkMode

  const seriesNavButton = showSeriesNav && (
    <SeriesNavButton
      showInlinePaynote={showInlinePaynote}
      me={me}
      series={series}
      repoId={repoId}
    />
  )

  const colorMeta =
    meta &&
    (meta.template === 'format' || meta.template === 'section'
      ? meta
      : meta.format && meta.format.meta)
  const formatColor = colorMeta && (colorMeta.color || colors[colorMeta.kind])
  const sectionColor = meta && meta.template === 'section' && meta.color
  const MissingNode = isEditor ? undefined : ({ children }) => children

  const extract = router.query.extract
  if (extract) {
    return (
      <Loader
        loading={articleLoading}
        error={articleError}
        render={() => {
          if (!article) {
            return (
              <StatusError statusCode={404} serverContext={serverContext} />
            )
          }
          return extract === 'share' ? (
            <ShareImage meta={meta} />
          ) : (
            <Extract
              ranges={extract}
              schema={schema}
              meta={meta}
              unpack={router.query.unpack}
              mdast={{
                ...article.content,
                format: meta.format,
                section: meta.section,
                series: meta.series,
                repoId: article.repoId
              }}
            />
          )
        }}
      />
    )
  }

  const splitContent = article && splitByTitle(article.content)
  const renderSchema = content =>
    renderMdast(
      {
        ...content,
        format: meta.format,
        section: meta.section,
        series: meta.series,
        repoId: article.repoId
      },
      schema,
      { MissingNode }
    )

  const hasOverviewNav = meta ? meta.template === 'section' : true // show/keep around while loading meta
  const colorSchemeKey = darkMode ? 'dark' : 'auto'

  const shareImage =
    article &&
    `${ASSETS_SERVER_BASE_URL}/render?width=${SHARE_IMAGE_WIDTH}&height=${SHARE_IMAGE_HEIGHT}&updatedAt=${encodeURIComponent(
      `${article.id}${meta?.format ? `-${meta.format.id}` : ''}`
    )}&url=${encodeURIComponent(
      `${PUBLIC_BASE_URL}${articleMeta.path}?extract=share`
    )}`

  const metaWithSocialImages =
    meta && meta.discussionId && router.query.focus
      ? undefined
      : meta && {
          ...meta,
          facebookImage: meta?.shareText ? shareImage : meta?.facebookImage,
          twitterImage: meta?.shareText ? shareImage : meta?.twitterImage
        }

  return (
    <Frame
      raw
      // Meta tags for a focus comment are rendered in Discussion/Commments.js
      meta={metaWithSocialImages}
      secondaryNav={seriesNavButton}
      formatColor={formatColor}
      hasOverviewNav={hasOverviewNav}
      stickySecondaryNav={hasOverviewNav}
      pageColorSchemeKey={colorSchemeKey}
    >
      <Loader
        loading={articleLoading}
        error={articleError}
        render={() => {
          if (!article || !schema) {
            return (
              <StatusError statusCode={404} serverContext={serverContext} />
            )
          }

          const isFormat = meta.template === 'format'
          const isSection = meta.template === 'section'
          const isPage = meta.template === 'page'

          const hasNewsletterUtms =
            router.query.utm_source && router.query.utm_source === 'newsletter'

          const suppressPayNotes =
            isSection || (!!episodes && showInlinePaynote)
          const suppressFirstPayNote =
            suppressPayNotes ||
            podcast ||
            isEditorialNewsletter ||
            meta.path === '/top-storys' ||
            hasNewsletterUtms ||
            (router.query.utm_source && router.query.utm_source === 'flyer-v1')

          const payNote = (
            <PayNote
              seed={payNoteSeed}
              tryOrBuy={payNoteTryOrBuy}
              documentId={documentId}
              repoId={repoId}
              customPayNotes={article?.content?.meta?.paynotes}
              customOnly={isPage || isFormat}
              position='before'
            />
          )
          const payNoteAfter =
            payNote && React.cloneElement(payNote, { position: 'after' })

          const ownDiscussion = meta.ownDiscussion
          const linkedDiscussion =
            meta.linkedDiscussion && !meta.linkedDiscussion.closed

          const ProgressComponent =
            isMember &&
            !isSection &&
            !isFormat &&
            !isPage &&
            meta.template !== 'discussion'
              ? Progress
              : EmptyComponent

          const titleNode =
            splitContent.title &&
            splitContent.title.children[splitContent.title.children.length - 1]
          const titleAlign =
            titleNode?.data?.center || isFormat || isSection
              ? 'center'
              : undefined

          const breakout = titleNode?.data?.breakout || titleBreakout

          const format = meta.format

          const isFreeNewsletter = !!newsletterMeta && newsletterMeta.free
          const showNewsletterSignupTop = isFreeNewsletter && !me && isFormat
          const showNewsletterSignupBottom =
            isFreeNewsletter && !showNewsletterSignupTop

          return (
            <>
              <FontSizeSync />
              {meta.prepublication && (
                <div {...styles.prepublicationNotice}>
                  <Center breakout={breakout}>
                    <Interaction.P>
                      {t('article/prepublication/notice')}
                    </Interaction.P>
                  </Center>
                </div>
              )}
              <ArticleGallery
                article={article}
                show={!!router.query.gallery}
                ref={galleryRef}
              >
                <ProgressComponent
                  article={article}
                  userProgress={userData?.userProgress}
                >
                  <article style={{ display: 'block' }}>
                    {splitContent.title && (
                      <div {...styles.titleBlock}>
                        {renderSchema(splitContent.title)}
                        {isEditorialNewsletter && (
                          <TitleBlock margin={false}>
                            {format && format.meta && (
                              <Editorial.Format
                                color={
                                  format.meta.color || colors[format.meta.kind]
                                }
                              >
                                <Link href={format.meta.path} passHref>
                                  <a {...styles.link} href={format.meta.path}>
                                    {format.meta.title}
                                  </a>
                                </Link>
                              </Editorial.Format>
                            )}
                            <Interaction.Headline>
                              {meta.title}
                            </Interaction.Headline>
                            <Editorial.Credit>
                              {formatDate(new Date(meta.publishDate))}
                            </Editorial.Credit>
                          </TitleBlock>
                        )}
                        {isEditor && repoId ? (
                          <Center
                            breakout={breakout}
                            style={{ paddingBottom: 0, paddingTop: 30 }}
                          >
                            <div
                              {...(titleAlign === 'center'
                                ? styles.flexCenter
                                : {})}
                            >
                              <IconButton
                                Icon={EditIcon}
                                href={`${PUBLIKATOR_BASE_URL}/repo/${repoId}/tree`}
                                target='_blank'
                                title={t('feed/actionbar/edit')}
                                label={t('feed/actionbar/edit')}
                                labelShort={t('feed/actionbar/edit')}
                                fill={'#E9A733'}
                              />
                            </div>
                          </Center>
                        ) : null}
                        {actionBar || isSection || showNewsletterSignupTop ? (
                          <Center breakout={breakout}>
                            {actionBar && (
                              <div
                                ref={actionBarRef}
                                {...styles.actionBarContainer}
                                style={{
                                  textAlign: titleAlign,
                                  marginBottom: isEditorialNewsletter
                                    ? 0
                                    : undefined
                                }}
                              >
                                {actionBar}
                              </div>
                            )}
                            {isSection && (
                              <Breakout size='breakout'>
                                <SectionNav
                                  color={sectionColor}
                                  linkedDocuments={article.linkedDocuments}
                                />
                              </Breakout>
                            )}
                            {showNewsletterSignupTop && (
                              <div style={{ marginTop: 10 }}>
                                <NewsletterSignUp {...newsletterMeta} />
                              </div>
                            )}
                          </Center>
                        ) : (
                          <div {...styles.actionBarContainer}>
                            {/* space before paynote */}
                          </div>
                        )}

                        {!suppressFirstPayNote && payNote}
                      </div>
                    )}
                    <ColorContextProvider colorSchemeKey={colorSchemeKey}>
                      {renderSchema(splitContent.main)}
                    </ColorContextProvider>
                  </article>
                  <ActionBarOverlay
                    audioPlayerVisible={audioPlayerVisible}
                    inNativeApp={inNativeApp}
                  >
                    {actionBarOverlay}
                  </ActionBarOverlay>
                </ProgressComponent>
              </ArticleGallery>
              {meta.template === 'article' &&
                ownDiscussion &&
                !ownDiscussion.closed &&
                !linkedDiscussion &&
                !isSeriesOverview &&
                isMember && (
                  <Center breakout={breakout}>
                    <AutoDiscussionTeaser discussionId={ownDiscussion.id} />
                  </Center>
                )}
              {meta.template === 'discussion' && ownDiscussion && (
                <Center breakout={breakout}>
                  <Discussion
                    discussionId={ownDiscussion.id}
                    focusId={router.query.focus}
                    parent={router.query.parent}
                    mute={!!router.query.mute}
                    board={ownDiscussion.isBoard}
                    showPayNotes
                  />
                </Center>
              )}
              {showNewsletterSignupBottom && (
                <Center breakout={breakout}>
                  {format && !me && (
                    <Interaction.P>
                      <strong>{format.meta.title}</strong>
                    </Interaction.P>
                  )}
                  <NewsletterSignUp {...newsletterMeta} />
                </Center>
              )}
              {((isMember && meta.template === 'article') ||
                (isEditorialNewsletter &&
                  newsletterMeta &&
                  newsletterMeta.free)) && (
                <Center breakout={breakout}>
                  <div ref={bottomActionBarRef}>{actionBarEnd}</div>
                  {!!podcast && meta.template === 'article' && (
                    <>
                      <Interaction.H3>
                        {t(`PodcastButtons/title`)}
                      </Interaction.H3>
                      <PodcastButtons {...podcast} />
                    </>
                  )}
                </Center>
              )}
              {!!podcast && meta.template !== 'article' && (
                <Center breakout={breakout}>
                  <>
                    <Interaction.H3>{t(`PodcastButtons/title`)}</Interaction.H3>
                    <PodcastButtons {...podcast} />
                  </>
                </Center>
              )}
              {episodes && !isSeriesOverview && (
                <SeriesNav
                  inline
                  repoId={repoId}
                  series={series}
                  context='after'
                  PayNote={showInlinePaynote ? TrialPayNoteMini : undefined}
                  ActionBar={me && ActionBar}
                  Link={Link}
                  t={t}
                />
              )}
              {isSection && (
                <SectionFeed
                  formats={article.linkedDocuments.nodes.map(n => n.id)}
                  variablesAsString={article.content.meta.feedQueryVariables}
                />
              )}
              {isFormat && <FormatFeed formatId={article.repoId} />}
              {(hasActiveMembership || isFormat) && (
                <>
                  <br />
                  <br />
                  <br />
                  <br />
                </>
              )}
              {!suppressPayNotes && payNoteAfter}
            </>
          )
        }}
      />
    </Frame>
  )
}

const styles = {
  link: css({
    color: 'inherit',
    textDecoration: 'none'
  }),
  prepublicationNotice: css({
    backgroundColor: colors.social
  }),
  titleBlock: css({
    marginBottom: 20
  }),
  actionBarContainer: css({
    marginTop: 16,
    marginBottom: 24,
    [mediaQueries.mUp]: {
      marginBottom: 36
    }
  }),
  flexCenter: css({
    display: 'flex',
    justifyContent: 'center'
  })
}

const ComposedPage = compose(
  withT,
  withMembership,
  withEditor,
  withInNativeApp,
  withRouter,
  withMarkAsReadMutation
)(ArticlePage)

export default ComposedPage

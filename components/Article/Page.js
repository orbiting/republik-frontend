import React, { useRef, useEffect, useMemo } from 'react'
import { css } from 'glamor'
import { withRouter } from 'next/router'
import { renderMdast } from 'mdast-react-render'
import { graphql, compose } from 'react-apollo'
import * as reactApollo from 'react-apollo'
import * as graphqlTag from 'graphql-tag'

import {
  Center,
  ColorContext,
  colors,
  Interaction,
  mediaQueries,
  LazyLoad,
  TitleBlock,
  Editorial
} from '@project-r/styleguide'
import { createRequire } from '@project-r/styleguide/lib/components/DynamicComponent'
import createArticleSchema from '@project-r/styleguide/lib/templates/Article'
import createFormatSchema from '@project-r/styleguide/lib/templates/Format'
import createDossierSchema from '@project-r/styleguide/lib/templates/Dossier'
import createDiscussionSchema from '@project-r/styleguide/lib/templates/Discussion'
import createNewsletterSchema from '@project-r/styleguide/lib/templates/EditorialNewsletter/web'
import createSectionSchema from '@project-r/styleguide/lib/templates/Section'
import createStaticPageSchema from '@project-r/styleguide/lib/templates/StaticPage'
import { Breakout } from '@project-r/styleguide/lib/components/Center'

import ActionBarOverlay from './ActionBarOverlay'
import RelatedEpisodes from './RelatedEpisodes'
import SeriesNavButton from './SeriesNavButton'
import Extract from './Extract'
import { PayNote, MAX_PAYNOTE_SEED } from './PayNote'
import Progress from './Progress'
import PodcastButtons from './PodcastButtons'
import { getDocument } from './graphql/getDocument'

import withT from '../../lib/withT'
import { formatDate } from '../../lib/utils/format'
import withInNativeApp, { postMessage } from '../../lib/withInNativeApp'
import { cleanAsPath } from '../../lib/routes'
import { getRandomInt } from '../../lib/utils/helpers'
import { splitByTitle } from '../../lib/utils/mdast'
import withMemberStatus from '../../lib/withMemberStatus'
import withMe from '../../lib/apollo/withMe'
import { PUBLIC_BASE_URL } from '../../lib/constants'

import FontSizeSync from '../FontSize/Sync'
import Loader from '../Loader'
import Frame from '../Frame'
import ActionBar from '../ActionBar'
import { AudioContext } from '../Audio'
import Discussion from '../Discussion/Discussion'
import FormatFeed from '../Feed/Format'
import StatusError from '../StatusError'
import SSRCachingBoundary from '../SSRCachingBoundary'
import NewsletterSignUp from '../Auth/NewsletterSignUp'
import withMembership from '../Auth/withMembership'
import { withEditor } from '../Auth/checkRoles'
import ArticleGallery from '../Gallery/ArticleGallery'
import AutoDiscussionTeaser from './AutoDiscussionTeaser'
import SectionNav from '../Sections/SectionNav'
import SectionFeed from '../Sections/SectionFeed'
import HrefLink from '../Link/Href'
import SurviveStatus from '../Crowdfunding/SurviveStatus'
import { withMarkAsReadMutation } from '../Notifications/enhancers'

const schemaCreators = {
  editorial: createArticleSchema,
  meta: createArticleSchema,
  article: createArticleSchema,
  format: createFormatSchema,
  dossier: createDossierSchema,
  discussion: createDiscussionSchema,
  editorialNewsletter: createNewsletterSchema,
  section: createSectionSchema,
  staticPage: createStaticPageSchema
}

const dynamicComponentRequire = createRequire().alias({
  'react-apollo': reactApollo,
  'graphql-tag': graphqlTag
})

const getSchemaCreator = template => {
  const key = template || Object.keys(schemaCreators)[0]
  const schema = schemaCreators[key]

  if (!schema) {
    try {
      console.error(`Unkown Schema ${key}`)
    } catch (e) {}
    return () => {}
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
  toggleAudioPlayer,
  audioPlayerVisible,
  router,
  t,
  me,
  data,
  data: { article },
  isMember,
  isEditor,
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

  const articleMeta = article?.meta
  const articleContent = article?.content
  const articleUnreadNotifications = article?.unreadNotifications
  const routerQuery = router.query

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

  const meta = useMemo(
    () =>
      articleMeta &&
      articleContent && {
        ...articleMeta,
        url: `${PUBLIC_BASE_URL}${articleMeta.path}`,
        ...runMetaFromQuery(articleContent.meta.fromQuery, routerQuery)
      },
    [articleMeta, articleContent, routerQuery]
  )

  const podcast = useMemo(
    () =>
      meta &&
      (meta.podcast ||
        (meta.audioSource && meta.format && meta.format.meta.podcast)),
    [meta]
  )

  const newsletterMeta = useMemo(
    () =>
      meta && (meta.newsletter || (meta.format && meta.format.meta.newsletter)),
    [meta]
  )

  const schema = useMemo(
    () =>
      meta &&
      getSchemaCreator(meta.template)({
        t,
        Link: HrefLink,
        plattformUnauthorizedZoneText: inNativeIOSApp
          ? t('plattformUnauthorizedZoneText/ios')
          : undefined,
        dynamicComponentRequire,
        titleMargin: false,
        onAudioCoverClick: () => toggleAudioPlayer(meta),
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
            : undefined
      }),
    [meta, inNativeIOSApp, inNativeApp]
  )

  const showSeriesNav = useMemo(() => isMember && meta && !!meta.series, [
    meta,
    isMember
  ])

  const documentId = useMemo(() => article && article?.id, [article])
  const repoId = useMemo(() => article && article.repoId, [article])
  const isEditorialNewsletter = meta && meta.template === 'editorialNewsletter'
  const disableActionBar = meta && meta.disableActionBar
  const actionBar = article && !disableActionBar && (
    <ActionBar mode='article-top' document={article} />
  )
  const actionBarEnd = actionBar
    ? React.cloneElement(actionBar, {
        mode: 'article-bottom'
      })
    : undefined

  const actionBarOverlay = actionBar
    ? React.cloneElement(actionBar, {
        mode: 'article-overlay'
      })
    : undefined

  const series = meta && meta.series
  const episodes = series && series.episodes
  const darkMode = article?.content?.meta?.darkMode

  const seriesNavButton = showSeriesNav && (
    <SeriesNavButton t={t} series={series} />
  )

  const colorMeta =
    meta &&
    (meta.template === 'format' || meta.template === 'section'
      ? meta
      : meta.format && meta.format.meta)
  const formatColor = colorMeta && (colorMeta.color || colors[colorMeta.kind])
  const sectionColor = meta && meta.template === 'section' && meta.color
  const MissingNode = isEditor ? undefined : ({ children }) => children

  if (router.query.extract) {
    return (
      <Loader
        loading={data.loading}
        error={data.error}
        render={() => {
          if (!article) {
            return (
              <StatusError statusCode={404} serverContext={serverContext} />
            )
          }

          return (
            <Extract
              ranges={router.query.extract}
              schema={schema}
              unpack={router.query.unpack}
              mdast={{
                ...article.content,
                format: meta.format,
                section: meta.section
              }}
            />
          )
        }}
      />
    )
  }
  const customPayNotes = article?.content?.meta?.paynotes

  const payNote = (
    <PayNote
      seed={payNoteSeed}
      tryOrBuy={payNoteTryOrBuy}
      documentId={documentId}
      repoId={repoId}
      customPayNotes={customPayNotes}
      position='before'
    />
  )

  const payNoteAfter =
    payNote && React.cloneElement(payNote, { position: 'after' })

  const splitContent = article && splitByTitle(article.content)
  const renderSchema = content =>
    renderMdast(
      {
        ...content,
        format: meta.format,
        section: meta.section
      },
      schema,
      { MissingNode }
    )

  const hasOverviewNav = meta && meta.template === 'section'

  return (
    <Frame
      dark={darkMode}
      raw
      // Meta tags for a focus comment are rendered in Discussion/Commments.js
      meta={meta && meta.discussionId && router.query.focus ? undefined : meta}
      secondaryNav={seriesNavButton}
      formatColor={formatColor}
      hasOverviewNav={hasOverviewNav}
      stickySecondaryNav={hasOverviewNav}
    >
      <Loader
        loading={data.loading}
        error={data.error}
        render={() => {
          if (!article || !schema) {
            return (
              <StatusError statusCode={404} serverContext={serverContext} />
            )
          }

          const isFormat = meta.template === 'format'
          const isSection = meta.template === 'section'

          const hasNewsletterUtms =
            router.query.utm_source && router.query.utm_source === 'newsletter'

          const suppressPayNotes = isSection || isFormat
          const suppressFirstPayNote =
            suppressPayNotes ||
            podcast ||
            isEditorialNewsletter ||
            meta.path === '/top-storys' ||
            hasNewsletterUtms ||
            (router.query.utm_source && router.query.utm_source === 'flyer-v1')
          const ownDiscussion = meta.ownDiscussion
          const linkedDiscussion =
            meta.linkedDiscussion && !meta.linkedDiscussion.closed

          const ProgressComponent =
            isMember &&
            !isSection &&
            !isFormat &&
            meta.template !== 'discussion'
              ? Progress
              : EmptyComponent

          const titleNode =
            splitContent.title &&
            splitContent.title.children[splitContent.title.children.length - 1]
          const titleAlign =
            (titleNode && titleNode.data && titleNode.data.center) ||
            isFormat ||
            isSection
              ? 'center'
              : undefined

          const format = meta.format

          return (
            <>
              <FontSizeSync />
              {meta.prepublication && (
                <div {...styles.prepublicationNotice}>
                  <Center>
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
                <ProgressComponent article={article}>
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
                                contentEditable={false}
                              >
                                <HrefLink href={format.meta.path} passHref>
                                  <a {...styles.link} href={format.meta.path}>
                                    {format.meta.title}
                                  </a>
                                </HrefLink>
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
                        <Center>
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
                          {isSection && (
                            <Breakout size='breakout'>
                              <SectionNav
                                color={sectionColor}
                                linkedDocuments={article.linkedDocuments}
                              />
                            </Breakout>
                          )}
                          {!me &&
                            isEditorialNewsletter &&
                            !!newsletterMeta &&
                            newsletterMeta.free && (
                              <div style={{ marginTop: 10 }}>
                                <NewsletterSignUp {...newsletterMeta} />
                              </div>
                            )}
                        </Center>
                        {!suppressFirstPayNote && payNote}
                      </div>
                    )}
                    <SSRCachingBoundary
                      cacheKey={`${article.id}${isMember ? ':isMember' : ''}`}
                    >
                      {() => (
                        <ColorContext.Provider
                          value={darkMode && colors.negative}
                        >
                          {renderSchema(splitContent.main)}
                        </ColorContext.Provider>
                      )}
                    </SSRCachingBoundary>
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
                isMember && (
                  <Center>
                    <AutoDiscussionTeaser discussionId={ownDiscussion.id} />
                  </Center>
                )}
              {meta.template === 'discussion' && ownDiscussion && (
                <Center>
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
              {!!newsletterMeta && (
                <Center>
                  <NewsletterSignUp {...newsletterMeta} />
                </Center>
              )}
              {((isMember && meta.template === 'article') ||
                (isEditorialNewsletter &&
                  newsletterMeta &&
                  newsletterMeta.free)) && (
                <Center>
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
                <Center>
                  <>
                    <Interaction.H3>{t(`PodcastButtons/title`)}</Interaction.H3>
                    <PodcastButtons {...podcast} />
                  </>
                </Center>
              )}
              {false &&
                !suppressPayNotes &&
                !darkMode &&
                !(customPayNotes && customPayNotes.length) && (
                  <Center>
                    <LazyLoad style={{ display: 'block', minHeight: 120 }}>
                      <SurviveStatus />
                    </LazyLoad>
                  </Center>
                )}
              {isMember && episodes && (
                <RelatedEpisodes
                  title={series.title}
                  episodes={episodes}
                  path={meta.path}
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
  })
}

const ComposedPage = compose(
  withT,
  withMe,
  withMembership,
  withMemberStatus,
  withEditor,
  withInNativeApp,
  withRouter,
  withMarkAsReadMutation,
  graphql(getDocument, {
    options: ({ router: { asPath } }) => ({
      variables: {
        path: cleanAsPath(asPath)
      }
    })
  })
)(ArticlePage)

const ComposedPageWithAudio = props => (
  <AudioContext.Consumer>
    {({ toggleAudioPlayer, audioPlayerVisible }) => (
      <ComposedPage
        {...props}
        audioPlayerVisible={audioPlayerVisible}
        toggleAudioPlayer={toggleAudioPlayer}
      />
    )}
  </AudioContext.Consumer>
)

ComposedPageWithAudio.getInitialProps = () => {
  return {
    payNoteTryOrBuy: Math.random(),
    payNoteSeed: getRandomInt(MAX_PAYNOTE_SEED)
  }
}

export default ComposedPageWithAudio

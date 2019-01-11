import React, { Component, Fragment } from 'react'
import { css } from 'glamor'
import { withRouter } from 'next/router'
import Frame from '../Frame'
import ArticleActionBar from '../ActionBar/Article'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Loader from '../Loader'
import RelatedEpisodes from './RelatedEpisodes'
import SeriesNavButton from './SeriesNavButton'
import * as PayNote from './PayNote'
import PdfOverlay, { getPdfUrl, countImages } from './PdfOverlay'
import Extract from './Extract'
import withT from '../../lib/withT'
import withInNativeApp, { postMessage } from '../../lib/withInNativeApp'
import { cleanAsPath } from '../../lib/routes'

import Discussion from '../Discussion/Discussion'
import Feed from '../Feed/Format'
import StatusError from '../StatusError'
import SSRCachingBoundary from '../SSRCachingBoundary'
import { withEditor } from '../Auth/checkRoles'
import withMembership from '../Auth/withMembership'
import ArticleGallery from './ArticleGallery'
import AutoDiscussionTeaser from './AutoDiscussionTeaser'

import {
  colors,
  mediaQueries,
  Center
} from '@project-r/styleguide'

import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'
import { PUBLIC_BASE_URL } from '../../lib/constants'

import { renderMdast } from 'mdast-react-render'

import createArticleSchema from '@project-r/styleguide/lib/templates/Article'
import createFormatSchema from '@project-r/styleguide/lib/templates/Format'
import createDossierSchema from '@project-r/styleguide/lib/templates/Dossier'
import createDiscussionSchema from '@project-r/styleguide/lib/templates/Discussion'
import createNewsletterSchema from '@project-r/styleguide/lib/templates/EditorialNewsletter/web'

import {
  onDocumentFragment
} from '../Bookmarks/fragments'

const schemaCreators = {
  editorial: createArticleSchema,
  meta: createArticleSchema,
  article: createArticleSchema,
  format: createFormatSchema,
  dossier: createDossierSchema,
  discussion: createDiscussionSchema,
  editorialNewsletter: createNewsletterSchema
}

const getSchemaCreator = template => {
  const key = template || Object.keys(schemaCreators)[0]
  const schema = schemaCreators[key]

  if (!schema) {
    throw new Error(`Unkown Schema ${key}`)
  }
  return schema
}

const styles = {
  bar: css({
    display: 'inline-block',
    marginTop: '15px',
    [mediaQueries.mUp]: {
      marginTop: '20px'
    }
  })
}

const getDocument = gql`
  query getDocument($path: String!) {
    article: document(path: $path) {
      id
      content
      ...BookmarkOnDocument
      meta {
        template
        path
        title
        kind
        description
        image
        facebookDescription
        facebookImage
        facebookTitle
        twitterDescription
        twitterImage
        twitterTitle
        ownDiscussion {
          id
          closed
        }
        linkedDiscussion {
          id
          path
          closed
        }
        color
        format {
          meta {
            path
            title
            color
            kind
          }
        }
        dossier {
          meta {
            title
            path
          }
        }
        series {
          title
          episodes {
            title
            publishDate
            label
            image
            document {
              meta {
                title
                publishDate
                path
                image
              }
            }
          }
        }
        audioSource {
          mp3
          aac
          ogg
        }
        estimatedReadingMinutes
        indicateGallery
        indicateVideo
      }
    }
  }
  ${onDocumentFragment}
`

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
    typeof console !== 'undefined' && console.warn && console.warn('meta.fromQuery exploded', e)
  }
  return undefined
}

class ArticlePage extends Component {
  constructor (props) {
    super(props)

    this.barRef = ref => {
      this.bar = ref
    }

    this.bottomBarRef = ref => {
      this.bottomBar = ref
    }

    this.galleryRef = React.createRef()

    this.toggleAudio = () => {
      if (this.props.inNativeApp) {
        const { audioSource, title, path } = this.props.data.article.meta
        if (!audioSource) {
          return
        }
        postMessage({
          type: 'play-audio',
          payload: {
            url: audioSource.aac || audioSource.mp3 || audioSource.ogg,
            title,
            sourcePath: path
          }
        })
      } else {
        this.setState({
          showAudioPlayer: !this.state.showAudioPlayer
        })
      }
    }

    this.showGallery = () => {
      if (this.galleryRef) {
        this.galleryRef.current.show()
      }
    }

    this.togglePdf = () => {
      this.setState({
        showPdf: !this.state.showPdf
      })
    }

    this.state = {
      primaryNavExpanded: false,
      secondaryNavExpanded: false,
      showSecondary: false,
      showAudioPlayer: false,
      isAwayFromBottomBar: true,
      ...this.deriveStateFromProps(props)
    }

    this.onScroll = () => {
      const y = window.pageYOffset
      const mobile = window.innerWidth < mediaQueries.mBreakPoint
      const isAwayFromBottomBar =
        !this.bottomBarY || y + window.innerHeight < this.bottomBarY
      if (this.state.isAwayFromBottomBar !== isAwayFromBottomBar) {
        this.setState({ isAwayFromBottomBar })
      }

      const headerHeight = mobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT

      if (
        isAwayFromBottomBar &&
        (
          this.state.isSeries
            ? y > headerHeight
            : y + headerHeight > this.y + this.barHeight
        )
      ) {
        if (!this.state.showSecondary) {
          this.setState({ showSecondary: true })
        }
      } else {
        if (this.state.showSecondary) {
          this.setState({ showSecondary: false })
        }
        if (this.state.secondaryNavExpanded) {
          this.setState({ secondaryNavExpanded: false })
        }
      }
    }

    this.measure = () => {
      if (!this.state.isSeries) {
        if (this.bar) {
          const rect = this.bar.getBoundingClientRect()
          this.y = window.pageYOffset + rect.top
          this.barHeight = rect.height
          this.x = window.pageXOffset + rect.left
        }
      }
      if (this.bottomBar) {
        const bottomRect = this.bottomBar.getBoundingClientRect()
        this.bottomBarY = window.pageYOffset + bottomRect.top
      }
      this.onScroll()
    }

    this.onPrimaryNavExpandedChange = expanded => {
      this.setState({
        primaryNavExpanded: expanded,
        secondaryNavExpanded: expanded ? false : this.state.secondaryNavExpanded
      })
    }

    this.onSecondaryNavExpandedChange = expanded => {
      this.setState({
        primaryNavExpanded: expanded ? false : this.state.primaryNavExpanded,
        secondaryNavExpanded: expanded
      })
    }
  }

  deriveStateFromProps ({ t, data: { article }, inNativeApp, inNativeIOSApp, router, isMember, isEditor }) {
    const meta = article && {
      ...article.meta,
      url: `${PUBLIC_BASE_URL}${article.meta.path}`,
      ...runMetaFromQuery(article.content.meta.fromQuery, router.query)
    }

    const linkedDiscussion = meta &&
      meta.linkedDiscussion &&
      !meta.linkedDiscussion.closed &&
      meta.linkedDiscussion
    const linkedDiscussionId = linkedDiscussion && linkedDiscussion.id

    const hasPdf = meta && meta.template === 'article'

    // ToDo: remove all editor guard for public launch.
    const actionBar = meta && (
      <ArticleActionBar
        t={t}
        url={meta.url}
        title={meta.title}
        discussionPage={meta && meta.template === 'discussion'}
        discussionId={linkedDiscussionId}
        discussionPath={linkedDiscussion && linkedDiscussion.path}
        dossierUrl={meta.dossier && meta.dossier.meta.path}
        onAudioClick={meta.audioSource && this.toggleAudio}
        onGalleryClick={isEditor && meta.indicateGallery && this.showGallery}
        onPdfClick={hasPdf && countImages(article.content) > 0
          ? this.togglePdf
          : undefined
        }
        pdfUrl={hasPdf
          ? getPdfUrl(meta)
          : undefined}
        inNativeApp={inNativeApp}
        documentId={article.id}
        userBookmark={article.userBookmark}
        showBookmark={isEditor && isMember}
        estimatedReadingMinutes={isEditor ? meta.estimatedReadingMinutes : undefined}
      />
    )

    const schema = meta && getSchemaCreator(meta.template)({
      t,
      titleBlockAppend: (
        <div ref={this.barRef} {...styles.bar}>
          {actionBar}
        </div>
      ),
      getVideoPlayerProps: inNativeApp && !inNativeIOSApp
        ? props => ({
          ...props,
          fullWindow: true,
          onFull: isFull => {
            postMessage({
              type: isFull
                ? 'fullscreen-enter'
                : 'fullscreen-exit'
            })
          }
        })
        : undefined
    })

    const isSeries = meta && !!meta.series

    return {
      schema,
      meta,
      actionBar,
      isSeries
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data.article !== this.props.data.article) {
      this.setState(this.deriveStateFromProps(nextProps))
    }
  }

  componentDidMount () {
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.measure)

    this.measure()

    const { query } = this.props.router
    if (query.audio === '1') {
      this.toggleAudio()
    }
  }

  componentDidUpdate () {
    this.measure()
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.measure)
  }

  render () {
    const { router, t, data, data: { article }, isMember } = this.props

    const { meta, actionBar, schema, showAudioPlayer, isAwayFromBottomBar } = this.state

    const series = meta && meta.series
    const episodes = series && series.episodes

    const seriesNavButton = series ? (
      <SeriesNavButton
        t={t}
        series={series}
        onSecondaryNavExpandedChange={this.onSecondaryNavExpandedChange}
        expanded={this.state.secondaryNavExpanded}
      />
    ) : null

    const formatMeta = meta && (
      meta.template === 'format'
        ? meta
        : meta.format && meta.format.meta
    )
    const formatColor = formatMeta && (formatMeta.color || colors[formatMeta.kind])

    const audioSource = showAudioPlayer ? meta && meta.audioSource : null

    if (router.query.extract) {
      return <Loader loading={data.loading} error={data.error} render={() => {
        if (!article) {
          return <StatusError
            statusCode={404}
            serverContext={this.props.serverContext} />
        }

        return <Extract
          ranges={router.query.extract}
          schema={schema}
          unpack={router.query.unpack}
          mdast={{
            ...article.content,
            format: meta.format
          }} />
      }} />
    }

    return (
      <Frame
        raw
        // Meta tags for a focus comment are rendered in Discussion/Commments.js
        meta={meta && meta.discussionId && router.query.focus ? undefined : meta}
        onPrimaryNavExpandedChange={this.onPrimaryNavExpandedChange}
        primaryNavExpanded={this.state.primaryNavExpanded}
        secondaryNav={(isMember && seriesNavButton) || actionBar}
        showSecondary={this.state.showSecondary}
        formatColor={formatColor}
        audioSource={audioSource}
        audioCloseHandler={this.toggleAudio}
      >
        <Loader loading={data.loading} error={data.error} render={() => {
          if (!article) {
            return <StatusError
              statusCode={404}
              serverContext={this.props.serverContext} />
          }

          const isFormat = meta.template === 'format'
          const isNewsletterSource = router.query.utm_source && router.query.utm_source === 'newsletter'
          const payNoteVariation = series
            ? 'series'
            : this.props.payNoteVariation

          const ownDiscussion = meta.ownDiscussion
          const linkedDiscussion = meta.linkedDiscussion && !meta.linkedDiscussion.closed

          return (
            <Fragment>
              {!isFormat && !isNewsletterSource && (
                <PayNote.Before
                  variation={payNoteVariation}
                  expanded={isAwayFromBottomBar} />
              )}
              {this.state.showPdf &&
                <PdfOverlay
                  article={article}
                  onClose={this.togglePdf} />}
              <ArticleGallery article={article} show={!!router.query.gallery} ref={this.galleryRef}>
                <SSRCachingBoundary cacheKey={`${article.id}${isMember ? ':isMember' : ''}`}>
                  {() => renderMdast({
                    ...article.content,
                    format: meta.format
                  }, schema)}
                </SSRCachingBoundary>
              </ArticleGallery>
              {!isFormat && (
                <PayNote.After
                  variation={payNoteVariation}
                  bottomBarRef={this.bottomBarRef} />
              )}
              {meta.template === 'article' && ownDiscussion && !ownDiscussion.closed && !linkedDiscussion && (
                <Center>
                  <AutoDiscussionTeaser
                    discussionId={ownDiscussion.id}
                  />
                </Center>
              )}
              {meta.template === 'discussion' && ownDiscussion && <Center>
                <Discussion
                  discussionId={ownDiscussion.id}
                  focusId={router.query.focus}
                  mute={!!router.query.mute}
                  meta={meta} />
              </Center>}
              {isMember && (
                <Fragment>
                  {meta.template === 'article' && <Center>
                    <div ref={this.bottomBarRef} {...styles.bar}>
                      {actionBar}
                    </div>
                  </Center>}
                </Fragment>
              )}
              {isMember && episodes && <RelatedEpisodes episodes={episodes} path={meta.path} />}
              {isFormat && <Feed formatId={article.id} />}
              {isMember && (
                <Fragment>
                  <br />
                  <br />
                  <br />
                  <br />
                </Fragment>
              )}
            </Fragment>
          )
        }} />
      </Frame>
    )
  }
}

const ComposedPage = compose(
  withT,
  withMembership,
  withEditor,
  withInNativeApp,
  withRouter,
  graphql(getDocument, {
    options: ({ router: { asPath } }) => ({
      variables: {
        path: cleanAsPath(asPath)
      }
    })
  })
)(ArticlePage)

ComposedPage.getInitialProps = () => {
  return {
    payNoteVariation: PayNote.getRandomVariation()
  }
}

export default ComposedPage

import React, { Component, Fragment } from 'react'
import { css } from 'glamor'
import Frame from '../Frame'
import ActionBar from '../ActionBar'
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

import Discussion from '../Discussion/Discussion'
import DiscussionIconLink from '../Discussion/IconLink'
import Feed from '../Feed/Format'
import StatusError from '../StatusError'
import SSRCachingBoundary from '../SSRCachingBoundary'
import withMembership from '../Auth/withMembership'
import ArticleGallery from './ArticleGallery'

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

const ArticleActionBar = ({ title, discussionId, discussionPage, discussionPath, dossierUrl, onAudioClick, onPdfClick, pdfUrl, t, url, inNativeApp }) => (
  <div>
    <ActionBar
      url={url}
      title={title}
      shareOverlayTitle={t('article/share/title')}
      fill={colors.text}
      dossierUrl={dossierUrl}
      onPdfClick={onPdfClick}
      pdfUrl={pdfUrl}
      emailSubject={t('article/share/emailSubject', {
        title
      })}
      onAudioClick={onAudioClick}
      inNativeApp={inNativeApp}
    />
    {discussionId && process.browser &&
      <DiscussionIconLink discussionId={discussionId} shouldUpdate={!discussionPage} path={discussionPath} style={{marginLeft: 7}} />
    }
  </div>
)

const getDocument = gql`
  query getDocument($path: String!) {
    article: document(path: $path) {
      id
      content
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
        discussionId
        discussion {
          meta {
            path
            discussionId
          }
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
      }
    }
  }
`

class ArticlePage extends Component {
  constructor (props) {
    super(props)

    this.barRef = ref => {
      this.bar = ref
    }

    this.bottomBarRef = ref => {
      this.bottomBar = ref
    }

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

  deriveStateFromProps ({ t, data: { article }, inNativeApp, inNativeIOSApp }) {
    const meta = article && {
      ...article.meta,
      url: `${PUBLIC_BASE_URL}${article.meta.path}`
    }

    const discussion = meta && meta.discussion
    const linkedDiscussionId = meta && (
      meta.discussionId ||
      (discussion && discussion.meta.discussionId)
    )

    const hasPdf = meta && meta.template === 'article'

    const actionBar = meta && (
      <ArticleActionBar
        t={t}
        url={meta.url}
        title={meta.title}
        discussionPage={!!meta.discussionId}
        discussionId={linkedDiscussionId}
        discussionPath={discussion && discussion.meta.path}
        dossierUrl={meta.dossier && meta.dossier.meta.path}
        onAudioClick={meta.audioSource && this.toggleAudio}
        onPdfClick={(
          hasPdf && countImages(article.content) > 0 &&
          this.togglePdf
        )}
        pdfUrl={hasPdf && getPdfUrl(meta)}
        inNativeApp={inNativeApp}
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
  }

  componentDidUpdate () {
    this.measure()
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.measure)
  }

  render () {
    const { url, t, data, data: {article}, isMember } = this.props

    const { meta, actionBar, schema, showAudioPlayer, isAwayFromBottomBar } = this.state

    const series = meta && meta.series
    const episodes = series && series.episodes

    const seriesNavButton = series ? (
      <SeriesNavButton
        t={t}
        url={url}
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

    if (url.query.extract) {
      return <Loader loading={data.loading} error={data.error} render={() => {
        if (!article) {
          return <StatusError
            url={url}
            statusCode={404}
            serverContext={this.props.serverContext} />
        }

        return <Extract
          ranges={url.query.extract}
          schema={schema}
          unpack={url.query.unpack}
          mdast={{
            ...article.content,
            format: meta.format
          }} />
      }} />
    }

    return (
      <Frame
        raw
        url={url}
        meta={meta}
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
              url={url}
              statusCode={404}
              serverContext={this.props.serverContext} />
          }

          const isFormat = meta.template === 'format'
          const isNewsletterSource = url.query.utm_source && url.query.utm_source === 'newsletter'
          const payNoteVariation = series
            ? 'series'
            : this.props.payNoteVariation

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
              <ArticleGallery article={article}>
                <SSRCachingBoundary cacheKey={article.id}>
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
              {meta.discussionId && <Center>
                <Discussion
                  discussionId={meta.discussionId}
                  focusId={url.query.focus}
                  mute={!!url.query.mute}
                  url={url} />
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
  withInNativeApp,
  graphql(getDocument, {
    options: ({url: {asPath}}) => ({
      variables: {
        path: asPath.split('?')[0]
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

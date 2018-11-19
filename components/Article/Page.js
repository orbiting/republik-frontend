import React, { Component, Fragment } from 'react'
import { css } from 'glamor'
import { withRouter } from 'next/router'
import Frame from '../Frame'
import ActionBar from '../ActionBar'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Loader from '../Loader'
import RelatedEpisodes from './RelatedEpisodes'
import SeriesNavButton from './SeriesNavButton'
import * as PayNote from './PayNote'
import ProgressNote from './ProgressNote'
import PdfOverlay, { getPdfUrl, countImages } from './PdfOverlay'
import Extract from './Extract'
import withT from '../../lib/withT'
import withInNativeApp, { postMessage } from '../../lib/withInNativeApp'
import { cleanAsPath } from '../../lib/routes'

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

import debounce from 'lodash.debounce'

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
      <DiscussionIconLink
        discussionId={discussionId}
        discussionPage={discussionPage}
        path={discussionPath}
        style={{ marginLeft: 7 }} />
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

    this.containerRef = ref => {
      this.container = ref
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
      showProgressPrompt: false,
      trackProgress: false,
      progressElements: [],
      progressElementIndex: 0,
      mobile: true,
      ...this.deriveStateFromProps(props)
    }

    this.headerHeight = () => window.innerWidth < mediaQueries.mBreakPoint ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT

    this.onScroll = () => {
      const y = window.pageYOffset
      // const mobile = window.innerWidth < mediaQueries.mBreakPoint

      const isAwayFromBottomBar =
        !this.bottomBarY || y + window.innerHeight < this.bottomBarY
      if (this.state.isAwayFromBottomBar !== isAwayFromBottomBar) {
        this.setState({ isAwayFromBottomBar })
      }

      const headerHeight = this.state.mobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT

      // const progress = y / this.containerHeight
      // console.log(progress, this.containerHeight)

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
      /* if (y !== this.state.pageYOffset) {
        this.setState({ pageYOffset: y }, this.saveProgress)
      } */
      if (y !== this.state.pageYOffset) {
        this.saveProgress()
      }
    }

    this.measure = () => {
      const mobile = window.innerWidth < mediaQueries.mBreakPoint
      if (mobile !== this.state.mobile) {
        this.setState({ mobile })
      }
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
      if (this.container) {
        /* const containerRect = this.container.getBoundingClientRect()
        this.containerY = window.pageYOffset + containerRect.top
        this.containerHeight = containerRect.height */
        const { width, height } = this.container.getBoundingClientRect()
        const cleanWidth = Math.min(width, 695)
        if (cleanWidth !== this.state.width || height !== this.state.height) {
          this.setState({ width: cleanWidth, height }, undefined /* this.restore */)
        }
      }
      // this.onScroll()
    }

    this.measureProgress = (downwards = true) => {
      const progressElements = this.getProgressElements()
      const progressElementIndex = this.state.progressElementIndex || 0
      if (!progressElements) {
        console.log('empty')
        return
      }
      const mobile = window.innerWidth < mediaQueries.mBreakPoint
      const headerHeight = mobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT

      let progressElement, nextIndex
      if (downwards) {
        console.log('search downwards...', progressElementIndex, progressElements.length)
        for (let i = progressElementIndex; i < progressElements.length; i++) {
          progressElement = progressElements[i]
          console.log(progressElement, i)
          const { top } = progressElement.getBoundingClientRect()
          if (top > headerHeight) {
            console.log('found downwards', progressElement)
            nextIndex = i
            break
          }
        }
      } else {
        console.log('search upwards...', progressElementIndex, progressElements.length)
        for (let i = progressElementIndex; i > -1; i--) {
          progressElement = progressElements[i]
          console.log(progressElement, i)
          const { top } = progressElement.getBoundingClientRect()
          if (top < headerHeight) {
            console.log('found upwards', progressElements[i + 1])
            progressElement = progressElements[i + 1]
            nextIndex = i + 1
            break
          } else {
            progressElement = undefined
          }
        }
      }
      this.setState({
        progressElement,
        progressElementIndex: nextIndex
      })
    }

    this.getProgressElements = () => {
      if (this.state.progressElements && this.state.progressElements.length > 0) {
        return this.state.progressElements
      }
      const progressElements = [...(this.container.getElementsByClassName('pos'))]
      this.setState({ progressElements })
    }

    this.handleLoad = () => {
      console.log('load')
      this.measure()
      const progressElements = this.getProgressElements()
      console.log(this.container, progressElements)
      // this.setState({progressElements: [...progressElements]})

      // this.restore()
      // this.measureProgress(true)
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

  getProgress = () => {
    const percent = this.state.pageYOffset / this.state.height
    const { progressElement } = this.state
    return JSON.stringify({
      percent,
      id: progressElement && progressElement.id
    })
  }

  saveProgress = debounce(() => {
    console.log('scroll END')
    const y = window.pageYOffset
    const downwards = y > this.state.pageYOffset

    if (y !== this.state.pageYOffset) {
      console.log('downwards', downwards)
      this.setState({ pageYOffset: y })
      this.measureProgress(downwards)
    }

    window.localStorage.setItem('progress', this.getProgress())
  }, 300)

  restore = () => {
    console.log('restore')
    const progress = JSON.parse(window.localStorage.getItem('progress') || {})
    console.log(progress)
    const { percent, id } = progress
    const { mobile } = this.state
    const progressElements = this.getProgressElements()
    let foundIndex
    const progressElement = progressElements.find((element, index) => {
      foundIndex = index
      return element.id === id
    })
    console.log(percent, id, foundIndex)
    if (progressElement) {
      this.setState({
        progressElement: progressElement,
        progressElementIndex: foundIndex
      })
      const { top } = progressElement.getBoundingClientRect()
      console.log('restored', top)
      window.scrollTo(0, top - HEADER_HEIGHT - (mobile ? 20 : 50))
      return
    }
    if (percent) {
      const offset = (percent * this.state.height) + HEADER_HEIGHT
      window.scrollTo(0, offset)
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
        onPdfClick={hasPdf && countImages(article.content) > 0
          ? this.togglePdf
          : undefined
        }
        pdfUrl={hasPdf
          ? getPdfUrl(meta)
          : undefined}
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

    const progress = typeof window !== 'undefined' && article ? JSON.parse(window.localStorage.getItem('progress')) : {}
    const { id, percent } = progress
    const showProgressPrompt = !!id || !!percent

    return {
      schema,
      meta,
      actionBar,
      isSeries,
      showProgressPrompt
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data.article !== this.props.data.article) {
      this.setState(this.deriveStateFromProps(nextProps))
    }
  }

  componentDidMount () {
    console.log('mount')
    window.addEventListener('load', this.handleLoad)
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.measure)

    // setTimeout(this.restore, 500)

    this.measure()
  }

  componentDidUpdate () {
    console.log('update')
    this.measure()
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.measure)
  }

  render () {
    const { router, t, data, data: { article }, isMember } = this.props

    const { meta, actionBar, schema, showAudioPlayer, isAwayFromBottomBar, width,
      height,
      pageYOffset,
      showProgressPrompt } = this.state

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

          return (
            <Fragment>
              {showProgressPrompt && (
                <ProgressNote onClick={() => {
                  console.log('clicked')
                  this.restore()
                  this.setState({ showProgressPrompt: false })
                }} />
              )}
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
                <div ref={this.containerRef}>
                  <SSRCachingBoundary cacheKey={`${article.id}${isMember ? ':isMember' : ''}`}>
                    {() => renderMdast({
                      ...article.content,
                      format: meta.format
                    }, schema)}
                  </SSRCachingBoundary>
                </div>
              </ArticleGallery>
              {!isFormat && (
                <PayNote.After
                  variation={payNoteVariation}
                  bottomBarRef={this.bottomBarRef} />
              )}
              {meta.discussionId && <Center>
                <Discussion
                  discussionId={meta.discussionId}
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
              <div style={{ position: 'fixed', bottom: 0, color: '#fff', left: 0, right: 0, background: '#666', padding: 10 }}>
                <p>width: {width} – pageYOffset: {pageYOffset} - Product {width * pageYOffset} - total: {width * height} - Percent {(width * pageYOffset) / (width * height)}</p>
              </div>
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

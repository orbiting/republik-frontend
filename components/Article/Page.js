import React, { Component, Fragment } from 'react'
import { css } from 'glamor'
import Frame from '../Frame'
import ShareButtons from '../Share'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Loader from '../Loader'
import RelatedEpisodes from './RelatedEpisodes'
import SeriesNavButton from './SeriesNavButton'
import * as PayNote from './PayNote'
import withT from '../../lib/withT'

import Discussion from '../Discussion/Discussion'
import DiscussionIconLink from '../Discussion/IconLink'
import Feed from '../Feed/Format'
import StatusError from '../StatusError'

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
import createDiscussionSchema from '@project-r/styleguide/lib/templates/Discussion'
import createNewsletterSchema from '@project-r/styleguide/lib/templates/EditorialNewsletter/web'

const schemaCreators = {
  editorial: createArticleSchema,
  meta: createArticleSchema,
  article: createArticleSchema,
  format: createFormatSchema,
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

const ActionBar = ({ title, discussionId, discussionPage, discussionPath, t, url }) => (
  <div>
    <ShareButtons
      url={url}
      fill={colors.text}
      // dossierUrl={'/foo'}
      emailSubject={t('article/share/emailSubject', {
        title
      })}
    />
    {discussionId &&
      <DiscussionIconLink discussionId={discussionId} shouldUpdate={!discussionPage} path={discussionPath} />
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

    this.state = {
      primaryNavExpanded: false,
      secondaryNavExpanded: false,
      showSecondary: false,
      ...this.deriveStateFromProps(props)
    }

    this.onScroll = () => {
      const y = window.pageYOffset
      const mobile = window.innerWidth < mediaQueries.mBreakPoint
      const isAwayFromBottomBar =
        !this.bottomBarY || y + window.innerHeight < this.bottomBarY

      if (
        isAwayFromBottomBar &&
        ((this.state.isSeries &&
          y > (mobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT)) ||
          (!this.state.isSeries &&
            y + (mobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT) >
              this.y + this.barHeight))
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

  deriveStateFromProps ({ t, data: { article } }) {
    const meta = article && {
      ...article.meta,
      url: `${PUBLIC_BASE_URL}${article.meta.path}`
    }

    const discussion = meta && meta.discussion
    const linkedDiscussionId = meta && (
      meta.discussionId ||
      (discussion && discussion.meta.discussionId)
    )

    const actionBar = meta && (
      <ActionBar t={t}
        url={meta.url}
        title={meta.title}
        discussionPage={!!meta.discussionId}
        discussionId={linkedDiscussionId}
        discussionPath={discussion && discussion.meta.path} />
    )

    const schema = meta && getSchemaCreator(meta.template)({
      t,
      titleBlockAppend: (
        <div ref={this.barRef} {...styles.bar}>
          {actionBar}
        </div>
      )
    })

    const isSeries = (
      meta &&
      meta.series &&
      meta.series.episodes &&
      !!meta.series.episodes.length
    )

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
    const { url, t, data, data: {article} } = this.props

    const { meta, actionBar, schema } = this.state

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
    const formatColor = formatMeta && formatMeta.color

    return (
      <Frame
        raw
        url={url}
        meta={meta}
        onPrimaryNavExpandedChange={this.onPrimaryNavExpandedChange}
        primaryNavExpanded={this.state.primaryNavExpanded}
        secondaryNav={seriesNavButton || actionBar}
        showSecondary={this.state.showSecondary}
        formatColor={formatColor}
      >
        <Loader loading={data.loading} error={data.error} render={() => {
          if (!article) {
            return <StatusError
              url={url}
              statusCode={404}
              serverContext={this.props.serverContext} />
          }

          const isFormat = meta.template === 'format'

          return (
            <Fragment>
              {!isFormat && <PayNote.Before />}
              {renderMdast({
                ...article.content,
                format: meta.format
              }, schema)}
              {meta.template === 'article' && <Center>
                <div ref={this.bottomBarRef} {...styles.bar}>
                  {actionBar}
                </div>
              </Center>}
              {meta.discussionId && <Center>
                <Discussion
                  discussionId={meta.discussionId}
                  focusId={url.query.focus} />
              </Center>}
              {episodes && <RelatedEpisodes episodes={episodes} path={meta.path} />}
              {isFormat && <Feed formatId={article.id} />}
              <br />
              <br />
              <br />
              <br />
              {!isFormat && <PayNote.After />}
            </Fragment>
          )
        }} />
      </Frame>
    )
  }
}

export default compose(
  withT,
  graphql(getDocument, {
    options: ({url: {asPath}}) => ({
      variables: {
        path: asPath.split('?')[0]
      }
    })
  })
)(ArticlePage)

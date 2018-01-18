import React, { Component, Fragment } from 'react'
import { css } from 'glamor'
import Frame from '../Frame'
import ShareButtons from '../Share'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Loader from '../Loader'
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
            document {
              meta {
                title
                publishDate
                path
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
    const { data } = props
    this.state = {
      primaryNavExpanded: false,
      secondaryNavExpanded: false,
      showSecondary: false,
      isSeries: data &&
        data.article &&
        data.article.meta &&
        data.article.meta.series &&
        !!data.article.meta.series.length
    }

    this.onScroll = () => {
      const y = window.pageYOffset
      const mobile = window.innerWidth < mediaQueries.mBreakPoint

      if (
        (this.state.isSeries && y > HEADER_HEIGHT) ||
        (!this.state.isSeries &&
          y + (mobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT) >
            this.y + this.barHeight)
      ) {
        if (!this.state.showSecondary) {
          this.setState({ showSecondary: true })
        }
      } else {
        if (this.state.showSecondary) {
          this.setState({ showSecondary: false })
        }
      }
    }
    this.barRef = ref => {
      this.bar = ref
    }
    this.measure = () => {
      if (!this.state.isSeries && this.bar) {
        const rect = this.bar.getBoundingClientRect()
        this.y = window.pageYOffset + rect.top
        this.barHeight = rect.height
        this.x = window.pageXOffset + rect.left
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

    const { primaryNavExpanded, secondaryNavExpanded } = this.state

    const meta = article && {
      ...article.meta,
      url: `${PUBLIC_BASE_URL}${article.meta.path}`
    }

    const discussion = meta && meta.discussion
    const linkedDiscussionId = meta && (
      meta.discussionId ||
      (discussion && discussion.meta.discussionId)
    )

    const series = meta && meta.series
    console.log(meta.path, series)

    const actionBar = meta && (
      <ActionBar t={t}
        url={meta.url}
        title={meta.title}
        discussionPage={!!meta.discussionId}
        discussionId={linkedDiscussionId}
        discussionPath={discussion && discussion.meta.path} />
    )

    const seriesNavButton = series ? (
      <SeriesNavButton
        t={t}
        url={url}
        series={series}
        onSecondaryNavExpandedChange={this.onSecondaryNavExpandedChange}
        expanded={this.state.secondaryNavExpanded}
      />
    ) : null

    return (
      <Frame
        raw
        url={url}
        meta={meta}
        onPrimaryNavExpandedChange={this.onPrimaryNavExpandedChange}
        primaryNavExpanded={this.state.primaryNavExpanded}
        secondaryNav={seriesNavButton || actionBar}
        showSecondary={this.state.showSecondary}
      >
        <Loader loading={data.loading} error={data.error} render={() => {
          if (!article) {
            return <StatusError
              url={url}
              statusCode={404}
              serverContext={this.props.serverContext} />
          }

          const schema = getSchemaCreator(article.meta.template)({
            t,
            titleBlockAppend: (
              <div ref={this.barRef} {...styles.bar}>
                {actionBar}
              </div>
            )
          })

          const isFormat = meta.template === 'format'

          return (
            <Fragment>
              {!isFormat && <PayNote.Before />}
              {renderMdast({
                ...article.content,
                format: meta.format
              }, schema)}
              {meta.discussionId && <Center>
                <Discussion
                  discussionId={meta.discussionId}
                  focusId={url.query.focus} />
              </Center>}
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

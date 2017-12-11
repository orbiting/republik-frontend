import React, { Component, Fragment } from 'react'
import { css } from 'glamor'
import Frame from '../Frame'
import ShareButtons from '../Share'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Loader from '../Loader'
import * as PayNote from './PayNote'
import withT from '../../lib/withT'

import {
  H1,
  colors,
  mediaQueries,
  NarrowContainer
} from '@project-r/styleguide'

import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'
import { PUBLIC_BASE_URL } from '../../lib/constants'

import { renderMdast } from 'mdast-react-render'

import createArticleSchema from '@project-r/styleguide/lib/templates/Article'

const schemaCreators = {
  editorial: createArticleSchema,
  meta: createArticleSchema,
  article: createArticleSchema
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

const ActionBar = ({ title, t, url }) => (
  <div>
    <ShareButtons
      url={url}
      fill={colors.text}
      // dossierUrl={'/foo'}
      // discussionUrl={'/foo'}
      // discussionCount={0}
      emailSubject={t('article/share/emailSubject', {
        title
      })}
    />
  </div>
)

const getDocument = gql`
  query getDocument($slug: String!) {
    article: document(slug: $slug) {
      content
      meta {
        template
        slug
        title
        description
        image
        facebookDescription
        facebookImage
        facebookTitle
        twitterDescription
        twitterImage
        twitterTitle
      }
    }
  }
`

class ArticlePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showSecondary: false
    }

    this.onScroll = () => {
      const y = window.pageYOffset
      const mobile = window.innerWidth < mediaQueries.mBreakPoint

      if (
        y + (mobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT) >
        this.y + this.barHeight
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
      if (this.bar) {
        const rect = this.bar.getBoundingClientRect()
        this.y = window.pageYOffset + rect.top
        this.barHeight = rect.height
        this.x = window.pageXOffset + rect.left
      }
      this.onScroll()
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

    const meta = article && {
      ...article.meta,
      url: `${PUBLIC_BASE_URL}/${article.meta.slug}`
    }

    return (
      <Frame
        raw
        url={url}
        meta={meta}
        secondaryNav={meta ? <ActionBar t={t} url={meta.url} title={meta.title} /> : null}
        showSecondary={this.state.showSecondary}
      >
        <Loader loading={data.loading} error={data.error} render={() => {
          if (!article) {
            return <NarrowContainer><H1>404</H1></NarrowContainer>
          }

          const schema = getSchemaCreator(article.meta.template)({
            titleBlockAppend: (
              <div ref={this.barRef} {...styles.bar}>
                <ActionBar t={t} url={meta.url} title={meta.title} />
              </div>
            )
          })

          return (
            <Fragment>
              <PayNote.Before />
              {renderMdast(article.content, schema)}
              <br />
              <br />
              <br />
              <br />
              <PayNote.After />
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
    options: ({url: {query}}) => ({
      variables: {
        slug: [
          query.year,
          query.month,
          query.day,
          query.slug
        ].filter(Boolean).join('/')
      }
    }),
    props: ({data, ownProps: {serverContext}}) => {
      if (serverContext && !data.error && !data.loading && !data.article) {
        serverContext.res.statusCode = 404
      }

      return {
        data
      }
    }
  })
)(ArticlePage)

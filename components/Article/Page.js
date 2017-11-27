import React, { Component } from 'react'
import { css } from 'glamor'
import Frame from '../Frame'
import ShareButtons from '../Share'
import { gql, graphql } from 'react-apollo'
import { compose } from 'redux'
import Loader from '../Loader'

import {
  H1,
  colors,
  mediaQueries,
  NarrowContainer
} from '@project-r/styleguide'

import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'
import { PUBLIC_BASE_URL } from '../../lib/constants'

import { renderMdast } from 'mdast-react-render'
import editorialSchema from '@project-r/styleguide/lib/templates/Editorial'

const styles = {
  bar: css({
    display: 'inline-block',
    marginTop: '15px',
    [mediaQueries.mUp]: {
      marginTop: '20px'
    }
  })
}

const ActionBar = props => (
  <div>
    <ShareButtons
      {...props}
      fill={colors.text}
      dossierUrl={'/foo'}
      discussionUrl={'/foo'}
      discussionCount={0}
      emailSubject={'Foo'}
    />
  </div>
)

const getDocument = gql`
  query getDocument($slug: String!) {
    article: document(slug: $slug) {
      content
      meta {
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
    const { url, data, data: {article} } = this.props

    const meta = article && {
      ...article.meta,
      url: `${PUBLIC_BASE_URL}/${article.meta.slug}`
    }

    return (
      <Frame
        raw
        url={url}
        meta={meta}
        secondaryNav={meta ? <ActionBar url={meta.url} /> : null}
        showSecondary={this.state.showSecondary}
      >
        <Loader loading={data.loading} error={data.error} render={() => {
          if (!article) {
            return <NarrowContainer><H1>404</H1></NarrowContainer>
          }

          // tmp hack to injection action bar
          const schemaWithActionBar = {
            ...editorialSchema,
            rules: editorialSchema.rules.map(rootRule => ({
              ...rootRule,
              rules: rootRule.rules.map(rule => {
                if (rule.matchMdast({type: 'zone', identifier: 'TITLE'})) {
                  return {
                    ...rule,
                    component: ({children, ...props}) => (
                      <rule.component {...props}>
                        {children}
                        <div ref={this.barRef} {...styles.bar}>
                          <ActionBar url={meta.url} />
                        </div>
                      </rule.component>
                    )
                  }
                }
                return rule
              })
            }))
          }

          return renderMdast(article.content, schemaWithActionBar)
        }} />
      </Frame>
    )
  }
}

export default compose(
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

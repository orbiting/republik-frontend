import React, { Component } from 'react'
import gql from 'graphql-tag'
import { compose, graphql, withApollo } from 'react-apollo'
import Close from 'react-icons/lib/md/close'
import { css } from 'glamor'

import {
  colors,
  NarrowContainer,
  FigureCaption,
  FigureImage,
  Interaction,
  mediaQueries,
  RawHtml,
  TextInput,
  fontStyles,
  Autocomplete
} from '@project-r/styleguide'

import { questionStyles } from './questionStyles'
const { H2, H3, P, A } = Interaction

const renderCredits = (node) => {
  if (node.type === 'text') {
    return node.value
  } else {
    if (node.children) {
      return node.children.map(renderCredits)
    }
  }
}

const ArticleItem = ({ title, credits }) =>
  <div>
    <H3>{title}</H3>
    <P>{credits && credits.map(renderCredits).join(' ')}</P>
  </div>

class ArticleQuestion extends Component {
  constructor (props) {
    super(props)
    this.state = {
      filter: '',
      items: [],
      ...this.deriveStateFromProps(props)
    }
  }

  deriveStateFromProps (props) {
    return { value: props.question.userAnswer ? props.question.userAnswer.payload : null }
  }

  handleChange = (value) => {
    const { onChange } = this.props
    if (!value) {
      this.setState({ value: null, document: null }, () => onChange(null))
    } else {
      this.setState({ value }, () => onChange(value.value))
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.question.userAnswer &&
      nextProps.question.userAnswer !== this.props.question.userAnswer) {
      this.setState(this.deriveStateFromProps(nextProps))
    }
  }

  renderSelectedItem = () => {
    const { value: { document } } = this.state
    return (
      <div {...css({
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        background: colors.primaryBg
      })}>
        <ArticleItem title={document.title}
          credits={document.credits} />
        <div
          {...css({
            width: 24
          })}
          onClick={() => this.handleChange(null)}><Close size={24} /></div>
      </div>
    )
  }

  performSearch = async (search) => {
    const { client } = this.props
    const res = await client.query({
      query,
      variables: {
        search,
        'sort': {
          'key': 'relevance'
        },
        filters: [
          {
            'key': 'template',
            'value': 'article'
          },
          {
            'key': 'template',
            'value': 'front',
            'not': true
          }
        ]
      }
    })
    const items = res.data ? res.data.search.nodes
      .filter(n => n.entity)
      .map(n => ({
        document: {
          title: n.entity.meta.title,
          credit: n.entity.meta.credits
        },
        text: <ArticleItem title={n.entity.meta.title}
          credits={(n.entity.meta.credits || [])} />,
        value: n.entity.meta.path
      })) : []
    this.setState({ items })
  }

  render () {
    const { question: { text } } = this.props
    const { value, items } = this.state
    return (
      <div>
        { text &&
          <H2 {...questionStyles.label}>{text}</H2>
        }
        <div {...questionStyles.body}>
          {
            value ? (
              this.renderSelectedItem()
            ) : (
              <Autocomplete
                items={items}
                value={value}
                onChange={value => this.handleChange(value)}
                onFilterChange={filter => this.setState({ filter }, () => this.performSearch(filter))}
              />
            )
          }
        </div>
      </div>
    )
  }
}

const query = gql`
query getSearchResults($search: String, $after: String, $sort: SearchSortInput, $filters: [SearchGenericFilterInput!], $trackingId: ID) {
  search(first: 5, after: $after, search: $search, sort: $sort, filters: $filters, trackingId: $trackingId) {
    nodes {
      entity {
        __typename
        ... on Document {
          meta {
            title
            path
            credits
          }
        }
      }
    }
  }
}
`

export default compose(
  withApollo
//  graphql()
)(ArticleQuestion)

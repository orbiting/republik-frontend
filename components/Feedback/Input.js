import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import debounce from 'lodash.debounce'
import gql from 'graphql-tag'
import { compose, withApollo } from 'react-apollo'
import withT from '../../lib/withT'

import Close from 'react-icons/lib/md/close'
import Search from 'react-icons/lib/md/search'

import ArticleItem from './ArticleItem'

import {
  Autocomplete,
  Interaction,
  Spinner,
  colors,
  fontStyles,
  mediaQueries
} from '@project-r/styleguide'

const styles = {
  button: css({
    outline: 'none',
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 'none',
    padding: '0',
    cursor: 'pointer'
  }),
  previewTitle: css({
    // ...fontStyles.sansSerifMedium22,
    // lineHeight: '24px'
  }),
  previewCredits: css({
    ...fontStyles.sansSerifRegular14,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular16
    }
  }),
  noResults: css({
    color: colors.disabled
  })
}

const { P } = Interaction

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
            ownDiscussion {
              id
              closed
            }
            linkedDiscussion {
              id
              path
              closed
            }
          }
        }
      }
    }
  }
}
`

const NoResultsItem = ({ title }) =>
  <div>
    <P {...styles.noResults}>{title}</P>
  </div>

const Icon = ({ IconComponent, onClick, title, fill }) => (
  <button
    title={title}
    {...styles.button}
    onClick={onClick ? e => {
      e.preventDefault()
      e.stopPropagation()
      onClick()
    } : undefined}
  >
    <IconComponent fill={fill} size={30} />
  </button>
)

class Input extends Component {
  constructor (props, ...args) {
    super(props, ...args)

    this.state = {
      filter: '',
      items: [],
      loading: false
      // filter: '',
      /* items: [
        {text: 'Januar', value: '01'},
        {text: 'Februar', value: '02'},
        {text: 'März', value: '03'},
        {text: 'April', value: '04'},
        {text: 'Mai', value: '05'},
        {text: 'Juni', value: '06'},
        {text: 'Juli', value: '07'},
        {text: 'August', value: '08'},
        {text: 'September', value: '09'},
        {text: 'Oktober', value: '10'},
        {text: 'November', value: '10'},
        {text: 'Dezember', value: '10'}
      ] */
    }

    this.setFocusRef = ref => {
      this.focusRef = ref
    }
  }

  onChange = (value) => {
    // const { onChange } = this.props
    if (!value) {
      this.setState({ value: null, document: {} }, () => { console.log('no value') })
    } else {
      this.setState({ ...value }, () => { console.log('value:', value) })
    }
  }

  onFilterChange = (filter) => {
    this.performSearch.cancel()
    if (filter.length < 3) {
      this.setState({ filter, items: [] })
    } else {
      this.setState({ filter }, () => this.performSearch(filter))
    }
  }

  performSearch = debounce((search) => {
    this.setState({ loading: true })
    const { client } = this.props
    client.query({
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
    }).then(res => {
      const filteredNodes = res.data && res.data.search.nodes
        .filter(n => n.entity &&
          n.entity.meta &&
          (
            (n.entity.meta.ownDiscussion && !n.entity.meta.ownDiscussion.closed) ||
            (n.entity.meta.linkedDiscussion && !n.entity.meta.linkedDiscussion.closed)))
      console.log(filteredNodes)
      const items = filteredNodes.length
        ? filteredNodes.map(n => ({
          document: {
            title: n.entity.meta.title,
            credits: n.entity.meta.credits
          },
          text: <ArticleItem
            title={n.entity.meta.title}
            newPage={n.entity.meta.linkedDiscussion && !n.entity.meta.linkedDiscussion.closed} />,
          value: n // n.entity.meta.path
        })) : [{
          document: {
          },
          text: <NoResultsItem title={'Keine Diskussion gefunden'} />,
          value: 'none'
        }]
      this.setState({ items, loading: false })
    })
  }, 200)

  updateFocus () {
    if (this.focusRef && this.focusRef.input) {
      if (this.props.allowFocus) {
        this.focusRef.input.focus()
      } else {
        this.focusRef.input.blur()
      }
    }
  }

  componentDidMount () {
    this.updateFocus()
  }

  componentDidUpdate () {
    this.updateFocus()
  }

  render () {
    const { t, onReset } = this.props
    const { value, filter, items, loading } = this.state

    return (
      <div>
        <Autocomplete
          label={t('search/input/label')}
          value={value}
          onChange={this.onChange}
          onFilterChange={this.onFilterChange}
          items={items}
          icon={
            loading ? (
              <div style={{ height: 30, width: 30, position: 'relative' }}>
                <Spinner size={30} />
              </div>
            )
              : value && filter ? (
                <Icon
                  IconComponent={Close}
                  fill={filter ? colors.text : colors.disabled}
                  onClick={onReset}
                  title={t('search/input/reset/aria')}
                />
              ) : (
                <Icon
                  IconComponent={Search}
                  fill={filter ? colors.text : colors.disabled}
                />
              )
          }
        />
      </div>
    )
  }
}

Input.propTypes = {
  t: PropTypes.func,
  value: PropTypes.object,
  allowSearch: PropTypes.bool,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  onReset: PropTypes.func
}

export default compose(
  withT,
  withApollo
)(Input)

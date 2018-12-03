import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import debounce from 'lodash.debounce'
import { compose, withApollo } from 'react-apollo'
import withT from '../../lib/withT'

import Close from 'react-icons/lib/md/close'
import Search from 'react-icons/lib/md/search'

import ArticleItem, { NoResultsItem } from './ArticleItem'
import { getArticleSearchResults } from './enhancers'

import {
  Autocomplete,
  Spinner,
  colors
} from '@project-r/styleguide'

const styles = {
  button: css({
    outline: 'none',
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 'none',
    padding: '0',
    cursor: 'pointer'
  })
}

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

class ArticleSearch extends Component {
  constructor (props, ...args) {
    super(props, ...args)

    this.state = {
      filter: '',
      items: [],
      loading: false
    }

    this.onReset = () => {
      this.setState({ filter: '', value: null, isOpen: false, items: [] })
      const { onReset } = this.props
      onReset && onReset()
    }
  }

  onChange = (value) => {
    const { onChange } = this.props
    if (!value) {
      this.setState({ value: null, meta: {} }, () => { onChange && onChange(null) })
    } else {
      this.setState({ ...value }, () => { onChange && onChange(value) })
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
      query: getArticleSearchResults,
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
      const filteredNodes =
        res.data &&
        res.data.search.nodes.filter(n => {
          const meta = n.entity && n.entity.meta
          return (
            meta &&
            ((meta.ownDiscussion && !meta.ownDiscussion.closed) ||
              (meta.linkedDiscussion && !meta.linkedDiscussion.closed))
          )
        })
      const items = filteredNodes.length
        ? filteredNodes.map(n => {
          const meta = n.entity && n.entity.meta
          const linkedDiscussion =
              meta &&
              meta.linkedDiscussion &&
              !meta.linkedDiscussion.closed &&
              meta.linkedDiscussion
          const discussionId =
              meta &&
              ((meta.ownDiscussion &&
                !meta.ownDiscussion.closed &&
                meta.ownDiscussion.id) ||
                (linkedDiscussion && linkedDiscussion.id))

          return {
            discussionId,
            routePath: linkedDiscussion && linkedDiscussion.path,
            meta: {
              title: meta.title,
              credits: meta.credits,
              path: meta.path
            },
            text: <ArticleItem
              title={meta.title}
              newPage={!!linkedDiscussion} />,
            value: discussionId // n.entity.meta.path
          }
        }) : [{
          discussionId: null,
          text: <NoResultsItem title={'Keine Diskussion gefunden'} />,
          value: 'none'
        }]
      this.setState({ items, loading: false })
    })
  }, 200)

  render () {
    const { t } = this.props
    const { value, filter, items, loading, isOpen } = this.state

    return (
      <div>
        <Autocomplete
          label={t('search/input/label')}
          value={value}
          filter={filter}
          isOpen={isOpen !== undefined ? isOpen : undefined}
          onChange={this.onChange}
          onFilterChange={this.onFilterChange}
          items={items}
          icon={
            loading ? (
              <div style={{ height: 30, width: 30, position: 'relative' }}>
                <Spinner size={30} />
              </div>
            )
              : filter ? (
                <Icon
                  IconComponent={Close}
                  fill={filter ? colors.text : colors.disabled}
                  onClick={this.onReset}
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

ArticleSearch.propTypes = {
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
)(ArticleSearch)

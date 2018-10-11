import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css, merge } from 'glamor'
import { max } from 'd3-array'

import Meta from '../Frame/Meta'

import { Router } from '../../lib/routes'
import withT from '../../lib/withT'
import Loader from '../Loader'

import Detail from './Detail'

import Play from '../Icons/Play'

import {
  PUBLIC_BASE_URL, CDN_FRONTEND_BASE_URL, ASSETS_SERVER_BASE_URL
} from '../../lib/constants'

import {
  Interaction, mediaQueries, fontFamilies,
  Field, A
} from '@project-r/styleguide'

const { P } = Interaction

const SIZES = [
  { minWidth: 0, columns: 1 },
  { minWidth: 200, columns: 2 },
  { minWidth: 400, columns: 3 },
  { minWidth: 600, columns: 4 },
  { minWidth: 880, columns: 5 }
]

const PADDING = 5

const getItemStyles = (singleRow, minColumns = 1) => {
  const sizes = [
    { minWidth: 0, columns: minColumns },
    ...SIZES.filter(({ minWidth, columns }) => columns > minColumns)
  ]
  return css({
    cursor: 'pointer',
    display: 'block',
    lineHeight: 0,
    padding: PADDING,
    position: 'relative',
    flexShrink: singleRow ? 0 : undefined,
    ...sizes.reduce((styles, size) => {
      const width = `${100 / size.columns}%`
      if (size.minWidth) {
        styles[`@media only screen and (min-width: ${size.minWidth}px)`] = {
          width
        }
      } else {
        styles.width = width
      }
      return styles
    }, {})
  })
}

const styles = {
  grid: css({
    margin: '0 -5px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  }),
  singleRowGrid: css({
    flexWrap: 'nowrap',
    overflow: 'hidden'
  }),
  item: getItemStyles(false),
  singleRowItem: getItemStyles(true),
  aspect: css({
    width: '100%',
    paddingBottom: '100%',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#ccc',
    '& > *': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%'
    }
  }),
  itemArrow: css({
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -12.5,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: '0 12.5px 17px 12.5px',
    borderColor: 'transparent transparent #ffffff transparent'
  }),
  name: css({
    position: 'absolute',
    bottom: PADDING + 5,
    left: PADDING + 5,
    right: PADDING + 5,
    fontSize: 12,
    lineHeight: '15px',
    [mediaQueries.mUp]: {
      fontSize: 16,
      lineHeight: '21px'
    },
    color: '#fff',
    fontFamily: fontFamilies.sansSerifMedium
  }),
  play: css({
    position: 'absolute',
    right: PADDING + 5,
    top: PADDING + 5
  }),
  options: css({
    marginBottom: 15
  })
}

export const Item = ({ image, name, video, isActive, onClick, imageRenderer, singleRow, minColumns, style }) => {
  const itemStyles = minColumns
    ? getItemStyles(singleRow, minColumns)
    : singleRow
      ? styles.singleRowItem
      : styles.item
  return (
    <div {...itemStyles} style={style} onClick={onClick}>
      <div {...styles.aspect}>
        {imageRenderer ? imageRenderer() : <img src={image} />}
      </div>
      {!!video && <div {...styles.play}><Play /></div>}
      {!isActive && <div {...styles.name}>{name}</div>}
      {isActive && <div {...styles.itemArrow} />}
    </div>
  )
}

const AUTO_INFINITE = 300

class List extends Component {
  constructor (props) {
    super(props)
    this.state = {
      seed: props.seed || generateSeed(),
      columns: 3,
      open: {
        0: props.focus
      }
    }
    this.measure = () => {
      const sizeIndex = max(SIZES, (d, i) => (
        d.minWidth <= window.innerWidth ? i : -1
      ))
      const size = SIZES[sizeIndex]
      const columns = size.columns
      if (columns !== this.state.columns && this.props.statements) {
        this.setState(() => ({
          columns,
          open: {
            0: this.props.focus && this.props.statements[0].id
          }
        }))
      }
      this.onScroll()
    }
    this.ref = ref => { this.container = ref }
    this.onScroll = () => {
      const { statements, isPage, hasMore } = this.props

      if (this.container && isPage && statements) {
        const bbox = this.container.getBoundingClientRect()
        if (bbox.bottom < window.innerHeight * 2) {
          const { isFetchingMore, endless } = this.state
          if (
            isFetchingMore || !hasMore ||
            (statements.length >= AUTO_INFINITE && !endless)
          ) {
            return
          }
          this.setState(() => ({
            isFetchingMore: true
          }), () => {
            const query = this.query = [
              this.props.seed,
              this.props.focus,
              this.props.query
            ].join('_')
            this.props.loadMore().then(({ data }) => {
              if (query !== this.query) {
                this.setState(() => ({
                  isFetchingMore: false
                }), () => {
                  this.onScroll()
                })
                return
              }
              this.setState(() => ({
                isFetchingMore: false
              }))
            })
          })
        }
      }
    }
  }
  componentDidMount () {
    this.props.isPage && window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.measure)
    this.measure()
  }
  componentDidUpdate () {
    this.measure()
  }
  componentWillUnmount () {
    this.props.isPage && window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.measure)
  }
  render () {
    const {
      loading, error, statements, t,
      onSelect, focus, isPage,
      search, hasMore, totalCount,
      singleRow, minColumns
    } = this.props
    const { columns, open } = this.state

    const hasEndText = !search

    const gridStyles = !singleRow
      ? styles.grid
      : merge(styles.grid, styles.singleRowGrid)

    return (
      <Loader loading={!statements || loading} error={error} render={() => {
        const items = []
        const lastIndex = statements.length - 1
        const focusItem = (
          focus &&
          statements[0]
        )

        statements.forEach(({ id, portrait, name }, i) => {
          const row = Math.floor(i / columns)
          const offset = i % columns
          const openId = open[row - 1]
          if (
            openId && offset === 0
          ) {
            const openItem = statements
              .find(statement => statement.id === openId)
            if (openItem) {
              items.push(
                <Detail
                  key={`detail${row - 1}`}
                  t={t} data={openItem} />
              )
            }
          }

          const isActive = open[row] === id
          items.push((
            <Item key={id}
              image={portrait}
              name={name}
              isActive={isActive}
              singleRow={singleRow}
              minColumns={minColumns}
              onClick={() => {
                if (onSelect(id) === false) {
                  return
                }
                this.setState((state) => ({
                  open: {
                    ...state.open,
                    [row]: state.open[row] === id ? undefined : id
                  }
                }))
              }} />
          ))

          const lastOpenId = open[row]
          if (
            i === lastIndex && lastOpenId
          ) {
            const openItem = statements
              .find(statement => statement.id === lastOpenId)
            if (openItem) {
              items.push(
                <Detail key={`detail${row}`} t={t} data={openItem} />
              )
            }
          }
        })

        const metaData = focusItem
          ? ({
            pageTitle: t('testimonial/meta/single/pageTitle', focusItem),
            title: t('testimonial/meta/single/title', focusItem),
            description: t('testimonial/meta/single/description', focusItem),
            url: `${PUBLIC_BASE_URL}/community?id=${focusItem.id}`,
            image: `${ASSETS_SERVER_BASE_URL}/render?width=1200&height=628&updatedAt=${encodeURIComponent(focusItem.updatedAt)}&url=${encodeURIComponent(`${PUBLIC_BASE_URL}/community?share=${focusItem.id}`)}`
          })
          : ({
            pageTitle: t('testimonial/meta/pageTitle'),
            title: t('testimonial/meta/title'),
            description: t('testimonial/meta/description'),
            url: `${PUBLIC_BASE_URL}/community`,
            image: `${CDN_FRONTEND_BASE_URL}/static/social-media/community.jpg`
          })

        return (
          <div {...gridStyles} ref={this.ref}>
            {!!isPage && <Meta data={metaData} />}
            {items}
            <div style={{ clear: 'left', marginBottom: 20 }} />
            {
              statements.length >= AUTO_INFINITE &&
              !this.state.endless &&
              hasMore && (
                <A
                  href='#'
                  onClick={e => {
                    e.preventDefault()
                    this.setState(
                      () => ({
                        endless: true
                      }),
                      () => {
                        this.onScroll()
                      }
                    )
                  }}
                >
                  {t('testimonial/infinite/endless', {
                    count: AUTO_INFINITE,
                    remaining: totalCount - AUTO_INFINITE
                  })}
                </A>
              )
            }
            {!hasMore && hasEndText && (
              <P>{t('testimonial/infinite/end', {
                count: statements.length
              })}</P>
            )}
          </div>
        )
      }} />
    )
  }
}

const query = gql`
query statements($seed: Float, $search: String, $focus: String, $after: String, $first: Int!) {
  statements(seed: $seed, search: $search, focus: $focus, after: $after, first: $first) {
    totalCount
    nodes {
      id
      username
      name
      statement
      credentials {
        description
      }
      portrait
      updatedAt
      sequenceNumber
      hasPublicProfile
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`

export const ListWithQuery = compose(
  withT,
  graphql(query, {
    props: ({ data }) => {
      return ({
        loading: data.loading,
        error: data.error,
        totalCount: data.statements && data.statements.totalCount,
        statements: data.statements && data.statements.nodes,
        hasMore: data.statements && data.statements.pageInfo.hasNextPage,
        loadMore () {
          return data.fetchMore({
            updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {
              const nodes = [
                ...previousResult.statements.nodes,
                ...fetchMoreResult.statements.nodes
              ]
              return {
                ...fetchMoreResult,
                statements: {
                  ...fetchMoreResult.statements,
                  nodes: nodes.filter(({ id }, index, all) => (
                    index === all.findIndex(node => node.id === id)
                  ))
                }
              }
            },
            variables: {
              after: data.statements.pageInfo.endCursor
            }
          })
        }
      })
    }
  })
)(List)

ListWithQuery.defaultProps = {
  seed: null,
  first: 50
}

export const generateSeed = () => Math.random() * 2 - 1

class Container extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    const { t, id, isPage } = this.props
    const { query } = this.state

    const seed = this.state.seed || this.props.seed

    return (
      <div>
        <Field label={t('testimonial/search/label')}
          name='search'
          value={query}
          autoComplete='off'
          onChange={(_, value) => {
            this.setState(() => ({
              query: value
            }))
          }} />
        <div {...styles.options}>
          <A style={{ float: 'right', cursor: 'pointer' }} onClick={() => {
            this.setState(() => ({
              seed: generateSeed()
            }))
          }}>{t('testimonial/search/seed')}</A>
        </div>
        <br style={{ clear: 'left' }} />
        <ListWithQuery
          isPage={isPage}
          focus={query ? undefined : id || this.state.clearedFocus}
          onSelect={() => {
            if (!id) {
              return
            }
            this.setState(() => ({
              // keep it around for the query
              clearedFocus: id
            }), () => {
              Router.pushRoute(
                'community',
                {},
                { shallow: true }
              )
            })
          }}
          search={query}
          seed={seed} />
      </div>
    )
  }
}

export default compose(
  withT
)(Container)

import React, {Component} from 'react'
import {gql, graphql} from 'react-apollo'
import {compose} from 'redux'
import {css} from 'glamor'
import {max} from 'd3-array'
import Router from 'next/router'

import Meta from '../Frame/Meta'

import withT from '../../lib/withT'
import Loader from '../Loader'
import Play from '../VideoPlayer/Icons/Play'

import Detail from './Detail'

import {
  PUBLIC_BASE_URL, STATIC_BASE_URL
} from '../../lib/constants'

import {
  Interaction, mediaQueries, fontFamilies,
  Field, Checkbox, A
} from '@project-r/styleguide'

const {P} = Interaction

const SIZES = [
  {minWidth: 0, columns: 3},
  {minWidth: 400, columns: 4},
  {minWidth: 700, columns: 5},
  {minWidth: mediaQueries.mBreakPoint, columns: 3}, // 768
  {minWidth: 900, columns: 4},
  {minWidth: 1000, columns: 5}
]

const PADDING = 5
const styles = {
  grid: css({
    margin: '0 -5px',
    ':after': {
      content: '""',
      display: 'table',
      clear: 'both'
    }
  }),
  item: css({
    cursor: 'pointer',
    float: 'left',
    ...(SIZES.reduce(
      (styles, size) => {
        const width = `${100 / size.columns}%`
        if (size.minWidth) {
          styles[`@media only screen and (min-width: ${size.minWidth}px)`] = {
            width
          }
        } else {
          styles.width = width
        }
        return styles
      },
      {}
    )),
    lineHeight: 0,
    padding: PADDING,
    position: 'relative'
  }),
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
      fontSize: 17,
      lineHeight: '22px'
    },
    color: '#fff',
    fontFamily: fontFamilies.sansSerifMedium
  }),
  play: css({
    position: 'absolute',
    right: PADDING + 5,
    top: PADDING + 5
  })
}

export const Item = ({image, name, video, isActive, onClick, imageRenderer, style}) => (
  <div {...styles.item} style={style} onClick={onClick}>
    <div {...styles.aspect}>
      {imageRenderer ? imageRenderer() : <img src={image} />}
    </div>
    {!!video && <div {...styles.play}><Play /></div>}
    {!isActive && <div {...styles.name}>{name}</div>}
    {isActive && <div {...styles.itemArrow} />}
  </div>
)

const AUTO_INFINITE = 300

class List extends Component {
  constructor (props) {
    super(props)
    this.state = {
      seed: props.seed || generateSeed(),
      columns: 3,
      open: {
        0: props.firstId
      }
    }
    this.measure = () => {
      const sizeIndex = max(SIZES, (d, i) => (
        d.minWidth <= window.innerWidth ? i : -1
      ))
      const size = SIZES[sizeIndex]
      const columns = size.columns
      if (columns !== this.state.columns) {
        this.setState(() => ({
          columns,
          open: {
            0: this.props.firstId
          }
        }))
      }
      this.onScroll()
    }
    this.ref = ref => { this.container = ref }
    this.onScroll = () => {
      const {testimonials, isPage} = this.props

      if (this.container && isPage && testimonials) {
        const bbox = this.container.getBoundingClientRect()
        if (bbox.bottom < window.innerHeight * 2) {
          const {isFetchingMore, hasReachEnd, endless} = this.state
          if (
            isFetchingMore || hasReachEnd ||
            (testimonials.length >= AUTO_INFINITE && !endless)
          ) {
            return
          }
          this.setState(() => ({
            isFetchingMore: true
          }), () => {
            const query = this.query = [
              this.props.seed,
              this.props.firstId,
              this.props.query,
              this.props.videosOnly
            ].join('_')
            this.props.loadMore().then(({data}) => {
              if (query !== this.query) {
                this.setState(() => ({
                  isFetchingMore: false
                }), () => {
                  this.onScroll()
                })
                return
              }
              this.setState(() => ({
                isFetchingMore: false,
                hasReachEnd: !data.testimonials.length
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
  componentWillReceiveProps (nextProps) {
    if (
      nextProps.seed !== this.props.seed ||
      nextProps.firstId !== this.props.firstId ||
      nextProps.search !== this.props.search ||
      nextProps.videosOnly !== this.props.videosOnly
    ) {
      this.setState(() => ({
        hasReachEnd: false
      }))
    }
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
      loading, error, testimonials, t,
      onSelect, queryId, isPage,
      videosOnly, search
    } = this.props
    const {columns, open} = this.state

    const hasEndText = !videosOnly && !search

    return (
      <Loader loading={!testimonials || loading} error={error} render={() => {
        const items = []
        const lastIndex = testimonials.length - 1
        const requestedTestimonial = (
          testimonials.length &&
          testimonials[0].id === queryId &&
          testimonials[0]
        )

        testimonials.forEach(({id, image, video, name}, i) => {
          const row = Math.floor(i / columns)
          const offset = i % columns
          const openId = open[row - 1]
          if (
            openId &&
            (offset === 0 || i === lastIndex)
          ) {
            const openItem = testimonials
              .find(testimonial => testimonial.id === openId)
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
              image={image}
              name={name}
              video={video}
              isActive={isActive}
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
            const openItem = testimonials
              .find(testimonial => testimonial.id === lastOpenId)
            if (openItem) {
              items.push(
                <Detail key={`detail${row}`} t={t} data={openItem} />
              )
            }
          }
        })

        const metaData = requestedTestimonial
          ? ({
            pageTitle: t('testimonial/meta/single/pageTitle', requestedTestimonial),
            title: t('testimonial/meta/single/title', requestedTestimonial),
            description: t('testimonial/meta/single/description', requestedTestimonial),
            url: `${PUBLIC_BASE_URL}/community?id=${requestedTestimonial.id}`,
            image: requestedTestimonial.smImage
          })
          : ({
            pageTitle: t('testimonial/meta/pageTitle'),
            title: t('testimonial/meta/title'),
            description: t('testimonial/meta/description'),
            url: `${PUBLIC_BASE_URL}/community`,
            image: `${STATIC_BASE_URL}/static/social-media/community.jpg`
          })

        return (
          <div {...styles.grid} ref={this.ref}>
            {!!isPage && <Meta data={metaData} />}
            {items}
            <div style={{clear: 'left', marginBottom: 20}} />
            {(
              testimonials.length >= AUTO_INFINITE &&
              !this.state.endless &&
              !this.state.hasReachEnd
            ) && (
              <A href='#'
                onClick={(e) => {
                  e.preventDefault()
                  this.setState(() => ({
                    endless: true
                  }), () => {
                    this.onScroll()
                  })
                }}>
                {t('testimonial/infinite/endless', {
                  count: AUTO_INFINITE
                })}
              </A>
            )}
            {!!this.state.hasReachEnd && hasEndText && (
              <P>{t('testimonial/infinite/end', {
                count: testimonials.length
              })}</P>
            )}
          </div>
        )
      }} />
    )
  }
}

const query = gql`query testimonials($seed: Float, $search: String, $firstId: ID, $offset: Int, $limit: Int, $videosOnly: Boolean) {
  testimonials(seed: $seed, search: $search, firstId: $firstId, offset: $offset, limit: $limit, videosOnly: $videosOnly) {
    id
    userId
    name
    role
    quote
    image
    smImage
    sequenceNumber
    video {
      hls
      mp4
      subtitles
      youtube
    }
  }
}`

export const ListWithQuery = compose(
  withT,
  graphql(query, {
    props: ({data}) => {
      return ({
        loading: data.loading,
        error: data.error,
        testimonials: data.testimonials,
        loadMore () {
          return data.fetchMore({
            updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {
              const testimonials = [
                ...previousResult.testimonials,
                ...fetchMoreResult.testimonials
              ]
              return {
                ...previousResult,
                testimonials: testimonials
                  .filter(Boolean)
                  .filter(({id}, i) => {
                    return i === testimonials
                      .findIndex(testimonial => testimonial.id === id)
                  })
              }
            },
            variables: {
              offset: (data.testimonials || []).length
            }
          })
        }
      })
    }
  })
)(List)

ListWithQuery.defaultProps = {
  seed: null,
  videosOnly: false,
  limit: 50
}

export const generateSeed = () => Math.random() * 2 - 1

class Container extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    const {t, url: {query: {id}}, isPage} = this.props
    const {query, videosOnly} = this.state

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
          <Checkbox
            checked={!!videosOnly}
            onChange={(_, checked) => {
              this.setState(() => ({videosOnly: checked}))
            }}>
            {t('testimonial/search/videosOnly')}
          </Checkbox>
          <A style={{float: 'right', cursor: 'pointer'}} onClick={() => {
            this.setState(() => ({
              seed: generateSeed()
            }))
          }}>{t('testimonial/search/seed')}</A>
        </div>
        <br style={{clear: 'left'}} />
        <ListWithQuery
          isPage={isPage}
          videosOnly={!!videosOnly}
          firstId={query ? undefined : id || this.state.clearedFirstId}
          queryId={id}
          onSelect={() => {
            if (!id) {
              return
            }
            this.setState(() => ({
              // keep it around for the query
              clearedFirstId: id
            }), () => {
              Router.push(
                '/community',
                '/community',
                {shallow: true}
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

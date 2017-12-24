import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Loader from '../../components/Loader'
import withT from '../../lib/withT'
import { css, merge } from 'glamor'
import Badge from './Badge'
import { Link } from '../../lib/routes'
import Meta from '../Frame/Meta'
import LatestComments from './LatestComments'
import PointerList from './PointerList'
import Testimonial from '../Testimonial'
import { HEADER_HEIGHT, TESTIMONIAL_IMAGE_SIZE } from '../constants'
import {
  Interaction,
  colors,
  fontStyles,
  linkRule,
  mediaQueries
} from '@project-r/styleguide'

const SIDEBAR_TOP = 20

const styles = {
  container: css({
    borderTop: `1px solid ${colors.divider}`,
    paddingTop: '80px',
    position: 'relative',
    paddingLeft: `${TESTIMONIAL_IMAGE_SIZE + 20}px`,
    [mediaQueries.onlyS]: {
      paddingLeft: 0,
      paddingTop: '10px'
    }
  }),
  profileImage: {
    backgroundSize: 'cover',
    height: TESTIMONIAL_IMAGE_SIZE,
    width: TESTIMONIAL_IMAGE_SIZE
  },
  sidebar: css({
    left: 0,
    paddingBottom: '20px',
    position: 'absolute',
    top: `${SIDEBAR_TOP}px`,
    width: `${TESTIMONIAL_IMAGE_SIZE}px`,
    [mediaQueries.onlyS]: {
      position: 'static',
      width: 'auto'
    }
  }),
  role: css({ ...fontStyles.sansSerifMedium16 }),
  badges: css({
    margin: '20px 0 30px 0'
  }),
  contact: css({
    ...fontStyles.sansSerifRegular14,
    '& + &': {
      marginTop: '5px'
    }
  }),
  sticky: {
    position: 'fixed'
  }
}

const getPublicUser = gql`
  query getPublicUser($slug: String!) {
    user(slug: $slug) {
      id
      username
      name
      email
      emailAccessRole
      portrait
      hasPublicProfile
      testimonial {
        id
        name
        role
        quote
        image
        sequenceNumber
        published
      }
      facebookId
      twitterHandle
      publicUrl
      badges
      latestComments(limit: 7) {
        id
        content
        discussion {
          id
          title
        }
        createdAt
      }
    }
  }
`

class Profile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sticky: false
    }

    this.onScroll = () => {
      const y = window.pageYOffset
      const mobile = window.innerWidth < mediaQueries.mBreakPoint
      if (!mobile && y + HEADER_HEIGHT > this.y + this.innerHeight) {
        if (!this.state.sticky) {
          this.setState({ sticky: true })
        }
      } else {
        if (this.state.sticky) {
          this.setState({ sticky: false })
        }
      }
    }
    this.innerRef = ref => {
      this.inner = ref
    }
    this.measure = () => {
      if (this.inner) {
        const rect = this.inner.getBoundingClientRect()
        this.y = window.pageYOffset + rect.top
        this.innerHeight = rect.height
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
    const { data: { loading, error, user }, t } = this.props

    const metaData = {
      title: user
        ? t('pages/profile/pageTitle', { name: user.name })
        : t('pages/profile/empty/pageTitle')
    }
    if (!user) {
      return (
        <div>
          <Meta data={metaData} />
          <Interaction.H2>{t('pages/profile/empty/title')}</Interaction.H2>
          <p>
            {t.elements('pages/profile/empty/content', {
              link: (
                <Link route='account'>
                  <a {...linkRule}>{t('Frame/Popover/myaccount')}</a>
                </Link>
              )
            })}
          </p>
        </div>
      )
    }

    return (
      <Loader
        loading={loading}
        error={error}
        render={() => {
          return (
            <div>
              <Meta data={metaData} />
              <div ref={this.innerRef}>
                {user.testimonial &&
                user.testimonial.published && (
                  <Testimonial testimonial={user.testimonial} />
                )}
              </div>
              <div {...styles.container}>
                <div
                  {...(this.state.sticky
                    ? merge(styles.sidebar, styles.sticky, {
                      top: `${HEADER_HEIGHT + SIDEBAR_TOP}px`,
                      left: `${this.x}px`
                    })
                    : styles.sidebar)}
                >
                  <Interaction.H3>{user.name}</Interaction.H3>
                  {user.testimonial && (
                    <div {...styles.role}>{user.testimonial.role}</div>
                  )}

                  {user.badges && (
                    <div {...styles.badges}>
                      {user.badges.map(badge => (
                        <Badge badge={badge} size={27} />
                      ))}
                    </div>
                  )}
                  <PointerList user={user} />
                </div>
                <LatestComments comments={user.latestComments} />
              </div>
            </div>
          )
        }}
      />
    )
  }
}

export default compose(
  withT,
  graphql(getPublicUser)
)(Profile)

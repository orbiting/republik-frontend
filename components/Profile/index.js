import React, { Component } from 'react'
import { gql, graphql } from 'react-apollo'
import { compose } from 'redux'
import Loader from '../../components/Loader'
import withT from '../../lib/withT'
import { css, merge } from 'glamor'
import Badge from './Badge'
import Testimonial from '../Testimonial'
import IconLink from '../IconLink'
import {
  BASE_URL_FACEBOOK,
  BASE_URL_TWITTER,
  HEADER_HEIGHT,
  TESTIMONIAL_IMAGE_SIZE
} from '../constants'
import {
  Interaction,
  colors,
  fontStyles,
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
  role: css({...fontStyles.sansSerifMedium16}),
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

const getProfile = gql`
  query getProfile($userId: ID!) {
    profile(id: $userId) {
      id
      name
      email
      testimonial {
        id
        name
        role
        quote
        image
        sequenceNumber
      }
      facebookId
      twitterHandle
      isEmailPublic
      publicUrl
      badges
      latestComments {
        id
        content
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
    const { data: { loading, error, profile }, t } = this.props

    return (
      <Loader
        loading={loading}
        error={error}
        render={() => {
          return (
            <div>
              <div ref={this.innerRef} id='test'>
                {profile.testimonial && (
                  <Testimonial testimonial={profile.testimonial} />
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
                  <Interaction.H3>{profile.testimonial.name}</Interaction.H3>
                  <div {...styles.role}>{profile.testimonial.role}</div>
                  {profile.badges && (
                    <div {...styles.badges}>
                      {profile.badges.map(badge => (
                        <Badge badge={badge} size={27} />
                      ))}
                    </div>
                  )}
                  {profile.facebookId && (
                    <div {...styles.contact}>
                      <IconLink
                        icon='facebook'
                        text={profile.facebookId}
                        href={`${BASE_URL_FACEBOOK}/${profile.facebookId}`}
                      />
                    </div>
                  )}
                  {profile.twitterHandle && (
                    <div {...styles.contact}>
                      <IconLink
                        icon='twitter'
                        text={profile.twitterHandle}
                        href={`${BASE_URL_TWITTER}/${profile.twitterHandle}`}
                      />
                    </div>
                  )}
                  {profile.isEmailPublic && (
                    <div {...styles.contact}>
                      <IconLink
                        icon='mail'
                        text={profile.email}
                        href={`mailto:${profile.email}`}
                      />
                    </div>
                  )}
                  {profile.publicUrl && (
                    <div {...styles.contact}>
                      <IconLink
                        icon='link'
                        text={profile.publicUrl}
                        href={profile.publicUrl}
                        target={'_blank'}
                      />
                    </div>
                  )}
                </div>
                <Interaction.H3>{t('profile/discussion')}</Interaction.H3>
                {profile.latestComments.map(comment => (
                  <p>{comment.content}</p>
                ))}
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
  graphql(getProfile, {
    options: props => ({
      variables: {
        userId: props.userId
      }
    })
  })
)(Profile)

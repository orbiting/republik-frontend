import React, { Fragment } from 'react'
import { css } from 'glamor'
import { colors, DEFAULT_PROFILE_PICTURE, mediaQueries } from '@project-r/styleguide'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'
import PersonIcon from 'react-icons/lib/md/person-outline'
import withT from '../../lib/withT'

const BUTTON_SIZE = 40
const BUTTON_SIZE_MOBILE = 30
const BUTTON_PADDING = (HEADER_HEIGHT - BUTTON_SIZE) / 2
const BUTTON_PADDING_MOBILE = (HEADER_HEIGHT_MOBILE - BUTTON_SIZE_MOBILE) / 2
const ICON_SIZE = 30

const styles = {
  user: css({
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'inline-block',
    opacity: 'inherit',
    textAlign: 'left',
    height: HEADER_HEIGHT_MOBILE,
    width: 'auto',
    [mediaQueries.mUp]: {
      height: HEADER_HEIGHT,
      width: 'auto'
    }
  }),
  button: css({
    color: colors.text,
    display: 'inline-block',
    textDecoration: 'none',
    padding: `${BUTTON_PADDING_MOBILE}px`,
    [mediaQueries.mUp]: {
      padding: `${BUTTON_PADDING}px`
    }
  }),
  portrait: css({
    verticalAlign: 'top',
    height: `${HEADER_HEIGHT_MOBILE - 2 * BUTTON_PADDING_MOBILE}px`,
    [mediaQueries.mUp]: {
      height: `${HEADER_HEIGHT - 2 * BUTTON_PADDING}px`
    }
  }),
  anonymous: css({
    display: 'inline-block',
    padding: `${(BUTTON_SIZE_MOBILE - ICON_SIZE) / 2}px`,
    [mediaQueries.mUp]: {
      padding: `${(BUTTON_SIZE - ICON_SIZE) / 2}px`
    }
  }),
  label: css({
    display: 'none',
    [mediaQueries.mUp]: {
      display: 'inline-block',
      marginLeft: 5
    }
  })
}

const User = ({ t, me, onClick, title }) => (
  <div {...styles.user}>
    <a
      {...styles.button}
      role='button'
      title={title}
      href='/'
      onClick={e => {
        e.preventDefault()
        onClick()
      }}
    >
      {me && <img src={me.portrait || DEFAULT_PROFILE_PICTURE} {...styles.portrait} />}
      {!me && <Fragment>
        <span {...styles.anonymous}>
          <PersonIcon size={ICON_SIZE} fill={'#282828'} />
        </span>
        <span {...styles.label}>{t('header/signin')}</span>
      </Fragment>}
    </a>
  </div>
)

export default withT(User)

import React from 'react'
import { css } from 'glamor'
import { colors, mediaQueries } from '@project-r/styleguide'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'
import PersonIcon from 'react-icons/lib/md/person-outline'

const BUTTON_SIZE = 50
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
    textAlign: 'left',
    height: HEADER_HEIGHT_MOBILE,
    width: HEADER_HEIGHT_MOBILE,
    [mediaQueries.mUp]: {
      height: HEADER_HEIGHT,
      width: HEADER_HEIGHT
    }
  }),
  button: css({
    color: colors.text,
    display: 'inline-block',
    padding: `${BUTTON_PADDING_MOBILE}px`,
    [mediaQueries.mUp]: {
      padding: `${BUTTON_PADDING}px`
    },
    height: '100%',
    width: '100%'
  }),
  portrait: css({
    verticalAlign: 'top',
    height: `${HEADER_HEIGHT_MOBILE - 2 * BUTTON_PADDING_MOBILE}px`,
    [mediaQueries.mUp]: {
      height: `${HEADER_HEIGHT - 2 * BUTTON_PADDING}px`
    }
  }),
  initials: css({
    display: 'inline-block',
    textAlign: 'center',
    backgroundColor: '#ccc',
    color: '#000',
    textTransform: 'uppercase',
    height: '100%',
    lineHeight: `${HEADER_HEIGHT_MOBILE - 2 * BUTTON_PADDING_MOBILE}px`,
    width: '100%',
    fontSize: 14,
    [mediaQueries.mUp]: {
      fontSize: 20,
      lineHeight: `${HEADER_HEIGHT - 2 * BUTTON_PADDING}px`
    }
  }),
  anonymous: css({
    display: 'inline-block',
    padding: `${(BUTTON_SIZE_MOBILE - ICON_SIZE) / 2}px`,
    [mediaQueries.mUp]: {
      padding: `${(BUTTON_SIZE - ICON_SIZE) / 2}px`
    }
  })
}

export default ({ url, me, onclickHandler }) => (
  <div {...styles.user}>
    <a
      {...styles.button}
      href='/'
      onClick={e => {
        e.preventDefault()
        onclickHandler()
      }}
    >
      {me && me.portrait && <img src={me.portrait} {...styles.portrait} />}
      {me && !me.portrait && me.initials && <span {...styles.initials}>{me.initials}</span>}
      {!me && (
        <span {...styles.anonymous}>
          <PersonIcon size={ICON_SIZE} fill={'#282828'} />
        </span>
      )}
    </a>
  </div>
)

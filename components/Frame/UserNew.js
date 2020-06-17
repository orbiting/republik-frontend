import React, { Fragment } from 'react'
import { css } from 'glamor'
import { colors, mediaQueries, fontStyles } from '@project-r/styleguide'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'
import { MdPersonOutline } from 'react-icons/md'
import withT from '../../lib/withT'

const BUTTON_SIZE = 40
const BUTTON_SIZE_MOBILE = 24
const BUTTON_PADDING = (HEADER_HEIGHT - BUTTON_SIZE) / 2
const BUTTON_PADDING_MOBILE = (HEADER_HEIGHT_MOBILE - BUTTON_SIZE_MOBILE) / 2
const ICON_SIZE = 30

const PORTRAIT_HEIGHT_MOBILE = HEADER_HEIGHT_MOBILE - 2 * BUTTON_PADDING_MOBILE
const PORTRAIT_HEIGHT = HEADER_HEIGHT - 2 * BUTTON_PADDING

const styles = {
  user: css({
    cursor: 'pointer',
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
    display: 'inline-block',
    textDecoration: 'none',
    padding: `${BUTTON_PADDING_MOBILE}px`,
    [mediaQueries.mUp]: {
      padding: `${BUTTON_PADDING}px`
    }
  }),
  portrait: css({
    position: 'relative',
    display: 'inline-block',
    verticalAlign: 'top',
    backgroundColor: '#E1E7E5',
    color: '#fff',
    textAlign: 'center',
    textTransform: 'uppercase',
    ...fontStyles.serifTitle,
    fontSize: PORTRAIT_HEIGHT_MOBILE / 2,
    lineHeight: `${PORTRAIT_HEIGHT_MOBILE + 4}px`,
    height: `${PORTRAIT_HEIGHT_MOBILE}px`,
    width: `${PORTRAIT_HEIGHT_MOBILE}px`,
    [mediaQueries.mUp]: {
      fontSize: PORTRAIT_HEIGHT / 2,
      lineHeight: `${PORTRAIT_HEIGHT + 5}px`,
      height: `${PORTRAIT_HEIGHT}px`,
      width: `${PORTRAIT_HEIGHT}px`
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

const getInitials = me =>
  (me.name && me.name.trim()
    ? me.name.split(' ').filter((n, i, all) => i === 0 || all.length - 1 === i)
    : me.email
        .split('@')[0]
        .split(/\.|-|_/)
        .slice(0, 2)
  )
    .slice(0, 2)
    .filter(Boolean)
    .map(s => s[0])
    .join('')

const User = ({ t, me, title, dark, expanded, backButton, ...props }) => {
  const color = dark ? colors.negative.text : colors.text
  return (
    <div {...styles.user} {...props}>
      <div
        {...styles.button}
        aria-expanded={expanded}
        style={{
          color,
          paddingLeft: backButton
            ? BUTTON_PADDING_MOBILE / 2
            : BUTTON_PADDING_MOBILE
        }}
        role='button'
        title={title}
      >
        {me &&
          (me.portrait ? (
            <img src={me.portrait} {...styles.portrait} />
          ) : (
            <span {...styles.portrait}>{getInitials(me)}</span>
          ))}
        {!me && (
          <Fragment>
            <span {...styles.anonymous}>
              <MdPersonOutline size={ICON_SIZE} fill={color} />
            </span>
            <span {...styles.label}>{t('header/signin')}</span>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default withT(User)

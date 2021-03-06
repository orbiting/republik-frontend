import React, { Fragment } from 'react'
import { css } from 'glamor'
import {
  mediaQueries,
  fontStyles,
  plainButtonRule,
  useColorContext
} from '@project-r/styleguide'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'
import { AccountBoxIcon } from '@project-r/styleguide/icons'
import withT from '../../lib/withT'

const BUTTON_SIZE = 32
const BUTTON_SIZE_MOBILE = 26
const BUTTON_PADDING = (HEADER_HEIGHT - BUTTON_SIZE) / 2
const BUTTON_PADDING_MOBILE = (HEADER_HEIGHT_MOBILE - BUTTON_SIZE_MOBILE) / 2

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

const User = ({ t, me, title, backButton, onClick, isOnMarketingPage }) => {
  const [colorScheme] = useColorContext()
  return (
    <button {...styles.user} onClick={onClick} title={title}>
      <span
        {...styles.button}
        {...colorScheme.set('color', 'text')}
        style={{
          paddingLeft: backButton ? BUTTON_PADDING_MOBILE / 2 : 16
        }}
      >
        {me &&
          (me.portrait ? (
            <img src={me.portrait} {...styles.portrait} />
          ) : (
            <span
              {...styles.portrait}
              {...colorScheme.set('backgroundColor', 'hover')}
              {...colorScheme.set('color', 'text')}
            >
              {getInitials(me)}
            </span>
          ))}
        {!me && (
          <Fragment>
            <span {...styles.anonymous}>
              <AccountBoxIcon {...colorScheme.set('fill', 'text')} />
            </span>
            <span
              {...(isOnMarketingPage
                ? styles.labelMarketing
                : styles.labelDefault)}
            >
              {t('header/signin')}
            </span>
          </Fragment>
        )}
      </span>
    </button>
  )
}

const styles = {
  user: css(plainButtonRule, {
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
    textAlign: 'center',
    textTransform: 'uppercase',
    ...fontStyles.serifTitle,
    fontSize: BUTTON_SIZE_MOBILE / 2,
    lineHeight: `${BUTTON_SIZE_MOBILE + 4}px`,
    height: `${BUTTON_SIZE_MOBILE}px`,
    width: `${BUTTON_SIZE_MOBILE}px`,
    [mediaQueries.mUp]: {
      fontSize: BUTTON_SIZE / 2,
      lineHeight: `${BUTTON_SIZE + 5}px`,
      height: `${BUTTON_SIZE}px`,
      width: `${BUTTON_SIZE}px`
    }
  }),
  anonymous: css({
    display: 'inline-block',
    '& svg': {
      width: BUTTON_SIZE_MOBILE,
      height: BUTTON_SIZE_MOBILE,
      [mediaQueries.mUp]: {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE
      }
    }
  }),
  labelMarketing: css({
    display: 'inline-block',
    verticalAlign: 'middle',
    marginLeft: 5
  }),
  labelDefault: css({
    display: 'none',
    verticalAlign: 'middle',
    marginLeft: 5,
    [mediaQueries.mUp]: {
      display: 'inline-block'
    }
  })
}

export default withT(User)

import React, { Fragment } from 'react'
import { css } from 'glamor'
import {
  mediaQueries,
  fontStyles,
  useColorContext
} from '@project-r/styleguide'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'
import { MdAccountBox } from 'react-icons/md'
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

const User = ({ t, me, title, backButton, onClick, isMobile }) => {
  const [colorScheme] = useColorContext()
  return (
    <div {...styles.user} onClick={onClick} role='button'>
      <div
        {...css(styles.button, {
          color: colorScheme.text,
          paddingLeft: backButton ? BUTTON_PADDING_MOBILE / 2 : 16
        })}
        role='button'
        title={title}
      >
        {me &&
          (me.portrait ? (
            <img src={me.portrait} {...styles.portrait} />
          ) : (
            <span
              style={{
                backgroundColor: colorScheme.divider,
                color: colorScheme.text
              }}
              {...styles.portrait}
            >
              {getInitials(me)}
            </span>
          ))}
        {!me && (
          <Fragment>
            <span {...styles.anonymous}>
              <MdAccountBox
                size={isMobile ? BUTTON_SIZE_MOBILE : BUTTON_SIZE}
                fill={colorScheme.text}
              />
            </span>
            <span {...styles.label}>{t('header/signin')}</span>
          </Fragment>
        )}
      </div>
    </div>
  )
}

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
    display: 'inline-block'
  }),
  label: css({
    display: 'none',
    [mediaQueries.mUp]: {
      display: 'inline-block',
      verticalAlign: 'middle',
      marginLeft: 5
    }
  })
}

export default withT(User)

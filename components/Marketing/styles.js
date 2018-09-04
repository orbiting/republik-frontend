import { css, merge } from 'glamor'
import {
  colors,
  mediaQueries,
  fontFamilies
} from '@project-r/styleguide'

const buttonStyle = css({
  [mediaQueries.onlyS]: {
    padding: '8px 15px 8px 15px',
    fontSize: '16px',
    lineHeight: '25px',
    height: 50
  },
  width: '100%',
  outline: 'none',
  verticalAlign: 'bottom',
  minWidth: 160,
  textAlign: 'center',
  textDecoration: 'none',
  fontSize: 22,
  height: 60,
  boxSizing: 'border-box',
  backgroundColor: '#fff',
  fontFamily: fontFamilies.sansSerifRegular,
  border: `1px solid ${colors.secondary}`,
  borderRadius: 0,
  color: colors.secondary,
  cursor: 'pointer',
  ':hover': {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    color: '#fff'
  },
  ':active': {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
    color: '#fff'
  },
  ':disabled, [disabled]': {
    backgroundColor: '#fff',
    color: colors.disabled,
    borderColor: colors.disabled,
    cursor: 'default'
  }
})

const primaryStyle = css({
  backgroundColor: colors.primary,
  borderColor: colors.primary,
  color: '#fff',
  ':hover': {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary
  },
  ':active': {
    backgroundColor: '#000',
    borderColor: '#000',
    color: '#fff'
  }
})

export const buttonStyles = {
  standard: buttonStyle,
  primary: merge(buttonStyle, primaryStyle)
}

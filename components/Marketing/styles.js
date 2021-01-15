import { css, merge } from 'glamor'
import { colors, mediaQueries, fontFamilies } from '@project-r/styleguide'

const buttonStyle = css({
  [mediaQueries.onlyS]: {
    padding: '7px 15px 7px 15px',
    fontSize: '18px',
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
  '@media (hover)': {
    ':hover': {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      color: '#fff'
    }
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
  '@media(hover)': {
    ':hover': {
      backgroundColor: colors.secondary,
      borderColor: colors.secondary
    }
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

export const sharedStyles = {
  headline: css({
    fontSize: '28px',
    lineHeight: '34px',
    maxWidth: '1002px',
    textAlign: 'center',
    margin: '0 auto',
    fontWeight: 'normal',
    fontFamily: fontFamilies.serifTitle,
    marginTop: 20,
    [mediaQueries.mUp]: {
      fontSize: '64px',
      lineHeight: '72px',
      marginTop: 50
    }
  }),
  lead: css({
    fontFamily: fontFamilies.serifRegular,
    fontSize: '16px',
    lineHeight: '26px',
    textAlign: 'center',
    maxWidth: '702px',
    margin: '12px auto 0 auto',
    [mediaQueries.mUp]: {
      fontSize: '23px',
      lineHeight: '36px',
      marginTop: '32px'
    }
  }),
  actions: css({
    maxWidth: '974px',
    margin: '14px auto 5px auto',
    '& > *': {
      marginBottom: '9px',
      width: '100%'
    },
    [mediaQueries.mUp]: {
      margin: '60px auto 15px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      '& > *': {
        margin: 0,
        width: '50%'
      },
      '& > *:first-child': {
        marginRight: '10px'
      },
      '& > *:last-child': {
        marginLeft: '10px'
      }
    }
  }),
  signIn: css({
    textAlign: 'center',
    marginBottom: 23,
    [mediaQueries.mUp]: {
      marginTop: 4,
      marginBottom: 80
    }
  }),
  spacer: css({
    minHeight: '23px',
    [mediaQueries.mUp]: {
      minHeight: '84px'
    }
  }),
  links: css({
    fontSize: 16,
    lineHeight: '24px'
  })
}

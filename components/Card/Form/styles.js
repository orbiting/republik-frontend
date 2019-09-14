import { css } from 'glamor'

import { mediaQueries, colors } from '@project-r/styleguide'

export const styles = {
  section: css({
    marginTop: 40
  }),
  heading: css({
    marginTop: 40
  }),
  paragraph: css({
    marginTop: 40
  }),
  portraitAndDetails: css({
    marginTop: 40,
    [mediaQueries.mUp]: {
      display: 'flex'
    }
  }),
  portrait: css({
    width: 600 / 3,
    height: 800 / 3,
    [mediaQueries.mUp]: {
      minWidth: 300,
      width: 600 / 2,
      height: 800 / 2
    }
  }),
  details: css({
    marginTop: 40,
    marginBottom: 40,
    [mediaQueries.mUp]: {
      marginTop: 0,
      marginLeft: 40
    }
  }),
  errorMessages: css({
    color: colors.error,
    marginTop: 40
  }),
  button: css({
    marginTop: 40,
    width: 170,
    textAlign: 'center'
  })
}

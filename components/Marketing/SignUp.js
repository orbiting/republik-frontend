import React, { Fragment } from 'react'
import { css } from 'glamor'

import SignIn from '../Auth/SignIn'

import withMe from '../../lib/apollo/withMe'
import {
  fontFamilies,
  mediaQueries
} from '@project-r/styleguide'

const styles = {
  headline: css({
    fontSize: '30px',
    lineHeight: '34px',
    margin: '0 auto',
    fontWeight: 'normal',
    fontFamily: fontFamilies.sansSerifMedium,
    marginTop: '20px',
    [mediaQueries.mUp]: {
      fontSize: '40px',
      lineHeight: '46px',
      marginTop: '70px'
    }

  }),
  lead: css({
    fontSize: '16px',
    lineHeight: '24px',
    fontFamily: fontFamilies.sansSerifRegular,
    margin: '12px auto 0 auto',
    [mediaQueries.mUp]: {
      fontSize: '22px',
      lineHeight: '30px',
      marginTop: '40px'
    }
  }),
  signUp: css({
    marginTop: '18px',
    marginBottom: '40px',
    [mediaQueries.mUp]: {
      marginTop: '52px',
      marginBottom: '80px'
    }
  })
}

export default withMe(({ me }) =>
  !me &&
  <Fragment>
    <h1 {...styles.headline}>Danke für Ihre Neugier!</h1>
    <p {...styles.lead}>
        Melden Sie sich an, um kostenlos fünf Artikel zu lesen. Ausserdem senden wir Ihnen am nächsten Nicht-Sonntag einmalig unseren Newsletter mit allen Inhalten des aktuellen Tages zu.
    </p>
    <div {...styles.signUp}>
      <SignIn label='Anmelden' context='preview' />
    </div>
  </Fragment>

)

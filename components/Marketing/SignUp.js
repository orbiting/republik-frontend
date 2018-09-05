import React, { Fragment } from 'react'
import { css } from 'glamor'
import { compose } from 'react-apollo'

import SignIn from '../Auth/SignIn'

import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'
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

export default compose(
  withMe, withT
)(({ me, t }) =>
  !me &&
  <Fragment>
    <h1 {...styles.headline}>{t('marketing-20/signup/title')}</h1>
    <p {...styles.lead}>
      {t('marketing-20/signup/lead')}
    </p>
    <div {...styles.signUp}>
      <SignIn label={t('marketing-20/signup/button/label')} context='preview' />
    </div>
  </Fragment>

)

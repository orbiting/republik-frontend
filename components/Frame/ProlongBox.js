import React from 'react'
import { withRouter } from 'next/router'
import { compose } from 'react-apollo'

import { Editorial, colors, mediaQueries } from '@project-r/styleguide'

import { css } from 'glamor'

import TokenPackageLink from '../Link/TokenPackage'
import withInNativeApp from '../../lib/withInNativeApp'

const styles = {
  box: css({
    padding: 15,
    backgroundColor: colors.primaryBg,
    textAlign: 'center',
    fontSize: 13,
    [mediaQueries.mUp]: {
      fontSize: 16
    }
  })
}

const chJan16 = new Date('2019-01-15T23:00:00.000Z')

const ProlongBox = ({
  t, prolongBeforeDate, router,
  inNativeApp, inNativeIOSApp
}) => {
  if (router.pathname === '/pledge' || router.pathname === '/cancel' || router.pathname === '/meta') {
    return null
  }
  const date = new Date(prolongBeforeDate)
  if (date < chJan16) {
    return <div {...styles.box}>
      {t.elements('prolongNecessary/jan15', {
        link: <TokenPackageLink key='link' params={{ package: 'PROLONG' }} passHref>
          <Editorial.A target={inNativeApp && !inNativeIOSApp ? '_blank' : undefined}>
            {t('prolongNecessary/jan15/linkText')}
          </Editorial.A>
        </TokenPackageLink>
      })}
    </div>
  }
  return null
}

export default compose(
  withRouter,
  withInNativeApp
)(ProlongBox)

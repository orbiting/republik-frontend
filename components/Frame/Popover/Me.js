import React from 'react'

import { css } from 'glamor'
import SignIn from '../../Auth/SignIn'
import SignOut from '../../Auth/SignOut'
import { Link } from '../../../lib/routes'
import withT from '../../../lib/withT'

import { Label, fontStyles, linkRule } from '@project-r/styleguide'

const styles = {
  container: css({
    ...fontStyles.sansSerifRegular16,
    paddingTop: '20px'
  })
}

const Me = ({ me, children, t }) => (
  <div {...styles.container}>
    {children}
    {me && <Label>{me.name || me.email}</Label>}
    <br />
    {me && (
      <div>
        <Link route='me'>
          <a {...linkRule}>{t('Frame/Popover/myaccount')}</a>
        </Link>
        <br />
        <Link route='profile' params={{userId: me.id}}>
          <a {...linkRule}>{t('Frame/Popover/myprofile')}</a>
        </Link>
        <br />
      </div>
    )}
    {me ? <SignOut /> : <SignIn />}
  </div>
)

export default withT(Me)

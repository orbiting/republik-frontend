import React, { Fragment } from 'react'
import Frame from '../Frame'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'
import SignIn from './SignIn'
import Me from './Me'
import { css } from 'glamor'

import { Interaction } from '@project-r/styleguide'

const checkRoles = (me, roles) => {
  return !!(
    me &&
    (!roles || (
      me.roles &&
      me.roles.some(role =>
        roles.indexOf(role) !== -1
      )
    ))
  )
}

const Empty = () => null

const styles = {
  center: css({
    width: '100%',
    maxWidth: '540px',
    margin: '20vh auto',
    padding: 20
  })
}
export const PageCenter = ({children}) => (
  <div {...styles.center}>
    {children}
  </div>
)

export const EnsureAuthorization = withMe(({
  me,
  roles,
  render = Empty,
  unauthorized = Empty
}) => {
  if (
    checkRoles(me, roles)
  ) {
    return render()
  } else {
    return unauthorized({me})
  }
})

const UnauthorizedPage = withT(({t, me, roles = []}) => (
  <Frame raw>
    <PageCenter>
      {!me ? (
        <Fragment>
          <Interaction.H1>{t('withAuthorization/title')}</Interaction.H1>
          <br />
          <SignIn />
        </Fragment>
      ) : (
        <Fragment>
          <Interaction.H1>{t('withAuthorization/title')}</Interaction.H1>
          <Interaction.P>
            {t('withAuthorization/authorizedRoles', {
              roles: roles.join(', ')
            })}
            <br />
          </Interaction.P>
          <br />
          <Me />
        </Fragment>
      )}
    </PageCenter>
  </Frame>
))

export default roles => WrappedComponent => props => (
  <EnsureAuthorization
    roles={roles}
    render={() => <WrappedComponent {...props} />}
    unauthorized={({me}) => <UnauthorizedPage me={me} roles={roles} />} />
)

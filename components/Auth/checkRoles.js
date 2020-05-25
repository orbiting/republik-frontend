import React from 'react'
import withMe from '../../lib/apollo/withMe'

const checkRoles = (me, roles) => {
  return !!(
    me &&
    (!roles || (me.roles && me.roles.some(role => roles.indexOf(role) !== -1)))
  )
}

export const withAuthorization = (
  roles,
  key = 'isAuthorized'
) => WrappedComponent =>
  withMe(({ me, ...props }) => (
    <WrappedComponent
      {...props}
      me={me}
      {...{ [key]: checkRoles(me, roles) }}
    />
  ))

export const withMembership = withAuthorization(['member'], 'isMember')
export const withEditor = withAuthorization(['editor'], 'isEditor')
export const withSupporter = withAuthorization(['supporter'], 'isSupporter')

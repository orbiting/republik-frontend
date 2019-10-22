import React from 'react'
import withMe from './apollo/withMe'
import { compose } from 'react-apollo'

export default (WrappedComponent) => compose(withMe)(({ me, ...props }) => {
  const isActiveMember = me && me.activeMembership
  const isTrial = me && !isActiveMember

  return (<WrappedComponent
    isActiveMember={isActiveMember}
    isTrial={isTrial}
    {...props}
  />)
})

import React from 'react'
import withMe from './apollo/withMe'
import { compose } from 'react-apollo'

export default (WrappedComponent) => compose(withMe)(({ me, ...props }) => {
  const isActiveMember = me && me.activeMembership
  const hasOngoingTrial = me && !isActiveMember

  return (<WrappedComponent
    isActiveMember={isActiveMember}
    hasOngoingTrial={hasOngoingTrial}
    {...props}
  />)
})

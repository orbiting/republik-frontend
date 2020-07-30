import React from 'react'
import withMe from './apollo/withMe'
import { compose } from 'react-apollo'

const withMemberStatus = WrappedComponent =>
  compose(withMe)(({ me, ...props }) => {
    const hasActiveMembership = me && !!me.activeMembership
    const isEligibleForTrial = !me

    return (
      <WrappedComponent
        hasActiveMembership={hasActiveMembership}
        isEligibleForTrial={isEligibleForTrial}
        {...props}
      />
    )
  })

export default withMemberStatus

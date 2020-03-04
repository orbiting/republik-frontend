import React from 'react'
import withMe from './apollo/withMe'
import { compose } from 'react-apollo'

export default WrappedComponent =>
  compose(withMe)(({ me, ...props }) => {
    const hasActiveMembership = me && !!me.activeMembership
    // tmp: no trial in March
    const isEligibleForTrial = false // !me

    return (
      <WrappedComponent
        hasActiveMembership={hasActiveMembership}
        isEligibleForTrial={isEligibleForTrial}
        {...props}
      />
    )
  })

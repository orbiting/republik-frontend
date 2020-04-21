import React, { useState, useEffect } from 'react'

import { Loader } from '@project-r/styleguide'

import withAuthorizeSession from './withAuthorizeSession'

const AccessTokenAuthorization = ({ email, accessToken, authorizeSession }) => {
  const [loaderProps, setLoaderProps] = useState({ loading: true })

  useEffect(() => {
    setLoaderProps({ loading: true })
    authorizeSession({
      email,
      tokens: [{ type: 'AUTHORIZE_TOKEN', payload: accessToken }]
    }).catch(error => {
      setLoaderProps({ error })
    })
  }, [email, accessToken])

  return <Loader {...loaderProps} />
}

export default withAuthorizeSession(AccessTokenAuthorization)

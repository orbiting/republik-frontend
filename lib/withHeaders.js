import React, { useContext } from 'react'
import PropTypes from 'prop-types'

const HeaderContext = React.createContext()

// save headers in a global when receiving them in the browser
let savedHeaders

export const HeadersProvider = ({ children, headers }) => {
  // write headers to a global when the first page renders in the client
  // - browser only to ensure that it isn't shared between connections (which would be bad)
  if (process.browser && headers) {
    savedHeaders = headers
  }
  return (
    <HeaderContext.Provider value={headers || savedHeaders}>
      {children}
    </HeaderContext.Provider>
  )
}

export const useHeaders = () => useContext(HeaderContext)

const withHeaders = WrappedComponent => {
  const WithHeaders = props => {
    const headers = useHeaders()
    return <WrappedComponent {...props} headers={headers} />
  }

  return WithHeaders
}

export default withHeaders

export const matchIOSUserAgent = value =>
  value && !!value.match(/iPad|iPhone|iPod/)

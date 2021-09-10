import React, { useContext } from 'react'

const HeaderContext = React.createContext()

// save headers in a global when receiving them in the browser
let savedHeaders = {}

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
  value &&
  (!!value.match(/iPad|iPhone|iPod/) ||
    // iPad Pro in App
    // for web see https://stackoverflow.com/questions/56578799/tell-ipados-from-macos-on-the-web but that only works client side
    !!value.match(/Mac.+RepublikApp/))

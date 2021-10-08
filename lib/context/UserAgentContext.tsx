import React, { createContext, ReactNode, useContext, useMemo } from 'react'

const UserAgentContext = createContext<string | undefined>(undefined)

export const useUserAgent = () => useContext(UserAgentContext)

type Props = {
  children: ReactNode
  providedValue?: string
}

const UserAgentContextProvider = ({ children, providedValue }: Props) => {
  const userAgent = useMemo(() => providedValue ?? navigator.userAgent, [
    navigator.userAgent
  ])

  return (
    <UserAgentContext.Provider value={userAgent}>
      {children}
    </UserAgentContext.Provider>
  )
}

export default UserAgentContextProvider

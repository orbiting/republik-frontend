import React, { createContext, ReactNode, useContext, useMemo } from 'react'

export const matchIOSUserAgent = (value?: string): boolean =>
  value &&
  (!!value.match(/iPad|iPhone|iPod/) ||
    // iPad Pro in App
    // for web see https://stackoverflow.com/questions/56578799/tell-ipados-from-macos-on-the-web but that only works client side
    !!value.match(/Mac.+RepublikApp/))

const UserAgentContext = createContext<string | undefined>(undefined)

export const useUserAgent = () => useContext(UserAgentContext)

type Props = {
  children: ReactNode
  providedValue?: string
}

const UserAgentProvider = ({ children, providedValue }: Props) => {
  const navigatorUserAgent =
    typeof navigator !== 'undefined' ? navigator.userAgent : undefined

  const userAgent = useMemo(() => {
    return providedValue || navigatorUserAgent
  }, [providedValue, navigatorUserAgent])

  return (
    <UserAgentContext.Provider value={userAgent}>
      {children}
    </UserAgentContext.Provider>
  )
}

export default UserAgentProvider

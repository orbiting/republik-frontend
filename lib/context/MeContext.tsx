import React, { createContext, ReactNode, useContext, useMemo } from 'react'
import Head from 'next/head'
import { ApolloError, useQuery } from '@apollo/client'
import { checkRoles, meQuery } from '../apollo/withMe'

type Me = {
  id: string
  username: string
  name: string
  initials: string
  firstName: string
  lastName: string
  email: string
  portrait: string
  roles: string[]
  isListed: boolean
  hasPublicProfile: boolean
  discussionNotificationChannels: string[]
  accessCampaigns: { id: string }[]
  prolongBeforeDate: string
  activeMembership: {
    id: string
    type: {
      name: string
    }
    endDate: string
    graceEndDate: string
  }
  progressConsent: boolean
}

type MeResponse = {
  me: Me
}

type MeContextValues = {
  me?: Me
  meLoading: boolean
  meError?: ApolloError
  meRefetch: any
  hasActiveMembership: boolean
  hasAccess: boolean
}

const MeContext = createContext<MeContextValues>({} as MeContextValues)

export const useMe = (): MeContextValues => useContext(MeContext)

type Props = {
  children?: ReactNode
}

const MeContextProvider = ({ children }: Props) => {
  const { data, loading, error, refetch } = useQuery<MeResponse>(meQuery, {})

  const me = useMemo(() => {
    if (data) return data.me

    return undefined
  }, [data])

  return (
    <MeContext.Provider
      value={{
        me: me,
        meLoading: loading,
        meError: error,
        meRefetch: refetch,
        hasActiveMembership: !!me?.activeMembership,
        hasAccess: checkRoles(me, ['member'])
      }}
    >
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
 function handleLoggedInState(){const fuckOff=localStorage.getItem('persisted-me')
console.debug('persisted-me',fuckOff)
if(fuckOff){document.body.setAttribute('data-logged-in','true')}else{document.body.removeAttribute('data-logged-in')}}
if(typeof window!=='undefined'){window.addEventListener('storage',handleLoggedInState)}
document.addEventListener('DOMContentLoaded',handleLoggedInState)
                          `
          }}
        />
      </Head>
      {children}
    </MeContext.Provider>
  )
}

export default MeContextProvider

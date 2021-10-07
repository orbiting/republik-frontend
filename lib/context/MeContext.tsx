import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo
} from 'react'
import Head from 'next/head'
import Script from 'next/script'
import { ApolloError, useQuery } from '@apollo/client'
import { checkRoles, meQuery } from '../apollo/withMe'
import { css } from 'glamor'

const IS_MEMBER_ATTRIBUTE = 'data-is-member'
const MEMBERSHIP_STORAGE_KEY = 'is-member'

// Rule to hide elements while a statically generated page is fetching the active-user
css.global(`body[${IS_MEMBER_ATTRIBUTE}="true"] [data-hide-for-member]`, {
  display: 'none'
})

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

  useEffect(() => {
    if (!data) return
    if (data && data.me) {
      //document.body.removeAttribute(IS_MEMBER_ATTRIBUTE)
      localStorage.setItem(
        MEMBERSHIP_STORAGE_KEY,
        String(checkRoles(data.me, ['member']))
      )
    }
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
      <Script
        id='hide-elements-if-member-script'
        dangerouslySetInnerHTML={{
          __html: `
          try {
            const value = localStorage.getItem("${MEMBERSHIP_STORAGE_KEY}");
            document.body.setAttribute("${IS_MEMBER_ATTRIBUTE}", value);
         } catch(e) {console.error(e)}
          `
        }}
      />
      {children}
    </MeContext.Provider>
  )
}

export default MeContextProvider

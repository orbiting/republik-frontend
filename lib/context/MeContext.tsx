import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo
} from 'react'
import NextHead from 'next/head'
import { ApolloError, useQuery } from '@apollo/client'
import { checkRoles, meQuery } from '../apollo/withMe'
import { css } from 'glamor'

const IS_MEMBER_ATTRIBUTE = 'data-is-member'
const MEMBERSHIP_STORAGE_KEY = 'is-member'

// Rule to hide elements while a statically generated page is fetching the active-user
css.global(`[${IS_MEMBER_ATTRIBUTE}="true"] [data-hide-for-member]`, {
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
  me: Me | null
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
  children: ReactNode
}

const MeContextProvider = ({ children }: Props) => {
  const { data, loading, error, refetch } = useQuery<MeResponse>(meQuery, {})

  const me = useMemo(() => {
    if (loading) return undefined
    if (data.me) return data.me

    return undefined
  }, [data])

  const isMember = useMemo(() => {
    return me && checkRoles(me, ['member'])
  }, [me])

  useEffect(() => {
    if (typeof localStorage === 'undefined' || loading) return

    document.documentElement.removeAttribute(IS_MEMBER_ATTRIBUTE)

    if (me && isMember) {
      localStorage.setItem(MEMBERSHIP_STORAGE_KEY, 'true')
    } else {
      localStorage.removeItem(MEMBERSHIP_STORAGE_KEY)
    }
  }, [me, isMember])

  return (
    <MeContext.Provider
      value={{
        me: me,
        meLoading: loading,
        meError: error,
        meRefetch: refetch,
        hasActiveMembership: !!me?.activeMembership,
        hasAccess: isMember
      }}
    >
      <NextHead>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if (localStorage.getItem("${MEMBERSHIP_STORAGE_KEY}"))document.documentElement.setAttribute("${IS_MEMBER_ATTRIBUTE}", "true")} catch(e) {console.error(e)}`
          }}
        />
      </NextHead>
      {children}
    </MeContext.Provider>
  )
}

export default MeContextProvider

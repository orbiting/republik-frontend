import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo
} from 'react'
import NextHead from 'next/head'
import Script from 'next/script'
import { ApolloError, useQuery } from '@apollo/client'
import { checkRoles, meQuery } from '../apollo/withMe'
import { css } from 'glamor'
import { getInitials } from '../../components/Frame/User'

const IS_MEMBER_ATTRIBUTE = 'data-is-member'
const MEMBERSHIP_STORAGE_KEY = 'is-member'

// Rule to hide elements while a statically generated page is fetching the active-user
css.global(`[${IS_MEMBER_ATTRIBUTE}="true"] [data-hide-if-member="true"]`, {
  display: 'none'
})

css.global('[data-show-if-member="true"]', {
  display: 'none'
})

css.global(`[${IS_MEMBER_ATTRIBUTE}="true"] [data-show-if-member="true"]`, {
  display: 'block'
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
    try {
      if (loading) return
      document.documentElement.removeAttribute(IS_MEMBER_ATTRIBUTE)

      if (me && isMember) {
        const value = me.portrait ?? getInitials(me)
        localStorage.setItem(MEMBERSHIP_STORAGE_KEY, value)
      } else {
        localStorage.removeItem(MEMBERSHIP_STORAGE_KEY)
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }, [loading, me, isMember])

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
            __html: `
              try{if (localStorage.getItem("${MEMBERSHIP_STORAGE_KEY}"))document.documentElement.setAttribute("${IS_MEMBER_ATTRIBUTE}", "true")} catch(e) {console.error(e)} 
            `
          }}
        />
      </NextHead>
      <Script
        id={''}
        dangerouslySetInnerHTML={{
          __html: `
            try{const a=localStorage.getItem("${MEMBERSHIP_STORAGE_KEY}");2<a.length?document.querySelector("[data-temporary-portrait]").setAttribute("src",decodeURI(a)):(document.querySelector("[data-temporary-initials]").textContent=a,document.querySelector("[data-temporary-portrait]").style.display="none")}catch(t){console.error(t)}
          `
        }}
      />
      {children}
    </MeContext.Provider>
  )
}

export default MeContextProvider

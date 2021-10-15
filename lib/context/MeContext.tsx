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

const HAS_ACTIVE_MEMBERSHIP_ATTRIBUTE = 'data-has-active-membership'
const HAS_ACTIVE_MEMBERSHIP_STORAGE_KEY = 'has-active-membership'

const MEMBER_PORTRAIT_ATTRIBUTE = 'data-member-portrait'
const MEMBER_PORTRAIT_STORAGE_KEY = 'member-portrait'

// Rule to hide elements while a statically generated page is fetching the active-user
css.global(
  `[${MEMBER_PORTRAIT_ATTRIBUTE}="true"] [data-hide-if-member="true"]`,
  {
    display: 'none'
  }
)

css.global('[data-show-if-member="true"]', {
  display: 'none'
})

css.global(
  `[${MEMBER_PORTRAIT_ATTRIBUTE}="true"] [data-show-if-member="true"]`,
  {
    display: 'block'
  }
)

css.global(
  `[${HAS_ACTIVE_MEMBERSHIP_ATTRIBUTE}="true"] [data-hide-if-active-membership="true"]`,
  {
    display: 'none'
  }
)

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
  isEditor: boolean
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

  const isMember = checkRoles(me, ['member'])
  const hasActiveMembership = !!me?.activeMembership

  useEffect(() => {
    if (loading) return
    document.documentElement.removeAttribute(MEMBER_PORTRAIT_ATTRIBUTE)
    document.documentElement.removeAttribute(HAS_ACTIVE_MEMBERSHIP_ATTRIBUTE)

    const portraitValue = me ? me.portrait ?? getInitials(me) : false

    try {
      if (portraitValue) {
        localStorage.setItem(MEMBER_PORTRAIT_STORAGE_KEY, portraitValue)
      } else {
        localStorage.removeItem(MEMBER_PORTRAIT_STORAGE_KEY)
      }

      if (hasActiveMembership) {
        localStorage.setItem(
          HAS_ACTIVE_MEMBERSHIP_STORAGE_KEY,
          String(hasActiveMembership)
        )
      } else {
        localStorage.removeItem(HAS_ACTIVE_MEMBERSHIP_STORAGE_KEY)
      }

      // eslint-disable-next-line no-empty
    } catch (e) {}
  }, [loading, me, isMember, hasActiveMembership])

  return (
    <MeContext.Provider
      value={{
        me: me,
        meLoading: loading,
        meError: error,
        meRefetch: refetch,
        hasActiveMembership,
        hasAccess: isMember,
        isEditor: checkRoles(me, ['editor'])
      }}
    >
      <NextHead>
        <script
          dangerouslySetInnerHTML={{
            __html: [
              'try{',
              `const value = localStorage.getItem("${HAS_ACTIVE_MEMBERSHIP_STORAGE_KEY}");`,
              `if (value && value === "true")`,
              `document.documentElement.setAttribute("${HAS_ACTIVE_MEMBERSHIP_ATTRIBUTE}", value);`,
              `if (localStorage.getItem("${MEMBER_PORTRAIT_STORAGE_KEY}"))`,
              `document.documentElement.setAttribute("${MEMBER_PORTRAIT_ATTRIBUTE}", "true");`,
              '} catch(e) {}'
            ].join('')
          }}
        />
      </NextHead>
      <Script
        id={'script-load-member-portrait'}
        dangerouslySetInnerHTML={{
          __html: [
            'try{',
            `const a=localStorage.getItem("${MEMBER_PORTRAIT_STORAGE_KEY}");`,
            '2<a.length',
            '?document.querySelector("[data-temporary-portrait]").setAttribute("src",decodeURI(a))',
            ':(document.querySelector("[data-temporary-initials]").textContent=a,document.querySelector("[data-temporary-portrait]").style.display="none")',
            '}catch(e){}'
          ].join('')
        }}
      />
      {children}
    </MeContext.Provider>
  )
}

export default MeContextProvider

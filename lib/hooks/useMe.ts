import { useQuery } from '@apollo/client'
import { checkRoles, meQuery } from '../apollo/withMe'
import { useEffect, useMemo } from 'react'

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

const useMe = () => {
  const { data, loading, error, refetch } = useQuery<MeResponse>(meQuery, {})

  const me = useMemo(() => {
    if (data) return data.me

    // TODO: Read data stored from last-login
    return undefined
  }, [data])

  useEffect(() => {
    // TODO: Store the result from me-query
  }, [data])

  return {
    me: me,
    meLoading: loading,
    meError: error,
    meRefetch: refetch,
    hasActiveMembership: !!me?.activeMembership,
    hasAccess: checkRoles(me, ['member'])
  }
}

export default useMe

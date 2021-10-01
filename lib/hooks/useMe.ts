import { useQuery } from '@apollo/client'
import { checkRoles, meQuery } from '../apollo/withMe'

type Me = {
  id: string
  username: string
  // First- and lastname
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

const useMe = () => {
  const { data, loading, error, refetch } = useQuery<Me>(meQuery)

  return {
    me: data,
    meLoading: loading,
    meError: error,
    meRefetch: refetch,
    hasActiveMembership: !!data?.activeMembership,
    hasAccess: checkRoles(data, ['member'])
  }
}

export default useMe

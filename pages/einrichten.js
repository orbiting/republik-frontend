import Onboarding from '../components/Onboarding/Page'

import { enforceMembership } from '../components/Auth/withMembership'

export default enforceMembership()(Onboarding)

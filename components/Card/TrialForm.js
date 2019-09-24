import TrialForm from '../Trial/Form'
import {
  TRIAL_CAMPAIGNS, TRIAL_CAMPAIGN
} from '../../lib/constants'
import { parseJSONObject } from '../../lib/safeJSON'

const trailCampaignes = parseJSONObject(TRIAL_CAMPAIGNS)

const trialAccessCampaignId = (trailCampaignes.wahltindaer && trailCampaignes.wahltindaer.accessCampaignId) || TRIAL_CAMPAIGN

export default () => (
  <TrialForm
    accessCampaignId={trialAccessCampaignId}
    narrow />
)

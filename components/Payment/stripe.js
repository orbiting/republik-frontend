import { loadStripe } from '@stripe/stripe-js/pure'
import memoize from 'lodash/memoize'

import { STRIPE_PUBLISHABLE_KEYS } from '../../lib/constants'
import { parseJSONObject } from '../../lib/safeJSON'

const publishableKeys = parseJSONObject(STRIPE_PUBLISHABLE_KEYS)

if (process.browser && !window.Stripe) {
  // since there is no unloading after checkout we disable advancedFraudSignals
  // - https://mtlynch.io/stripe-update/#support-library-unloading
  loadStripe.setLoadParameters({ advancedFraudSignals: false })
}

export const loadStripeForCompany = memoize(companyName => {
  return loadStripe(publishableKeys[companyName], {
    apiVersion: '2020-08-27',
    locale: 'de'
  })
})

import { loadStripe as pureLoadStripe } from '@stripe/stripe-js/pure'

import { STRIPE_PUBLISHABLE_KEY } from '../../lib/constants'

if (process.browser && !window.Stripe) {
  // since there is no unloading after checkout we disable advancedFraudSignals
  // - https://mtlynch.io/stripe-update/#support-library-unloading
  pureLoadStripe.setLoadParameters({ advancedFraudSignals: false })
}

export const loadStripe = stripePublishableKey => {
  return pureLoadStripe(stripePublishableKey || STRIPE_PUBLISHABLE_KEY, {
    apiVersion: '2020-08-27',
    locale: 'de'
  })
}

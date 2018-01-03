import loadScript from 'load-script'
import {
  STRIPE_PUBLISHABLE_KEY
} from '../../lib/constants'

let promise
export default () => {
  if (!promise) {
    promise = new Promise((resolve, reject) => {
      loadScript('https://js.stripe.com/v2/', (error) => {
        if (error) {
          reject(error)
          promise = undefined
          return
        }
        window.Stripe.setPublishableKey(STRIPE_PUBLISHABLE_KEY)
        resolve(window.Stripe)
      })
    })
  }
  return promise
}

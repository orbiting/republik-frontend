import { payload } from './utils/track'

let _paq
if (typeof window !== 'undefined') {
  _paq = window._paq = window._paq || []
}

const __DEV__ =
  typeof process !== 'undefined' && process.env.NODE_ENV === 'development'

const track = (...args) => {
  if (!_paq) {
    if (__DEV__) {
      throw new Error(
        "Can't use the imperative track api while server rendering"
      )
    }
    return
  }

  if (__DEV__) {
    console.log('track', ...args[0])
  }
  _paq.push(...args)
}

export default track

export const trackEvent = ([category, action, name, value]) => {
  track(['trackEvent', category, action, name, value])
  payload.record('events', [category, action, name, value])
}

export const trackEventOnClick = (
  [category, action, name, value],
  onClick
) => e => {
  trackEvent([category, action, name, value])

  if (
    e.currentTarget.nodeName === 'A' &&
    (e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      (e.nativeEvent && e.nativeEvent.which === 2))
  ) {
    // ignore click for new tab / new window behavior
    return
  }

  e.preventDefault()
  onClick(e)
}

import { useEffect } from 'react'
import createPersistedState from '../../lib/hooks/use-persisted-state'
import { useInNativeApp, postMessage } from '../../lib/withInNativeApp'

export const COLOR_SCHEME_KEY = 'republik-color-scheme'

export const usePersistedColorSchemeKey = createPersistedState(COLOR_SCHEME_KEY)
export const useColorSchemeKey = () => {
  const { inNativeApp, inNativeAppLegacy } = useInNativeApp()
  const inNewApp = inNativeApp && !inNativeAppLegacy
  const defaultKey = inNewApp ? 'auto' : 'light'
  const [key, set] = usePersistedColorSchemeKey()
  const currentKey = key || defaultKey

  useEffect(() => {
    if (!inNewApp) {
      return
    }
    postMessage({
      type: 'setColorScheme',
      colorSchemeKey: currentKey
    })
  }, [inNewApp, currentKey])

  return [currentKey, set, defaultKey]
}

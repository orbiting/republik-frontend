import createPersistedState from '../../lib/hooks/use-persisted-state'
import { useInNativeApp, postMessage } from '../../lib/withInNativeApp'

import { useColorContext } from '@project-r/styleguide'

export const COLOR_SCHEME_KEY = 'republik-color-scheme'

export const usePersistedColorSchemeKey = createPersistedState(COLOR_SCHEME_KEY)
export const useColorSchemeKey = () => {
  const { inNativeApp, inNativeAppLegacy } = useInNativeApp()
  const [colorScheme] = useColorContext()
  const inNewApp = inNativeApp && !inNativeAppLegacy
  const defaultKey = inNewApp && colorScheme.CSSVarSupport ? 'auto' : 'light'
  const [key, set] = usePersistedColorSchemeKey()

  const setWithNative = inNewApp
    ? key => {
        set(key)
        postMessage({
          type: 'setColorScheme',
          colorSchemeKey: key
        })
      }
    : set

  return [key || defaultKey, setWithNative, defaultKey]
}

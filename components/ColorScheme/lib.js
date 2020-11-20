import createPersistedState from '../../lib/hooks/use-persisted-state'

export const COLOR_SCHEME_KEY = 'republik-color-scheme'
// ToDo activating auto
// - rm custom useColorSchemeKey wrapper
const usePersistedColorSchemeKey = createPersistedState(COLOR_SCHEME_KEY)
export const useColorSchemeKey = () => {
  const [key, set] = usePersistedColorSchemeKey()
  return [key || 'light', set]
}

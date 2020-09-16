import createPersistedState from '../../lib/hooks/use-persisted-state'

export const COLOR_SCHEME_KEY = 'republik-color-scheme'
export const useColorSchemeKey = createPersistedState(COLOR_SCHEME_KEY)

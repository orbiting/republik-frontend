import createPersistedState from './hooks/use-persisted-state'

export const FONT_SIZE_KEY = 'republik-font-size'
export const DEFAULT_FONT_SIZE = 16
export const useFontSize = createPersistedState(FONT_SIZE_KEY)

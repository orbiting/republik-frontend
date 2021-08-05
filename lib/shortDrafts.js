import createPersistedState from './hooks/use-persisted-state'

export const SHORT_DRAFTS_KEY = 'republik-short-drafts'
export const useShortDrafts = createPersistedState(SHORT_DRAFTS_KEY)

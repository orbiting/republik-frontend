export const SUPPORTED_FILTERS = [
  {
    key: 'type',
    value: 'Document'
  },
  {
    key: 'hasAudio',
    value: 'true'
  },
  {
    key: 'type',
    value: 'User'
  },
  {
    key: 'type',
    value: 'Comment'
  }
]

export const SUPPORTED_SORT = [
  {
    key: 'relevance'
  },
  {
    key: 'publishedAt',
    directions: ['DESC', 'ASC']
  }
]

export const DEFAULT_AGGREGATION_KEYS = ['type', 'hasAudio']
export const DEFAULT_SORT = 'relevance'

export const QUERY_PARAM = 'q'
export const FILTER_KEY_PARAM = 'fkey'
export const FILTER_VALUE_PARAM = 'fvalue'
export const SORT_KEY_PARAM = 'skey'
export const SORT_DIRECTION_PARAM = 'sdir'
export const TRACKING_PARAM = 'tracking'

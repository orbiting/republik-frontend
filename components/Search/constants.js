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

export const SUPPORTED_SORT = {
  relevance: [],
  publishedAt: ['ASC', 'DESC']
}

export const DEFAULT_AGGREGATION_KEYS = ['type', 'hasAudio']

export const QUERY_PARAM = 'q'
export const FILTER_KEY_PARAM = 'fkey'
export const FILTER_VALUE_PARAM = 'fvalue'
export const SORT_KEY_PARAM = 'skey'
export const SORT_DIRECTION_PARAM = 'sdir'

import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import Filter from './Filter'

const aggregations = [
  {
    '__typename': 'SearchAggregation',
    'buckets': [
      {
        '__typename': 'Bucket',
        'count': 5,
        'label': '/~2c703e2e-3204-4d47-9971-f400c715c7f7',
        'value': '/~2c703e2e-3204-4d47-9971-f400c715c7f7'
      },
      {
        '__typename': 'Bucket',
        'count': 5,
        'label': '/~5b6da6a6-c9fa-4ebb-a020-8dc85258310e',
        'value': '/~5b6da6a6-c9fa-4ebb-a020-8dc85258310e'
      },
      {
        '__typename': 'Bucket',
        'count': 5,
        'label': '/~6ae2733e-1562-47b3-881c-88e9d3d28da9',
        'value': '/~6ae2733e-1562-47b3-881c-88e9d3d28da9'
      },
      {
        '__typename': 'Bucket',
        'count': 4,
        'label': '/~dd782b8d-4eae-4a05-80d8-494760d2d58a',
        'value': '/~dd782b8d-4eae-4a05-80d8-494760d2d58a'
      },
      {
        '__typename': 'Bucket',
        'count': 2,
        'label': '/~29c289e8-ad86-44a3-9836-4d9ffb3a924f',
        'value': '/~29c289e8-ad86-44a3-9836-4d9ffb3a924f'
      },
      {
        '__typename': 'Bucket',
        'count': 2,
        'label': '/~eca9ee2c-4678-4f63-8564-651293df2b97',
        'value': '/~eca9ee2c-4678-4f63-8564-651293df2b97'
      },
      {
        '__typename': 'Bucket',
        'count': 2,
        'label': '/~f24bd0bc-2dfd-4f98-880c-d74cd27f84a5',
        'value': '/~f24bd0bc-2dfd-4f98-880c-d74cd27f84a5'
      },
      {
        '__typename': 'Bucket',
        'count': 2,
        'label': 'https://www.republik.ch/crew',
        'value': 'https://www.republik.ch/crew'
      },
      {
        '__typename': 'Bucket',
        'count': 1,
        'label': '/~00051db6-0b8d-4808-9830-efbee0e4d2af',
        'value': '/~00051db6-0b8d-4808-9830-efbee0e4d2af'
      },
      {
        '__typename': 'Bucket',
        'count': 1,
        'label': '/~0736a885-a9c7-4c2f-aebb-b8f9d4b0c21e',
        'value': '/~0736a885-a9c7-4c2f-aebb-b8f9d4b0c21e'
      }
    ],
    'count': null,
    'key': 'userId',
    'label': 'Profile'
  },
  {
    '__typename': 'SearchAggregation',
    'buckets': null,
    'count': 0,
    'key': 'discussion',
    'label': 'Debatten'
  },
  {
    '__typename': 'SearchAggregation',
    'buckets': null,
    'count': 6,
    'key': 'hasVideo',
    'label': 'TV'
  },
  {
    '__typename': 'SearchAggregation',
    'buckets': null,
    'count': 3,
    'key': 'hasAudio',
    'label': 'zum hören'
  },
  {
    '__typename': 'SearchAggregation',
    'buckets': [
      {
        '__typename': 'Bucket',
        'count': 1,
        'label': 'kurz',
        'value': 'short'
      },
      {
        '__typename': 'Bucket',
        'count': 16,
        'label': 'mittellang',
        'value': 'medium'
      },
      {
        '__typename': 'Bucket',
        'count': 5,
        'label': 'erfreulich lang',
        'value': 'long'
      },
      {
        '__typename': 'Bucket',
        'count': 3,
        'label': 'halbes Buch',
        'value': 'epic'
      }
    ],
    'count': 25,
    'key': 'textLength',
    'label': 'Länge'
  },
  {
    '__typename': 'SearchAggregation',
    'buckets': null,
    'count': 2,
    'key': 'isSeriesEpisode',
    'label': 'Episode'
  },
  {
    '__typename': 'SearchAggregation',
    'buckets': null,
    'count': 0,
    'key': 'dossier',
    'label': 'Dossiers'
  },
  {
    '__typename': 'SearchAggregation',
    'buckets': null,
    'count': 5,
    'key': 'format',
    'label': 'Rubriken & Kolumnen'
  },
  {
    '__typename': 'SearchAggregation',
    'buckets': [],
    'count': null,
    'key': 'state',
    'label': 'state'
  },
  {
    '__typename': 'SearchAggregation',
    'buckets': [
      {
        '__typename': 'Bucket',
        'count': 24,
        'label': 'Artikel',
        'value': 'article'
      },
      {
        '__typename': 'Bucket',
        'count': 1,
        'label': 'Newsletter',
        'value': 'editorialNewsletter'
      }
    ],
    'count': null,
    'key': 'template',
    'label': 'Vorlage'
  },
  {
    '__typename': 'SearchAggregation',
    'buckets': null,
    'count': 0,
    'key': 'isSeriesMaster',
    'label': 'Serie'
  },
  {
    '__typename': 'SearchAggregation',
    'buckets': null,
    'count': 25,
    'key': 'feed',
    'label': 'Feed'
  },
  {
    '__typename': 'SearchAggregation',
    'buckets': [
      {
        '__typename': 'Bucket',
        'count': 25,
        'label': 'Artikel',
        'value': 'Document'
      },
      {
        '__typename': 'Bucket',
        'count': 21,
        'label': 'Debattenbeiträge',
        'value': 'Comment'
      },
      {
        '__typename': 'Bucket',
        'count': 1,
        'label': 'Profile',
        'value': 'User'
      }
    ],
    'count': null,
    'key': 'type',
    'label': 'Informationsarten'
  },
  {
    '__typename': 'SearchAggregation',
    'buckets': null,
    'count': 3,
    'key': 'audioSource',
    'label': 'vorgelesene Artikel'
  }
]

const filters = [
  {
    key: 'template',
    value: 'article'
  },
  {
    key: 'textLength',
    value: 'short'
  }
]

storiesOf('Search/Results', module)
  .add('Filter', () =>
    <Filter
      aggregations={aggregations}
      filters={filters}
      loadingFilters={false}
      onClickHandler={action('click')}
    />
  )

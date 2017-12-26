import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import withT from '../../lib/withT'
import { errorToString } from '../../lib/utils/errors'

import {
  Field
} from '@project-r/styleguide'

const diacritics = [
  {base: 'a', letters: ['ä', 'â', 'à']},
  {base: 'c', letters: ['ç']},
  {base: 'e', letters: ['é', 'ê', 'è', 'ë']},
  {base: 'i', letters: ['î', 'ï']},
  {base: 'o', letters: ['ö', 'ô']},
  {base: 'u', letters: ['ü', 'ù', 'û']},
  {base: 'ss', letters: ['ß']}
]

const diacriticsMap = diacritics.reduce(
  (map, diacritic) => {
    diacritic.letters.forEach(letter => {
      map[letter] = diacritic.base
    })
    return map
  },
  {}
)

export const toUsername = string => string
  .toLowerCase()
  .replace(/[^\u0000-\u007E]/g, a => diacriticsMap[a] || a)
  .replace(/[^.0-9a-z]+/g, ' ')
  .trim()
  .replace(/\s+/g, '.')

const query = gql`
query checkUsername($value: String) {
  checkUsername(username: $value)
}
`

const UsernameField = compose(
  withT,
  graphql(query, {
    options: ({value}) => {
      return {
        errorPolicy: 'all',
        variables: {
          value
        }
      }
    },
    props: ({ data, ownProps: { t } }) => {
      return {
        label: t('profile/username/label'),
        error: data.error
          ? errorToString(data.error)
          : ''
      }
    }
  })
)(Field)

export default UsernameField

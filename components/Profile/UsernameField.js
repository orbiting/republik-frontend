import React, { Component } from 'react'
import { compose, withApollo } from 'react-apollo'
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

class UsernameField extends Component {
  constructor (...args) {
    super(...args)
    this.state = {}
  }
  check () {
    const { client, value } = this.props
    client
      .query({
        query,
        variables: { value }
      })
      .then(({ data }) => {
        this.setState({error: undefined})
      })
      .catch(error => {
        this.setState({
          error: errorToString(error)
        })
      })
  }
  componentWillMount () {
    this.check()
  }
  componentDidUpdate (prevProps) {
    if (prevProps.value !== this.props.value) {
      this.check()
    }
  }
  render () {
    const { t, client, ...props } = this.props
    const { error } = this.state

    return <Field
      label={t('profile/username/label')}
      error={error}
      {...props} />
  }
}

// TMP: Waiting for fix:
// - https://github.com/apollographql/apollo-client/issues/2703
// - once ready: rm class and replace with below
// const UsernameField = compose(
//   withT,
//   graphql(query, {
//     options: ({value}) => {
//       return {
//         errorPolicy: 'all',
//         variables: {
//           value
//         }
//       }
//     },
//     props: ({ data, ownProps: { t } }) => {
//       return {
//         label: t('profile/username/label'),
//         error: data.error
//           ? errorToString(data.error)
//           : ''
//       }
//     }
//   })
// )(Field)

export default compose(
  withT,
  withApollo
)(UsernameField)

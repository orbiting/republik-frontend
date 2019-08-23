import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import { css } from 'glamor'
import gql from 'graphql-tag'
import Link from '../Link/Href'
import withT from '../../lib/withT'

import {
  Loader,
  FormatTag,
  colors,
  fontStyles,
  mediaQueries,
  Interaction
} from '@project-r/styleguide'
const { P } = Interaction

const styles = {
  h2: css({
    ...fontStyles.sansSerifRegular13,
    color: '#979797',
    margin: '0 0 15px 0',
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular16,
      margin: '12px 0 15px 0'
    }
  }),
  section: css({
    marginBottom: '25px',
    [mediaQueries.mUp]: {
      marginBottom: '30px',
      '& + &': {
        borderTop: `1px solid ${colors.divider}`
      }
    }
  }),
  link: css({
    color: 'inherit',
    textDecoration: 'none'
  })
}

const getQuestionnairesQuery = gql`
  query getQuestionnaires {
    questionnaires {
      id
      slug
    }
  }
`

class Page extends Component {
  render () {
    const { data: { loading, error, questionnaires }, t } = this.props
    return (
      <Loader
        loading={loading}
        error={error}
        render={() => {
          return (
            <Fragment>
              {questionnaires.map(({ slug }) => (
                <P>{slug}</P>
              ))}
            </Fragment>
          )
        }}
      />
    )
  }
}

export default compose(
  withT,
  graphql(getQuestionnairesQuery)
)(Page)

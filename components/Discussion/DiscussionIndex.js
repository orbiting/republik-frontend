import React, { Fragment } from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { A, Interaction } from '@project-r/styleguide'
import { Link } from '../../lib/routes'
import withT from '../../lib/withT'

import HrefLink from '../Link/Href'
import Loader from '../Loader'
import Meta from '../Frame/Meta'
import List, { Item } from '../List'

const DiscussionIndex = ({ t, data: { loading, error, discussions } }) => (
  <Loader
    loading={loading}
    error={error}
    render={() => (
      <Fragment>
        <Interaction.H1>
          {t('discussion/pageTitle')}
        </Interaction.H1>
        <Meta data={{ title: t('discussion/pageTitle') }} />
        <List>
          {discussions.filter(d => d.title).map((d, i) => {
            const children = <A>{d.title || d.id}</A>
            let link
            if (d.documentPath) {
              link = <HrefLink href={d.documentPath} passHref>
                {children}
              </HrefLink>
            } else {
              link = <Link passHref route='discussion' params={{ id: d.id }}>
                {children}
              </Link>
            }
            return (
              <Item key={i}>
                {link}
              </Item>
            )
          })}
        </List>
      </Fragment>
    )} />
)

const discussionsQuery = gql`
query discussions {
  discussions {
    id
    title
    documentPath
  }
}
`

export default compose(
  withT,
  graphql(discussionsQuery)
)(DiscussionIndex)

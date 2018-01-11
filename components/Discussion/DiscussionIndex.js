import React, {PureComponent} from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import {H1, H2, A, Field, Button} from '@project-r/styleguide'
import { Link } from '../../lib/routes'
import withT from '../../lib/withT'

import HrefLink from '../Link/Href'

class DiscussionIndex extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      title: '',
      maxLength: undefined,
      minInterval: undefined
    }

    this.createDiscussion = () => {
      const {title, maxLength, minInterval} = this.state
      this.props.createDiscussion(title, maxLength, minInterval)
      this.setState({title: '', maxLength: undefined, minInterval: undefined})
    }
  }

  render () {
    const {t, data: {loading, error, discussions}} = this.props
    const {title, maxLength, minInterval} = this.state

    if (loading || error) {
      return null
    } else {
      return (
        <div>
          <H1>{t('discussion/pageTitle')}</H1>

          <H2>Neue Diskussion erstellen</H2>
          <div>
            <Field
              label='Titel'
              value={title}
              onChange={(_, title) => this.setState({title})}
            />
            <Field
              label='Maximale länge'
              value={maxLength}
              onChange={(_, maxLength) => this.setState({maxLength: +maxLength})}
            />
            <Field
              label='Minimales interval (sekunden)'
              value={minInterval}
              onChange={(_, minInterval) => this.setState({minInterval: +minInterval})}
            />
            <Button primary disabled={title === ''} onClick={this.createDiscussion}>Erstellen</Button>
          </div>

          <H2>Alle Diskussionen</H2>
          {discussions.map((d, i) => {
            const children = <A>{d.title || d.id}</A>
            let link
            if (d.documentPath) {
              link = <HrefLink href={d.documentPath} passHref>
                {children}
              </HrefLink>
            } else {
              link = <Link passHref route='discussion' params={{id: d.id}}>
                {children}
              </Link>
            }
            return (
              <div key={i}>
                {link}
              </div>
            )
          })}
        </div>
      )
    }
  }
}

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
graphql(discussionsQuery),
graphql(gql`
mutation createDiscussion($title: String!, $maxLength: Int, $minInterval: Int) {
  createDiscussion(title: $title, maxLength: $maxLength, minInterval: $minInterval, anonymity: ALLOWED)
}
`, {
  props: ({mutate}) => ({
    createDiscussion: (title, maxLength, minInterval) => {
      mutate({
        variables: {
          title,
          maxLength,
          minInterval: minInterval === undefined ? undefined : minInterval * 1000
        },
        update: (proxy, {data: {createDiscussion}}) => {
          const data = proxy.readQuery({query: discussionsQuery})
          data.discussions.push({__typename: 'Discussion', id: createDiscussion, title})
          proxy.writeQuery({query: discussionsQuery, data})
        }
      })
    }
  })
}))(DiscussionIndex)

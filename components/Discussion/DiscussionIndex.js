import React, {PureComponent} from 'react'
import {compose} from 'redux'
import {gql, graphql} from 'react-apollo'
import {H1, H2, Field, Button} from '@project-r/styleguide'
import {Link} from '../../lib/routes'
import withT from '../../lib/withT'

class DiscussionIndex extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {title: ''}
    this.createDiscussion = (title) => {
      this.props.createDiscussion(title)
      this.setState({title: ''})
    }
  }

  render () {
    const {t, data: {loading, error, discussions}} = this.props
    const {title} = this.state

    if (loading || error) {
      return null
    } else {
      return (
        <div>
          <H1>{t('discussion/pageTitle')}</H1>

          <H2>Neue Diskussion erstellen</H2>
          <div style={{margin: '20px 0', display: 'flex'}}>
            <Field
              label='Titel'
              value={title}
              onChange={(_, title) => this.setState({title})}
            />
            <Button style={{marginLeft: 20}} primary onClick={() => { this.createDiscussion(title) }}>Erstellen</Button>
          </div>

          <H2>Alle Diskussionen</H2>
          {discussions.map((d, i) => (
            <div key={i}>
              <Link route='discussion' params={{id: d.id}}>
                {d.title || d.id}
              </Link>
            </div>
          ))}
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
  }
}
`

export default compose(
withT,
graphql(discussionsQuery),
graphql(gql`
mutation createDiscussion($title: String!) {
  createDiscussion(title: $title, anonymity: ALLOWED)
}
`, {
  props: ({mutate}) => ({
    createDiscussion: (title) => {
      mutate({
        variables: {title},
        update: (proxy, {data: {createDiscussion}}) => {
          const data = proxy.readQuery({query: discussionsQuery})
          data.discussions.push({__typename: 'Discussion', id: createDiscussion, title})
          proxy.writeQuery({query: discussionsQuery, data})
        }
      })
    }
  })
}))(DiscussionIndex)

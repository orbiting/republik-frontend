import React from 'react'
import { compose } from 'react-apollo'
import Front from '../components/Front'
import withT from '../lib/withT'

import { Interaction, Editorial, TitleBlock } from '@project-r/styleguide'

const MetaPage = ({ t }) => {
  return <Front
    renderBefore={meta => (
      <div style={{ marginTop: 20 }}>
        <TitleBlock center>
          <Interaction.Headline>{meta.title}</Interaction.Headline>
          <Editorial.Lead>{meta.description}</Editorial.Lead>
        </TitleBlock>
      </div>
    )}
    after={
      null
    }
    path='/verlag' />
}

export default compose(
  withT
)(MetaPage)

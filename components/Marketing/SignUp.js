import React from 'react'

import SignIn from '../Auth/SignIn'

import withMe from '../../lib/apollo/withMe'
import { Interaction } from '@project-r/styleguide'

export default withMe(({ me }) =>
  <div>
    {!me &&
      <div>
        <Interaction.P>
          Journalismus kostet. Werde ein Teil der Republik:
        </Interaction.P>
        <br />
        <SignIn label='Registrieren' />
      </div>}
  </div>
)

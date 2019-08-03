import React, { Fragment } from 'react'

import { Interaction, linkRule } from '@project-r/styleguide'

import { Link } from '../../lib/routes'

const { H2, P } = Interaction

export default () =>
  <Fragment>
    <H2>Konto einrichten</H2>
    <P>
      Mit dem Wichtigsten vorab hilft Ihnen dieser kurze <Link route='onboarding'>
        <a {...linkRule}>
          Einrichtungs-Assistent
        </a>
      </Link>.
    </P>
  </Fragment>

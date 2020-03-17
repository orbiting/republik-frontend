import React from 'react'
import { Interaction, Center, linkRule } from '@project-r/styleguide'
import SubscribeDocuments from './SubscribeDocumentCheckbox'
import { Link } from '../../lib/routes'

export default () => {
  return (
    <>
      <Center>
        <Interaction.H1 style={{ marginBottom: 40 }}>Settings</Interaction.H1>

        <section>
          <Interaction.H2>Meine Formate</Interaction.H2>
          <SubscribeDocuments withCount />
          <Link route='sections' passHref>
            <a {...linkRule}>Weitere Formate entdecken und abonnieren</a>
          </Link>
        </section>
      </Center>
    </>
  )
}

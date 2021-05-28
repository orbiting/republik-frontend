import React from 'react'
import Frame from '../components/Frame'
import { Editorial, Interaction } from '@project-r/styleguide'

import LicensesJSON from '../licenses.json'
import PackageJSON from '../package.json'
import Table from '../components/Table/Table'

const OpenSourcePage = ({ dependencies }) => {
  const meta = {
    title: 'Open Source',
    description: ''
  }

  const headers = [
    {
      label: 'Package',
      key: 'name',
      render: item => {
        if (item.repository) {
          return (
            <Editorial.A href={item.repository} target='_blank'>
              {item.name}
            </Editorial.A>
          )
        }
        return item.name
      }
    },
    {
      label: 'Author',
      key: 'publisher'
    },
    {
      label: 'Lizenz',
      key: 'license'
    }
  ]

  return (
    <Frame meta={meta}>
      <Editorial.Headline>Open Source</Editorial.Headline>
      <Editorial.Lead>
        Wie die Repulik Open Source Projekte nutzt und selbst Projekte
        veröffentlicht.
      </Editorial.Lead>
      <Editorial.P>
        Text über das Prinzip von Open Source und wie es in der Republik gelebt
        wird.
      </Editorial.P>
      <Editorial.Subhead>Die Webseite</Editorial.Subhead>
      <Interaction.P>
        <Editorial.A>React</Editorial.A> und <Editorial.A>Next.js</Editorial.A>{' '}
        bilden das Fundament unserer Webseite. Das Styling der Webseite wird
        mittels unseres hauseigenen{' '}
        <Editorial.A href='https://styleguide.republik.ch/'>
          Styleguides
        </Editorial.A>{' '}
        vorgenommen, in welchem wiederum{' '}
        <Editorial.A href='https://github.com/threepointone/glamor'>
          Glamour
        </Editorial.A>{' '}
        eingesetzt wird, um das Styling in die Seite zu laden.
      </Interaction.P>
      <Editorial.Subhead>Die Server</Editorial.Subhead>
      <Interaction.P>
        Text zu den verwendeten Technologien in der Webseite
      </Interaction.P>
      <Editorial.Subhead>Unsere Open Source Packages</Editorial.Subhead>
      <Editorial.P>Liste unserer Packages</Editorial.P>
      {dependencies && (
        <>
          <Editorial.Subhead>Verwendete Packages</Editorial.Subhead>
          <Table headers={headers} data={dependencies} />
        </>
      )}
    </Frame>
  )
}

export const getStaticProps = async () => {
  const dependencies = Object.keys(LicensesJSON).map(dependency => {
    const [name] = dependency.split(
      dependency.charAt(0) === '@' ? /@[0-9.]/ : /@/
    )
    const data = LicensesJSON[dependency]

    return {
      name: name,
      repository: data.repository || null,
      license: data.licenses || null,
      publisher: data.publisher || null
    }
  })

  const packageJSONDependencies = {
    ...PackageJSON.dependencies,
    ...PackageJSON.devDependencies
  }

  const filteredDependencies = dependencies.filter(dependency =>
    Object.keys(packageJSONDependencies).some(key => key === dependency.name)
  )

  return {
    props: {
      dependencies: filteredDependencies
    }
  }
}

export default OpenSourcePage

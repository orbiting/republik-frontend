import { ElementConfigI } from '../custom-types'
import React, { Attributes, ReactElement } from 'react'
// @ts-ignore
import { Embed } from '@project-r/styleguide/lib/components/Discussion/Internal/Comment/Embed'

const Component: React.FC<{
  attributes: Attributes
  children: ReactElement
}> = ({ attributes, children }) => (
  <div {...attributes} contentEditable={false}>
    <Embed
      comment={{
        embed: {
          url: 'https://republik.ch/2020/01/17/das-perfekte-bordell',
          title: 'Das perfekte Bordell',
          description:
            'Sexarbeiterinnen werden bis heute an den Rand der Gesellschaft gedrängt, bemitleidet oder gar verachtet. Es ist höchste Zeit für einen neuen Umgang mit der Prostitution.',
          imageUrl: '/static/bordell.jpeg',
          imageAlt: 'Stadtbordell',
          siteName: 'republik.ch',
          siteImageUrl: '/static/apple-touch-icon.png',
          __typename: 'LinkPreview'
        }
      }}
    />
    {children}
  </div>
)

export const config: ElementConfigI = {
  Component,
  attrs: {
    editUi: true
  }
}

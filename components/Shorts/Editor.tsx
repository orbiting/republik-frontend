import React, { useState } from 'react'
// @ts-ignore
import { Center } from '@project-r/styleguide'
import EditorApp from './components/editor'
import { TemplatePicker } from './components/templates'
import { CustomElement } from './components/custom-types'

const Editor: React.FC = () => {
  const [template, setTemplate] = useState<CustomElement[]>()

  return (
    <Center>
      {template ? (
        <EditorApp template={template} />
      ) : (
        <TemplatePicker setTemplate={setTemplate} />
      )}
    </Center>
  )
}

export default Editor

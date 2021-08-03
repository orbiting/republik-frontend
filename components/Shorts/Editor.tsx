import React, { useState } from 'react'
// @ts-ignore
import { Center } from '@project-r/styleguide'
import { css } from 'glamor'
import EditorApp from './components/editor'
import { TemplatePicker } from './components/templates'
import { CustomElement } from './components/custom-types'
// @ts-ignore
import { mediaQueries } from '@project-r/styleguide'

const styles = {
  container: css({
    paddingTop: 40,
    paddingBottom: 60,
    [mediaQueries.mUp]: {
      paddingTop: 80,
      paddingBottom: 120
    }
  })
}

const Editor: React.FC = () => {
  const [template, setTemplate] = useState<CustomElement[]>()

  return (
    <Center {...styles.container}>
      {template ? (
        <EditorApp template={template} />
      ) : (
        <TemplatePicker setTemplate={setTemplate} />
      )}
    </Center>
  )
}

export default Editor

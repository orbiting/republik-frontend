import React, { useState } from 'react'
import { css } from 'glamor'
// @ts-ignore
import { mediaQueries, Center } from '@project-r/styleguide'
import EditorApp from './components/editor'
import { TemplatePicker } from './components/templates'
import { CustomElement } from './components/custom-types'
import Drafts from './Drafts'

const styles = {
  container: css({
    paddingTop: 20,
    paddingBottom: 60,
    [mediaQueries.mUp]: {
      paddingTop: 40,
      paddingBottom: 120
    }
  })
}

const Editor: React.FC = () => {
  const [template, setTemplate] = useState<CustomElement[]>()

  return (
    <Center>
      {template ? (
        <EditorApp template={template} reset={() => setTemplate(undefined)} />
      ) : (
        <div {...styles.container}>
          <TemplatePicker setTemplate={setTemplate} />
          <Drafts setTemplate={setTemplate} />
        </div>
      )}
    </Center>
  )
}

export default Editor

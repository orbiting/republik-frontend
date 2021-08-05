import React, { useState } from 'react'
// @ts-ignore
import { Center } from '@project-r/styleguide'
import { css } from 'glamor'
import EditorApp from './components/editor'
import { TemplatePicker } from './components/templates'
import { CustomElement, DraftI } from './components/custom-types'
// @ts-ignore
import { mediaQueries, Interaction, A } from '@project-r/styleguide'
import { useShortDrafts } from '../../lib/shortDrafts'
import { swissTime } from '../../lib/utils/format'

const styles = {
  container: css({
    paddingTop: 40,
    paddingBottom: 60,
    [mediaQueries.mUp]: {
      paddingTop: 80,
      paddingBottom: 120
    }
  }),
  drafts: css({
    paddingTop: 80,
    [mediaQueries.mUp]: {
      paddingTop: 120
    }
  })
}

const formatDateTime = swissTime.format('%d.%m.%Y %H:%M')

const Drafts: React.FC<{ setTemplate: (t: CustomElement[]) => void }> = ({
  setTemplate
}) => {
  const [drafts] = useShortDrafts([])
  if (!drafts.length) return null
  return (
    <div {...styles.drafts}>
      <Interaction.H2 style={{ textAlign: 'center' }}>Drafts</Interaction.H2>
      <div>
        {(drafts as DraftI[])
          .sort((d1, d2) => new Date(d2.date) - new Date(d1.date))
          .map(draft => (
            <div key={draft.key} style={{ margin: '10px 0' }}>
              <A
                href='#'
                key={draft.key}
                onClick={() => setTemplate(draft.value)}
              >
                {draft.key}
              </A>
              <span style={{ float: 'right' }}>
                {formatDateTime(new Date(draft.date))}
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}

const Editor: React.FC = () => {
  const [template, setTemplate] = useState<CustomElement[]>()

  return (
    <Center {...styles.container}>
      {template ? (
        <EditorApp template={template} reset={() => setTemplate(undefined)} />
      ) : (
        <>
          <TemplatePicker setTemplate={setTemplate} />
          <Drafts setTemplate={setTemplate} />
        </>
      )}
    </Center>
  )
}

export default Editor

import React from 'react'
// @ts-ignore
import { css } from 'glamor'
// @ts-ignore
import { mediaQueries, Interaction, A } from '@project-r/styleguide'
import { CustomElement, DraftI } from './components/custom-types'
import { useShortDrafts } from '../../lib/shortDrafts'
import { swissTime } from '../../lib/utils/format'

const styles = {
  drafts: css({
    paddingTop: 40,
    [mediaQueries.mUp]: {
      paddingTop: 80
    }
  }),
  draftsTitle: css({
    marginBottom: 20,
    [mediaQueries.mUp]: {
      marginBottom: 40
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
      <Interaction.H2 {...styles.draftsTitle}>Drafts</Interaction.H2>
      <div>
        {(drafts as DraftI[])
          .sort((d1, d2) => +new Date(d2.date) - +new Date(d1.date))
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

export default Drafts

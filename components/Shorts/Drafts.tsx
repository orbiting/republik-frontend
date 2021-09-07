import React, { useMemo } from 'react'
// @ts-ignore
import { css } from 'glamor'
// @ts-ignore
import { Interaction, A, useColorContext, mediaQueries } from '@project-r/styleguide'
import { CustomElement, DraftI } from './components/custom-types'
import { useShortDrafts } from '../../lib/shortDrafts'
import { swissTime } from '../../lib/utils/format'

const styles = {
  container: css({
    padding: 40
  })
}

const formatDateTime = swissTime.format('%d.%m.%Y %H:%M')

const Drafts: React.FC<{ setTemplate: (t: CustomElement[]) => void }> = ({
  setTemplate
}) => {
  const [drafts] = useShortDrafts([])
  const [colorScheme] = useColorContext()

  const rowRule = useMemo(
    () =>
      css({
        [mediaQueries.mUp]: {
          '&:nth-child(even)': {
            backgroundColor: colorScheme.getCSSColor('hover')
          }
        }
      }),
    [colorScheme]
  )

  if (!drafts.length) return null
  return (
    <>
      <Interaction.P>Drafts</Interaction.P>
      {(drafts as DraftI[])
        .sort((d1, d2) => +new Date(d2.date) - +new Date(d1.date))
        .map(draft => (
          <div key={draft.key} style={{ margin: '10px 0' }} {...rowRule}>
            <A
              href='#'
              key={draft.key}
              onClick={() => setTemplate(draft.value)}
            >
              {draft.key}
            </A>
          </div>
        ))}
    </>
  )
}

export default Drafts

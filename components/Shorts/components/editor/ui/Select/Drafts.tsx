import React, { useMemo } from 'react'
// @ts-ignore
import { css } from 'glamor'
import {
  Interaction,
  A,
  useColorContext,
  plainButtonRule
  // @ts-ignore
} from '@project-r/styleguide'
import { CustomElement, DraftI } from '../../../custom-types'
import { useShortDrafts } from '../../../../../../lib/shortDrafts'
import { MdClose } from '@react-icons/all-files/md/MdClose'

const styles = {
  container: css({
    paddingTop: 30
  }),
  row: css({
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
    justifyContent: 'space-between'
  }),
  link: css({
    color: 'inherit',
    textDecoration: 'underline',
    '&:visited': {
      color: 'inherit'
    }
  }),
  delete: css({
    marginRight: 8
  })
}

const Drafts: React.FC<{
  setInitValue: (t: CustomElement[]) => void
  setLocalStorageId: (id: string) => void
}> = ({ setInitValue, setLocalStorageId }) => {
  const [drafts, setDrafts] = useShortDrafts([])
  const [colorScheme] = useColorContext()

  const rowRule = useMemo(
    () =>
      css({
        '&:nth-child(even)': {
          backgroundColor: colorScheme.getCSSColor('hover')
        }
      }),
    [colorScheme]
  )

  if (!drafts.length) return null
  return (
    <div {...styles.container}>
      <Interaction.H3>Drafts</Interaction.H3>
      {(drafts as DraftI[])
        .sort((d1, d2) => d1.title.localeCompare(d2.title))
        .map(draft => (
          <div key={draft.id} {...rowRule} {...styles.row}>
            <A
              href='#'
              key={draft.id}
              onClick={() => {
                setInitValue(draft.value)
                setLocalStorageId(draft.id)
              }}
              {...styles.link}
            >
              {draft.title}
            </A>
            <button
              {...plainButtonRule}
              {...styles.delete}
              onClick={() =>
                setDrafts(drafts.filter((d: DraftI) => d.id !== draft.id))
              }
            >
              <MdClose />
            </button>
          </div>
        ))}
    </div>
  )
}

export default Drafts

import React, { useEffect } from 'react'
// @ts-ignore
import { Button, A, Interaction, mediaQueries } from '@project-r/styleguide'
import { css } from 'glamor'
import { Descendant, Node } from 'slate'
import { useShortDrafts } from '../../../../../lib/shortDrafts'
import { DraftI } from '../../custom-types'

const styles = {
  buttons: css({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    [mediaQueries.mUp]: {
      gridTemplateColumns: 'repeat(4, 1fr)',
      marginTop: 80
    }
  })
}

const getKey = (value: Descendant[], drafts: DraftI[]): string => {
  const title = (value.length && Node.string(value[0])) || 'Undefined'
  const duplicates = drafts.filter(d => d.key.split('-')[0] === title).length
  return `${title}${duplicates ? '-' + duplicates : ''}`
}

const Actions: React.FC<{ value: Descendant[]; reset: () => void }> = ({
  value,
  reset
}) => {
  const [drafts, setDrafts] = useShortDrafts([])
  return (
    <div {...styles.buttons}>
      <Button
        onClick={() => {
          reset()
        }}
      >
        Submit
      </Button>
      <Interaction.P style={{ marginLeft: 30 }}>
        <A
          href='#copy-settings'
          onClick={() => {
            setDrafts(
              drafts.concat({
                key: getKey(value, drafts),
                date: new Date(),
                value
              })
            )
            setTimeout(reset)
          }}
        >
          Save as draft
        </A>
      </Interaction.P>
    </div>
  )
}

export default Actions

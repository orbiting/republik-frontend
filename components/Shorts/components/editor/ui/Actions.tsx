import React from 'react'
// @ts-ignore
import { Button, A, Interaction, mediaQueries } from '@project-r/styleguide'
import { css } from 'glamor'
import { Descendant } from "slate";

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

const Actions: React.FC<{ value: Descendant[] }> = ({ value }) => {
  return (
    <div {...styles.buttons}>
      <Button onClick={() => undefined}>Submit</Button>
      <Interaction.P style={{ marginLeft: 30 }}>
        <A href='#copy-settings' onClick={() => undefined}>
          Save as draft
        </A>
      </Interaction.P>
    </div>
  )
}

export default Actions

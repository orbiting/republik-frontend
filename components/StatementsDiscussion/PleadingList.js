import React from 'react'
import PleaComment from './PleaComment'
import { css } from 'glamor'
import ColorContextHelper from './helpers/ColorContextHelper'
import withT from '../../lib/withT'

const styles = {
  wrapper: css({
    '& > div:not(:last-child)': {
      marginBottom: '2rem'
    }
  })
}

const PleadingList = ({ pleadings, tagMappings, t, actions }) => (
  <ColorContextHelper tagMappings={tagMappings}>
    <div {...styles.wrapper}>
      {pleadings?.length > 0 &&
        pleadings.map(pleading => (
          <div key={pleading.id}>
            <PleaComment
              comment={pleading}
              tagMappings={tagMappings}
              t={t}
              actions={actions}
            />
          </div>
        ))}
    </div>
  </ColorContextHelper>
)

export default withT(PleadingList)

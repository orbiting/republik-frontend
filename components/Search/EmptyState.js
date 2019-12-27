import React from 'react'
import { compose } from 'react-apollo'
import { css } from 'glamor'
import { fontStyles, mediaQueries, RawHtml } from '@project-r/styleguide'
import withT from '../../lib/withT'

const styles = css({
  ...fontStyles.sansSerifRegular16,
  [mediaQueries.mUp]: {
    ...fontStyles.sansSerifRegular19
  }
})

export default compose(withT)(({ t }) => (
  <div {...styles}>
    <RawHtml
      dangerouslySetInnerHTML={{
        __html: t('search/results/empty')
      }}
    />
  </div>
))

import React, { Fragment, useState } from 'react'
import FontSizeOverlay from './Overlay'
import IconLink from '../IconLink'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import { colors } from '@project-r/styleguide'

const FontSizeAdjust = ({ t, style }) => {
  const [showOverlay, setOverlay] = useState(false)

  const fontSizeIcon = {
    icon: 'fontSize',
    href: '',
    onClick: e => {
      e.preventDefault()
      setOverlay(!showOverlay)
    },
    title: t('article/actionbar/fontSize/title')
  }

  return <Fragment>
    <IconLink style={style} fill={colors.text} {...fontSizeIcon} />
    {showOverlay && (
      <FontSizeOverlay onClose={() => setOverlay(false)} />
    )}
  </Fragment>
}

export default compose(withT)(FontSizeAdjust)

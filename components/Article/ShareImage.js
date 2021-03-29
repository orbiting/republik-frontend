import React, { Fragment } from 'react'
import Head from 'next/head'
import { ShareImagePreview } from '@project-r/styleguide'
import { capitalize } from '../../lib/utils/format'

const ShareImage = ({ meta, socialKey }) => {
  const getValue = metaKey => {
    const value = meta[`${socialKey}${capitalize(metaKey)}`]
    return value === null ? undefined : value
  }

  return (
    <Fragment>
      <Head>
        <meta name='robots' content='noindex' />
      </Head>
      <ShareImagePreview
        format={meta?.format?.meta}
        text={getValue('text')}
        fontSize={getValue('fontSize')}
        coloredBackground={getValue('coloredBackground')}
        illuBackground={getValue('illuBackground')}
        textPosition={getValue('textPosition')}
        customFontStyle={getValue('customFontStyle')}
      />
    </Fragment>
  )
}
export default ShareImage

import React, { Fragment } from 'react'
import Head from 'next/head'
import { ShareImagePreview } from '@project-r/styleguide'

const ShareImage = ({ meta, socialKey }) => {
  return (
    <Fragment>
      <Head>
        <meta name='robots' content='noindex' />
      </Head>
      <ShareImagePreview
        format={meta?.format?.meta}
        text={meta[`${socialKey}Text`]}
        fontSize={meta[`${socialKey}FontSize`]}
        coloredBackground={meta[`${socialKey}ColoredBackground`]}
        illuBackground={meta[`${socialKey}IlluBackground`]}
        textPosition={meta[`${socialKey}TextPosition`]}
        customFontStyle={meta[`${socialKey}CustomFontStyle`]}
      />
    </Fragment>
  )
}
export default ShareImage

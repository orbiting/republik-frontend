import React from 'react'
import { compose } from 'react-apollo'
import Frame from '../components/Frame'
import Page from '../components/About/Page'
import withT from '../lib/withT'

import { PUBLIC_BASE_URL, CDN_FRONTEND_BASE_URL } from '../lib/constants'

const AboutPage = ({ t }) => {
  const meta = {
    title: 'Das sind wir',
    description:
      'Die Republik ist ein digitales Magazin für Politik, Wirtschaft, Gesellschaft und Kultur. Finanziert von seinen Leserinnen und Lesern.',
    image: `${CDN_FRONTEND_BASE_URL}/static/team/bern.jpg`,
    url: `${PUBLIC_BASE_URL}/about`
  }
  return (
    <Frame raw meta={meta} colorSchemeKey='auto'>
      <Page />
    </Frame>
  )
}

export default compose(withT)(AboutPage)

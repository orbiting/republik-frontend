import React from 'react'
import { compose } from 'react-apollo'
import withData from '../lib/apollo/withData'
import withT from '../lib/withT'
import Frame from '../components/Frame'

import { H1, H2, P, A } from '@project-r/styleguide'

import Table from '../components/Shareholder/Table'
import Sunburst, { radius } from '../components/Shareholder/Sunburst'

import { STATIC_BASE_URL } from '../lib/constants'

const ShareholderPage = ({ url, t }) => {
  const meta = {
    title: t('shareholder/pageTitle'),
    description: t('shareholder/description'),
    image: `${STATIC_BASE_URL}/static/social-media/aktionariat.png`
  }

  return (
    <Frame url={url} meta={meta} indented>
      <H1>{t('shareholder/title')}</H1>
      <H2>{t('shareholder/description')}</H2>

      <div style={{ maxWidth: radius * 2, margin: '20px 0' }}>
        <Sunburst />
      </div>

      <H2>{t('shareholder/table/title')}</H2>
      <Table />

      <P>
        {t('shareholder/contact')}{' '}
        <A href={`mailto:${t('shareholder/contact/email')}`}>
          {t('shareholder/contact/email')}
        </A>
      </P>
    </Frame>
  )
}

export default compose(withData, withT)(ShareholderPage)

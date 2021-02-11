import React from 'react'

import { Editorial } from '@project-r/styleguide'
import SectionTitle from './Common/SectionTitle'
import SectionContainer from './Common/SectionContainer'
import HrefLink from '../Link/Href'

const Vision = ({ t }) => {
  return (
    <SectionContainer maxWidth={720}>
      <SectionTitle title={t('marketing/page/vision/title')} />
      <Editorial.Subhead>
        {t('marketing/page/vision/headline')}
      </Editorial.Subhead>
      <Editorial.P>{t('marketing/page/vision/paragraph1')}</Editorial.P>
      <Editorial.P>{t('marketing/page/vision/paragraph2')}</Editorial.P>
      <Editorial.P>
        <HrefLink href='/about' passHref>
          <Editorial.A>{t('marketing/page/vision/more')}</Editorial.A>
        </HrefLink>
      </Editorial.P>
    </SectionContainer>
  )
}

export default Vision

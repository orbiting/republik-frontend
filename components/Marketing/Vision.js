import React from 'react'

import { Editorial } from '@project-r/styleguide'
import SectionTitle from './Common/SectionTitle'
import SectionContainer from './Common/SectionContainer'
import { Link } from '../../lib/routes'
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
        <Link route='about' passHref>
          <Editorial.A>{t('marketing/page/vision/more')}</Editorial.A>
        </Link>
      </Editorial.P>
    </SectionContainer>
  )
}

export default Vision

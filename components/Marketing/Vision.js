import React from 'react'
import { css } from 'glamor'

import { Center, Editorial, A } from '@project-r/styleguide'
import SectionTitle from './Common/SectionTitle'
import SectionContainer from './Common/SectionContainer'
import { Link } from '../../lib/routes'
const Vision = ({ t }) => {
  return (
    <SectionContainer>
      <SectionTitle title='Unsere Vision' />
      <Editorial.Subhead>
        {t('marketing/page/vision/headline')}
      </Editorial.Subhead>
      <Editorial.P>{t('marketing/page/vision/text')}</Editorial.P>
      <Editorial.P {...styles.more}>
        <Link route='vision' passHref>
          <Editorial.A>Mehr erfahren</Editorial.A>
        </Link>
      </Editorial.P>
    </SectionContainer>
  )
}

const styles = {
  more: css({
    textAlign: 'center'
  })
}

export default Vision

import React from 'react'
import { css } from 'glamor'

import {
  TeaserFrontTileRow,
  TeaserFrontTile,
  fontStyles,
  Editorial,
  Breakout
} from '@project-r/styleguide'
import SectionContainer from './Common/SectionContainer'

const Reasons = ({ t }) => {
  return (
    <SectionContainer>
      <Breakout size='breakout'>
        <TeaserFrontTileRow columns={3}>
          <TeaserFrontTile align='top'>
            <h2 {...styles.title}>{t('marketing/page/reasons/1/title')}</h2>
            <Editorial.P>{t('marketing/page/reasons/1/text')}</Editorial.P>
          </TeaserFrontTile>
          <TeaserFrontTile align='top'>
            <h2 {...styles.title}>{t('marketing/page/reasons/2/title')}</h2>
            <Editorial.P>{t('marketing/page/reasons/2/text')}</Editorial.P>
          </TeaserFrontTile>
          <TeaserFrontTile align='top'>
            <h2 {...styles.title}>{t('marketing/page/reasons/3/title')}</h2>
            <Editorial.P>{t('marketing/page/reasons/3/text')}</Editorial.P>
          </TeaserFrontTile>
        </TeaserFrontTileRow>
      </Breakout>
    </SectionContainer>
  )
}

const styles = {
  title: css({
    ...fontStyles.sansSerifMedium24
  })
}

export default Reasons

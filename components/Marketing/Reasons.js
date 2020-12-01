import React from 'react'
import { css } from 'glamor'

import {
  TeaserFrontTileRow,
  TeaserFrontTile,
  fontStyles,
  Editorial,
  Breakout,
  Button,
  Center
} from '@project-r/styleguide'
import SectionContainer from './Common/SectionContainer'

const Reasons = ({ t }) => {
  return (
    <Center>
      <div {...styles.center}>
        <Editorial.P>{t('marketing/page/carpet/text')}</Editorial.P>
      </div>
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
        <div {...styles.center}>
          <Button primary>{t('marketing/page/carpet/button')}</Button>
        </div>
      </Breakout>
    </Center>
  )
}

const styles = {
  title: css({
    ...fontStyles.sansSerifMedium24
  }),
  center: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  })
}

export default Reasons

import React from 'react'
import { css } from 'glamor'

import {
  TeaserFrontTileRow,
  TeaserFrontTile,
  fontStyles,
  Editorial,
  Breakout,
  Center,
  Button
} from '@project-r/styleguide'

const Reasons = ({ t }) => {
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: 15 }}>
      <TeaserFrontTileRow columns={3}>
        <TeaserFrontTile align='top' padding={'0 5%'}>
          <h2 {...styles.title}>{t('marketing/page/reasons/1/title')}</h2>
          <Editorial.P>{t('marketing/page/reasons/1/text')}</Editorial.P>
        </TeaserFrontTile>
        <TeaserFrontTile align='top' padding={'0 5%'}>
          <h2 {...styles.title}>{t('marketing/page/reasons/2/title')}</h2>
          <Editorial.P>{t('marketing/page/reasons/2/text')}</Editorial.P>
        </TeaserFrontTile>
        <TeaserFrontTile align='top' padding={'0 5%'}>
          <h2 {...styles.title}>{t('marketing/page/reasons/3/title')}</h2>
          <Editorial.P>{t('marketing/page/reasons/3/text')}</Editorial.P>
        </TeaserFrontTile>
      </TeaserFrontTileRow>
      <Center style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          style={{
            padding: '10px 80px',
            whiteSpace: 'nowrap'
          }}
          href='/pledge'
          primary
        >
          {t('marketing/page/carpet/button')}
        </Button>
      </Center>
    </div>
  )
}

const styles = {
  title: css({
    ...fontStyles.sansSerifMedium24
  })
}

export default Reasons

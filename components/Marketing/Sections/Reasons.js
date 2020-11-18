import React from 'react'
import { css } from 'glamor'

import {
  TeaserFrontTileRow,
  TeaserFrontTile,
  fontStyles,
  Editorial,
  Center,
  Breakout
} from '@project-r/styleguide'

const Reasons = ({ t }) => {
  return (
    <Center>
      <Breakout size='breakout'>
        <TeaserFrontTileRow columns={3}>
          <TeaserFrontTile align='top'>
            <h3 {...styles.title}>
              {`1. ${t('marketing/page/reasons/1/title')}`}
            </h3>
            <Editorial.P>{t('marketing/page/reasons/1/text')}</Editorial.P>
          </TeaserFrontTile>
          <TeaserFrontTile align='top'>
            <h3 {...styles.title}>
              {`2. ${t('marketing/page/reasons/2/title')}`}
            </h3>
            <Editorial.P>{t('marketing/page/reasons/2/text')}</Editorial.P>
          </TeaserFrontTile>
          <TeaserFrontTile align='top'>
            <h3 {...styles.title}>
              {`2. ${t('marketing/page/reasons/3/title')}`}
            </h3>
            <Editorial.P>{t('marketing/page/reasons/3/text')}</Editorial.P>
          </TeaserFrontTile>
        </TeaserFrontTileRow>
      </Breakout>
    </Center>
  )
}

const styles = {
  title: css({
    ...fontStyles.sansSerifRegular22
  })
}

export default Reasons

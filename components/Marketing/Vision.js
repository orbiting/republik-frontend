import React from 'react'
import { css } from 'glamor'

import { Center, Editorial } from '@project-r/styleguide'

const Vision = ({ t }) => {
  return (
    <Center>
      <Editorial.Subhead>
        {t('marketing/page/vision/headline')}
      </Editorial.Subhead>
      <Editorial.P {...styles.pledge}>
        {t('marketing/page/vision/text')}
      </Editorial.P>
    </Center>
  )
}

const styles = {
  pledge: css({})
}

export default Vision

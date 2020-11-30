import React from 'react'
import { css } from 'glamor'
import { Logo } from '@project-r/styleguide'

import SectionContainer from './Common/SectionContainer'

const LogoSection = ({ isMobile }) => {
  return (
    <SectionContainer>
      <div {...styles.logo}>
        <Logo width={isMobile} />
      </div>
    </SectionContainer>
  )
}

const styles = {
  logo: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  })
}

export default LogoSection

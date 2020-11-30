import React, { useState, useEffect } from 'react'
import { compose } from 'react-apollo'
import withT from '../../lib/withT'
import { mediaQueries } from '@project-r/styleguide'

import Lead from './Lead'
import Carpet from './Carpet'
import Team from './Team'
import Reasons from './Reasons'
import Sections from './Sections'
import Vision from './Vision'
import Logo from './Logo'

const Marketing = ({ t }) => {
  const [isMobile, setIsMobile] = useState()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < mediaQueries.mBreakPoint)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      <Lead isMobile={isMobile} t={t} />
      <Carpet isMobile={isMobile} t={t} />
      <Reasons t={t} />
      <Team t={t} />
      <Sections />
      <Vision t={t} />
      <Logo isMobile={isMobile} />
    </>
  )
}

export default compose(withT)(Marketing)

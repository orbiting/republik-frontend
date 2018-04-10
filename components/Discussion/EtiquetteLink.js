import React from 'react'
import { Link } from '../../lib/routes'

const EtiquetteLink = ({children, ...props}) => (
  <Link route='etiquette' {...props}>
    {children}
  </Link>
)

export default EtiquetteLink

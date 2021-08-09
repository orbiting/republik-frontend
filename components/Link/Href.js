import React from 'react'
import { format, parse } from 'url'
import AreaLink from './Area'
import Link from 'next/link'

const HrefLink = ({ href, passHref, children }) => {
  if (!href) {
    return children
  }

  const Component = passHref ? Link : AreaLink

  return (
    <Component href={href} passHref={passHref}>
      {children}
    </Component>
  )
}
export default HrefLink

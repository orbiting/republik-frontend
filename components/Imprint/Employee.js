import React from 'react'
import { Link } from '../../lib/routes'

import { Item } from '../../components/Testimonial/List'

const ProfileLink = ({ children, username }) => {
  return (
    <Link
      route='profile'
      params={{
        slug: username
      }}
      passHref
    >
      {children}
    </Link>
  )
}

const Employee = ({ name, title, user, style, minColumns, maxColumns }) => {
  const displayName = name + (title ? `, ${title}` : '')
  const columnProps = { minColumns, maxColumns }
  if (!user) {
    return <Item name={displayName} style={{ cursor: 'default', ...style }} {...columnProps} />
  }
  const { portrait, username } = user
  if (!username) {
    return <Item image={portrait} name={displayName} style={{ cursor: 'default', ...style }} {...columnProps} />
  }
  return (
    <ProfileLink username={username}>
      <Item image={portrait} name={displayName} style={style} {...columnProps} />
    </ProfileLink>
  )
}

export default Employee

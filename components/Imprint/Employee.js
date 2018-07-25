import React from 'react'
import { Link } from '../../lib/routes'

import { Item } from '../../components/Testimonial/List'

const ProfileLink = ({ children, userId, username }) => {
  if (!userId && !username) {
    return children
  }
  return (
    <Link
      route='profile'
      params={{
        slug: `${username || userId}`
      }}
    >
      {children}
    </Link>
  )
}

const Employee = ({ name, title, user }) => {
  const displayName = name + (title ? `, ${title}` : '')
  if (!user) {
    return <Item name={displayName} style={{cursor: 'default'}} />
  }
  const { id, hasPublicProfile, portrait, username } = user
  if (!hasPublicProfile) {
    return <Item image={portrait} name={displayName} style={{cursor: 'default'}} />
  }
  return (
    <ProfileLink userId={id} username={username}>
      <Item image={portrait} name={displayName} />
    </ProfileLink>
  )
}

export default Employee

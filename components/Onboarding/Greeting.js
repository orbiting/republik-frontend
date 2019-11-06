import React from 'react'
import gql from 'graphql-tag'
import { css } from 'glamor'

import { Interaction, H2, mediaQueries, inQuotes } from '@project-r/styleguide'

const { P } = Interaction

const styles = {
  greeting: css({
    paddingTop: 20,
    paddingBottom: 20,
    display: 'flex'
  }),
  portrait: css({
    marginRight: 10,
    marginBottom: 10,
    '> img': {
      width: 100,
      [mediaQueries.mUp]: {
        width: 200
      }
    }
  }),
  aspect: css({
    display: 'block',
    width: '100%',
    paddingBottom: '100%',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#ccc'
  }),
  aspectImg: css({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%'
  })
}

export const fragments = {
  employee: gql`
    fragment GreetingEmployee on Employee {
      name
      group
      greeting
      user {
        id
        portrait
      }
    }
  `
}

export default props => {
  const { employee } = props

  if (!employee) {
    return null
  }

  return (
    <div {...styles.greeting}>
      {employee.user && employee.user.portrait && (
        <div {...styles.portrait}>
          <img src={employee.user.portrait} />
        </div>
      )}
      <div>
        <H2>{inQuotes(employee.greeting)}</H2>
        <P>
          – {employee.name}, {employee.group}
        </P>
      </div>
    </div>
  )
}

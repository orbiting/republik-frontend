import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { css } from 'glamor'
import {
  InlineSpinner,
  Interaction,
  colors,
  mediaQueries
} from '@project-r/styleguide'

import { countFormat } from '../../lib/utils/format'
import { Item } from '../Testimonial/List'

const styles = {
  container: css({
    maxWidth: '974px',
    margin: '0 auto'
  }),
  headline: css({
    textAlign: 'center',
    fontSize: '16px',
    lineHeight: '25px',
    [mediaQueries.mUp]: {
      fontSize: '30px',
      lineHeight: '36px'
    }
  }),
  hBox: css({
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  }),
  item: css({
    [mediaQueries.mUp]: {
      width: '16%'
    },
    width: '33%',
    margin: 0,
    float: 'none'
  }),
  link: css({
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: '16px',
    lineHeight: '25px',
    [mediaQueries.mUp]: {
      fontSize: '23px',
      lineHeight: '28px'
    },
    '& a': {
      textDecoration: 'underline'
    },
    '& a:hover': {
      color: colors.secondary
    },
    '& a:focus': {
      color: colors.secondary
    },
    '& a:active': {
      color: colors.primary
    }
  })
}

const GET_COMMUNITY_LIST = gql`
query members {
  statements(first: 100) {
    totalCount
    nodes {
      id
      username
      name
      portrait
      hasPublicProfile
    }
  }
  memberStats {
    count
  }
}
`

export default graphql(
  GET_COMMUNITY_LIST
)(({ data: { error, loading, statements: members, memberStats } }) => {
  if (loading) {
    return <InlineSpinner size='38px' />
  }
  const items = !error &&
    members &&
    members.nodes &&
    members.nodes
      .filter(v => v.hasPublicProfile)
      .slice(0, 6)

  return (
    <div {...styles.container}>
      <Interaction.H2 {...styles.headline}>
        {countFormat(memberStats.count)} Personen sind schon dabei
      </Interaction.H2>
      <div {...styles.hBox}>{
        items.map((member, i) => (
          <Item
            key={i}
            {...styles.item}
            image={member.portrait}
            name={member.name}
          />
        ))
      }</div>
      <Interaction.P {...styles.link}>
        <a>Community anschauen</a>
      </Interaction.P>
    </div>)
})

import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { css } from 'glamor'
import {
  InlineSpinner,
  Interaction,
  colors,
  mediaQueries,
  fontFamilies
} from '@project-r/styleguide'

import { countFormat } from '../../lib/utils/format'

const styles = {
  container: css({
    margin: '0 -5px'
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
    flexWrap: 'wrap',
    [mediaQueries.mUp]: {
      marginTop: '20px'
    }
  }),
  item: css({
    [mediaQueries.mUp]: {
      width: '16%'
    },
    position: 'relative',
    width: '33%',
    padding: '5px',
    float: 'none'
  }),
  itemImage: css({
    width: '100%',
    paddingBottom: '100%',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#ccc',
    '& > *': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%'
    }
  }),
  itemName: css({
    position: 'absolute',
    fontSize: '12px',
    lineHeight: '15px',
    zIndex: 99,
    top: '63%',
    left: '8px',
    right: '8px',
    [mediaQueries.mUp]: {
      left: '15px',
      right: '15px',
      fontSize: '17px',
      lineHeight: '22px'
    },
    color: '#fff',
    fontFamily: fontFamilies.sansSerifMedium
  }),
  link: css({
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: '16px',
    lineHeight: '25px',
    [mediaQueries.mUp]: {
      marginTop: '20px',
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

export const Item = ({image, name, ...props}) => (
  <div {...styles.item}>
    <div {...styles.itemImage}>
      <img src={image} />
    </div>
    <div {...styles.itemName}>{name}</div>
  </div>
)

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

import React from 'react'
import { css } from 'glamor'
import { compose } from 'react-apollo'

import withT from '../../lib/withT'
import { Link } from '../../lib/routes'

import {
  colors,
  fontStyles,
  Editorial,
  mediaQueries
} from '@project-r/styleguide'

const styles = {
  container: css({
    position: 'absolute',
    zIndex: 100,
    left: 8,
    right: 8,
    bottom: 5,
    ...fontStyles.sansSerif,
    fontSize: 11,
    lineHeight: '16px',
    color: colors.text,
    [mediaQueries.mUp]: {
      fontSize: 14,
      lineHeight: '24px'
    }
  }),
  right: css({
    position: 'absolute',
    bottom: 0,
    right: 0,
    maxWidth: '60vw',
    textAlign: 'right'
  }),
  left: css({
    position: 'absolute',
    bottom: 0,
    left: 0,
    maxWidth: '40vw'
  })
}

const Footer = ({ t, zIndex }) => {
  return (
    <div {...styles.container}>
      <div {...styles.left}>
        <Link route='legal/imprint' passHref>
          <Editorial.A>{t('footer/legal/imprint')}</Editorial.A>
        </Link>
      </div>
      <div {...styles.right}>
        Quellen<br />
        <Editorial.A href='https://www.smartvote.ch/de/home'>Smartvote</Editorial.A>, <Editorial.A href='https://lobbywatch.ch/de'>Lobbywatch</Editorial.A>, <Editorial.A href='https://www.bfs.admin.ch/bfs/de/home/statistiken/kataloge-datenbanken/tabellen.assetdetail.8826608.html'>BFS</Editorial.A>
      </div>
    </div>
  )
}

export default compose(withT)(Footer)

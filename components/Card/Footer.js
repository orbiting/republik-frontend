import React from 'react'
import { css } from 'glamor'
import { compose } from 'react-apollo'

import withT from '../../lib/withT'
import { Link } from '../../lib/routes'

import {
  colors,
  fontStyles,
  Editorial
} from '@project-r/styleguide'

const styles = {
  container: css({
    position: 'absolute',
    zIndex: 100,
    left: 8,
    right: 8,
    bottom: 5,
    ...fontStyles.sansSerif,
    fontSize: 14,
    lineHeight: '24px',
    color: colors.text
  }),
  right: css({
    position: 'absolute',
    bottom: 0,
    right: 0,
    maxWidth: '50vw'
  }),
  left: css({
    position: 'absolute',
    bottom: 0,
    left: 0,
    maxWidth: '50vw'
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
        Quellen: <Editorial.A href='https://www.smartvote.ch/de/home'>Smartvote</Editorial.A>, <Editorial.A href='https://lobbywatch.ch/de'>Lobbywatch</Editorial.A>, <Editorial.A href='https://www.bfs.admin.ch/bfs/de/home/statistiken/kataloge-datenbanken/tabellen.assetdetail.8826608.html'>BFS</Editorial.A>
      </div>
    </div>
  )
}

export default compose(withT)(Footer)

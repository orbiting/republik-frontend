import React, { useState } from 'react'
import { css, merge } from 'glamor'
import {
  Editorial,
  Interaction,
  mediaQueries,
  fontStyles
} from '@project-r/styleguide'
import VbzArticlesOverlay from './VbzArticlesOverlay'

const styles = {
  container: css({
    backgroundColor: '#2c2e35',
    width: 270,
    height: 400,
    display: 'inline-bock',
    position: 'relative',
    padding: '0 60px 0 60px',
    textAlign: 'center',
    margin: '0 auto',
    '& .hole': {
      borderRadius: '50%',
      height: 10,
      width: 10,
      backgroundColor: '#111',
      position: 'absolute',
      top: 20
    },
    '@media (hover)': {
      ':hover': {
        backgroundColor: '#111',
        border: '1px solid white',
        cursor: 'pointer',
        '& .hole': {
          border: '1px solid white'
        }
      }
    }
  }),
  titleContainer: css({
    position: 'absolute',
    top: 30,
    left: 45,
    right: 45,
    height: 320,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }),
  title: css({
    ...fontStyles.serifTitle26,
    color: '#ffffff',
    margin: 0
  }),
  caption: css({
    ...fontStyles.sansSerifRegular11,
    fontWeight: 'bold',
    position: 'absolute',
    top: 320,
    left: 0,
    width: '100%'
  })
}

export default () => {
  const [showOverlay, setShowOverlay] = useState(false)

  return (
    <>
      <div {...styles.container} onClick={() => setShowOverlay(true)}>
        <span className="hole" style={{ left: 45 }} />
        <span className="hole" style={{ right: 45 }} />
        <div {...styles.titleContainer}>
          <div {...styles.title}>Wollen Sie es wirklich wissen?</div>
        </div>
        <div {...styles.caption}>Republik durch 9 Artikel entdecken</div>
      </div>
      {showOverlay && (
        <VbzArticlesOverlay onClose={() => setShowOverlay(false)} />
      )}
    </>
  )
}

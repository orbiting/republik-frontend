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
    display: 'inline-bock',
    position: 'relative',
    textAlign: 'center',
    margin: '0 auto',
    width: 200,
    height: 300,
    '& .hole': {
      borderRadius: '50%',
      top: '6%',
      height: 8,
      width: 8,
      backgroundColor: '#111',
      position: 'absolute'
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
    },
    [mediaQueries.mUp]: {
      width: 270,
      height: 400,
      '& .hole': {
        height: 8,
        width: 8
      }
    }
  }),
  titleContainer: css({
    position: 'absolute',
    top: 22,
    left: 35,
    right: 35,
    height: 240,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    [mediaQueries.mUp]: {
      top: 30,
      left: 45,
      right: 45,
      height: 320
    }
  }),
  title: css({
    ...fontStyles.serifTitle22,
    color: '#ffffff',
    margin: 0,
    [mediaQueries.mUp]: {
      ...fontStyles.serifTitle26
    }
  }),
  caption: css({
    ...fontStyles.sansSerifRegular11,
    fontWeight: 'bold',
    position: 'absolute',
    top: 240,
    left: 45,
    right: 45,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular13,
      top: 320
    }
  })
}

export default () => {
  const [showOverlay, setShowOverlay] = useState(false)

  return (
    <>
      <div {...styles.container} onClick={() => setShowOverlay(true)}>
        <span className="hole" style={{ left: '17%' }} />
        <span className="hole" style={{ right: '17%' }} />
        <div {...styles.titleContainer}>
          <div {...styles.title}>Wollen Sie es wirklich wissen?</div>
        </div>
        <div {...styles.caption}>Die Republik durch 9 Artikel entdecken.</div>
      </div>
      {showOverlay && (
        <VbzArticlesOverlay onClose={() => setShowOverlay(false)} />
      )}
    </>
  )
}

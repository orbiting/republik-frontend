import React, { useState } from 'react'
import { css } from 'glamor'
import { mediaQueries, fontStyles } from '@project-r/styleguide'
import VbzArticlesOverlay from './VbzArticlesOverlay'
import withT from '../../lib/withT'

const styles = {
  container: css({
    backgroundColor: '#2c2e35',
    display: 'inline-bock',
    position: 'relative',
    textAlign: 'center',
    margin: '0 auto',
    width: 220,
    height: 300,
    boxShadow: '0px 10px 28px -6px rgba(0,0,0,0.75)',
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
      boxShadow: 'none',
      '& .hole': {
        height: 8,
        width: 8
      }
    }
  }),
  titleContainer: css({
    position: 'absolute',
    top: 15,
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
    ...fontStyles.serifTitle30,
    color: '#ffffff',
    margin: 0,
    [mediaQueries.mUp]: {
      ...fontStyles.serifTitle38
    }
  }),
  caption: css({
    ...fontStyles.sansSerifRegular12,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifMedium15,
      lineHeight: 1.25
    }
  })
}

export default withT(({ t }) => {
  const [showOverlay, setShowOverlay] = useState(false)

  return (
    <>
      <div {...styles.container} onClick={() => setShowOverlay(true)}>
        <span className='hole' style={{ left: '17%' }} />
        <span className='hole' style={{ right: '17%' }} />
        <div {...styles.titleContainer}>
          <div {...styles.title}>Wollen Sie es wirklich wissen?</div>
        </div>
        <div {...styles.caption}>{t('marketing/vbz/poster/hint')}</div>
      </div>
      {showOverlay && (
        <VbzArticlesOverlay onClose={() => setShowOverlay(false)} />
      )}
    </>
  )
})

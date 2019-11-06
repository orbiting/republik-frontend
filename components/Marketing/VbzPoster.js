import React from 'react'
import { css } from 'glamor'
import { Editorial, Interaction, mediaQueries } from '@project-r/styleguide'

const styles = {
  container: css({
    backgroundColor: '#2c2e35',
    width: 320,
    height: 400,
    position: 'relative',
    padding: '0 60px 0 60px',
    textAlign: 'center',
    margin: '45px auto 60px',
    '& .hole': {
      borderRadius: '50%',
      height: 10,
      width: 10,
      backgroundColor: '#111',
      position: 'absolute',
      top: 30
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
    left: 60,
    right: 60,
    height: 320,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }),
  title: css({
    color: '#ffffff',
    fontSize: 30,
    lineHeight: 1.25,
    margin: 0
  }),
  caption: css({
    fontSize: 10.5,
    position: 'absolute',
    bottom: 30,
    left: 0,
    width: '100%'
  })
}

export default () => {
  return (
    <div {...styles.container}>
      <span className="hole" style={{ left: 45 }} />
      <span className="hole" style={{ right: 45 }} />
      <div {...styles.titleContainer}>
        <Editorial.Subhead {...styles.title}>
          Was China mit seinen 60 Milliarden in der Schweiz schon so alles
          gekauft gekauft hat.
        </Editorial.Subhead>
      </div>
      <Interaction.Emphasis {...styles.caption}>
        Wollen Sie es wirklich wissen?
      </Interaction.Emphasis>
    </div>
  )
}

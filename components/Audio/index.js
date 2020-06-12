import React, { useState, useEffect, useRef } from 'react'
import { AudioPlayer } from '@project-r/styleguide'
import withT from '../../lib/withT'
import { compose } from 'react-apollo'
import { css } from 'glamor'
import { mediaQueries, zIndex } from '@project-r/styleguide'

import ProgressComponent from '../../components/Article/Progress'
import createPersistedState from '../../lib/hooks/use-persisted-state'

export const AudioContext = React.createContext({
  audioSource: {},
  audioPlayerVisible: false,
  toggleAudioPlayer: () => {}
})

const useAudioState = createPersistedState('republik-audioplayer-audiostate')

export const AudioProvider = ({ children, t }) => {
  const [audioState, setAudioState] = useAudioState(undefined)
  const [audioPlayerVisible, setAudioPlayerVisible] = useState(false)
  const [autoPlayActive, setAutoPlayActive] = useState(false)
  const clearTimeoutId = useRef()

  const toggleAudioPlayer = payload => {
    setAudioState(payload)
    setAutoPlayActive(true)
    clearTimeout(clearTimeoutId.current)
  }

  const onCloseAudioPlayer = () => {
    setAudioPlayerVisible(false)
    setAutoPlayActive(false)
    clearTimeoutId.current = setTimeout(() => {
      setAudioState(undefined)
    }, 300)
  }

  useEffect(() => {
    if (audioState) {
      setAudioPlayerVisible(true)
    }
  }, [audioState])

  return (
    <AudioContext.Provider value={{ toggleAudioPlayer, audioPlayerVisible }}>
      {children}
      {audioState && (
        <div
          {...css(styles.audioPlayerContainer, {
            opacity: audioPlayerVisible ? 1 : 0,
            transform: audioPlayerVisible ? 'translateY(0)' : 'translateY(8px)'
          })}
        >
          <div {...styles.audioPlayerBox}>
            <ProgressComponent isArticle={false}>
              <AudioPlayer
                key={audioState.mediaId || audioState.audioSource.mp3}
                mediaId={audioState.mediaId}
                durationMs={audioState.audioSource.durationMs}
                src={audioState.audioSource}
                title={audioState.title}
                sourcePath={audioState.sourcePath}
                closeHandler={onCloseAudioPlayer}
                autoPlay={autoPlayActive}
                download
                scrubberPosition='bottom'
                t={t}
                fixed
                timePosition='left'
                height={68}
                controlsPadding={18}
              />
            </ProgressComponent>
          </div>
        </div>
      )}
    </AudioContext.Provider>
  )
}

const styles = {
  audioPlayerContainer: css({
    position: 'fixed',
    width: '100%',
    maxWidth: 414,
    bottom: 44,
    right: 0,
    padding: '0 16px',
    zIndex: zIndex.callout,
    transition: 'all ease-out 0.3s',
    [mediaQueries.mUp]: {
      right: 16
    }
  }),
  audioPlayerBox: css({
    backgroundColor: 'white',
    boxShadow: '0 0 15px rgba(0,0,0,0.1)'
  })
}

const ComposedAudioProvider = compose(withT)(AudioProvider)

export default ComposedAudioProvider

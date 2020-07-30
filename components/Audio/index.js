import React, { useState, useEffect, useRef } from 'react'
import { AudioPlayer } from '@project-r/styleguide'
import Link from '../Link/Href'
import withT from '../../lib/withT'
import { compose } from 'react-apollo'
import { css } from 'glamor'
import { mediaQueries, zIndex } from '@project-r/styleguide'

import ProgressComponent from '../../components/Article/Progress'
import createPersistedState from '../../lib/hooks/use-persisted-state'
import withInNativeApp, { postMessage } from '../../lib/withInNativeApp'

export const AudioContext = React.createContext({
  audioSource: {},
  audioPlayerVisible: false,
  toggleAudioPlayer: () => {}
})

const useAudioState = createPersistedState('republik-audioplayer-audiostate')

export const AudioProvider = ({ children, t, inNativeApp, inNativeIOSApp }) => {
  const [audioState, setAudioState] = useAudioState(undefined)
  const [audioPlayerVisible, setAudioPlayerVisible] = useState(false)
  const [autoPlayActive, setAutoPlayActive] = useState(false)
  const clearTimeoutId = useRef()

  const toggleAudioPlayer = ({ audioSource, title, path }) => {
    const url = (
      (inNativeIOSApp && audioSource.aac) ||
      audioSource.mp3 ||
      audioSource.ogg
    )?.trim()
    if (!url) {
      return
    }
    const payload = {
      audioSource,
      url,
      title,
      sourcePath: path,
      mediaId: audioSource.mediaId
    }
    if (inNativeApp) {
      postMessage({
        type: 'play-audio',
        payload
      })
      return
    }
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
    setAudioPlayerVisible(!!audioState)
    // ensure auto play is disabled when e.g. closed through another tab (local storage sync)
    if (!audioState) {
      setAutoPlayActive(false)
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
                key={audioState.mediaId || audioState.url}
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
                Link={Link}
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

const ComposedAudioProvider = compose(withT, withInNativeApp)(AudioProvider)

export default ComposedAudioProvider

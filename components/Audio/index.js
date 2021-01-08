import React, { useState, useEffect, useRef } from 'react'
import { compose } from 'react-apollo'

import createPersistedState from '../../lib/hooks/use-persisted-state'
import withInNativeApp, { postMessage } from '../../lib/withInNativeApp'

export const AudioContext = React.createContext({
  audioSource: {},
  audioPlayerVisible: false,
  toggleAudioPlayer: () => {},
  onCloseAudioPlayer: () => {},
  audioState: {},
  autoPlayActive: false
})

const useAudioState = createPersistedState('republik-audioplayer-audiostate')

export const AudioProvider = ({ children, inNativeApp, inNativeIOSApp }) => {
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
        payload: {
          audio: {
            ...payload
          }
          // Todo: add currentTime to payload
        }
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
    <AudioContext.Provider
      value={{
        toggleAudioPlayer,
        onCloseAudioPlayer,
        audioPlayerVisible,
        audioState,
        autoPlayActive
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

const ComposedAudioProvider = compose(withInNativeApp)(AudioProvider)

export default ComposedAudioProvider

import { useEffect, useContext } from 'react'
import withInNativeApp, { postMessage } from '../../lib/withInNativeApp'
import { parseJSONObject } from '../../lib/safeJSON'
import { AudioContext } from '../Audio'

const MessageSync = ({ inNativeApp, inNativeAppLegacy }) => {
  const { setAudioPlayerVisibility } = useContext(AudioContext)

  useEffect(() => {
    if (!inNativeApp || inNativeAppLegacy) {
      return
    }
    const onMessage = event => {
      const { content = {}, id } = parseJSONObject(event.data)
      if (content.type === 'onPushRegistered') {
        // TODO save tokens to backend
        console.log('onPushRegistered', content)
      }
      if (content.type === 'onAudioPlayerVisibilityChange') {
        console.log('onAudioPlayerVisibilityChange', content)
        setAudioPlayerVisibility(content.isVisible)
      }
      postMessage({
        type: 'ackMessage',
        id: id
      })
    }
    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
    }
  }, [inNativeApp, inNativeAppLegacy])
  return null
}

export default withInNativeApp(MessageSync)

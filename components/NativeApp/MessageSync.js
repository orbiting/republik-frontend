import { useEffect } from 'react'
import withInNativeApp, { postMessage } from '../../lib/withInNativeApp'
import { parseJSONObject } from '../../lib/safeJSON'

const MessageSync = ({ inNativeApp, inNativeAppLegacy }) => {
  useEffect(() => {
    if (!inNativeApp || inNativeAppLegacy) {
      return
    }
    const onMessage = event => {
      const { content = {}, id } = parseJSONObject(event.data)
      if (content.type === 'onPushRegistered') {
        console.log('onPushRegistered', content)
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

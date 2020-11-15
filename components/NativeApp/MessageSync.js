import React, { useEffect } from 'react'
import withInNativeApp from '../../lib/withInNativeApp'
import { parseJSONObject } from '../../lib/safeJSON'

const MessageSync = ({ inNativeApp, inNativeAppLegacy }) => {
  useEffect(() => {
    if (!inNativeApp || inNativeAppLegacy) {
      return
    }
    const onMessage = event => {
      const message = parseJSONObject(event.data)
      if (message.type === 'onPushRegistered') {
        console.log('onPushRegistered', message.data)
      }
    }
    document.addEventListener('message', onMessage)
    return () => {
      document.removeEventListener('message', onMessage)
    }
  }, [inNativeApp, inNativeAppLegacy])
  return null
}

export default withInNativeApp(MessageSync)

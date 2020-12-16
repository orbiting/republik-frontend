import { useEffect, useContext } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import withInNativeApp, { postMessage } from '../../lib/withInNativeApp'
import { parseJSONObject } from '../../lib/safeJSON'
import { AudioContext } from '../Audio'

const upsertDeviceQuery = gql`
  mutation UpsertDevice($token: ID!, $information: DeviceInformationInput!) {
    upsertDevice(token: $token, information: $information) {
      id
    }
  }
`

const MessageSync = ({ inNativeApp, inNativeAppLegacy, upsertDevice }) => {
  const { setAudioPlayerVisibility } = useContext(AudioContext)

  useEffect(() => {
    if (!inNativeApp || inNativeAppLegacy) {
      return
    }
    const onMessage = event => {
      const { content = {}, id } = parseJSONObject(event.data)
      if (content.type === 'onPushRegistered') {
        const {
          token,
          os,
          osVersion,
          brand,
          model,
          deviceId,
          appVersion,
          userAgent
        } = content.data
        upsertDevice({
          variables: {
            token,
            information: {
              os,
              osVersion,
              model,
              brand,
              deviceId,
              appVersion,
              userAgent
            }
          }
        })
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

export default compose(
  graphql(
    gql`
      mutation UpsertDevice(
        $token: ID!
        $information: DeviceInformationInput!
      ) {
        upsertDevice(token: $token, information: $information) {
          id
        }
      }
    `,
    { name: 'upsertDevice' }
  ),
  withInNativeApp
)(MessageSync)

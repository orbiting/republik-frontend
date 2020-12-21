import { useEffect, useContext } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import withInNativeApp, { postMessage } from '../../lib/withInNativeApp'
import { parseJSONObject } from '../../lib/safeJSON'
import { AudioContext } from '../Audio'
import createPersistedState from '../../lib/hooks/use-persisted-state'
import withMe from '../../lib/apollo/withMe'
import { withProgressApi } from '../Article/Progress/api'

const upsertDeviceQuery = gql`
  mutation UpsertDevice($token: ID!, $information: DeviceInformationInput!) {
    upsertDevice(token: $token, information: $information) {
      id
    }
  }
`

const useLocalMediaProgressState = createPersistedState(
  'republik-progress-media'
)

const MessageSync = ({
  inNativeApp,
  inNativeAppLegacy,
  upsertDevice,
  me,
  upsertMediaProgress
}) => {
  const { setAudioPlayerVisibility } = useContext(AudioContext)
  const [
    localMediaProgress,
    setLocalMediaProgress
  ] = useLocalMediaProgressState()
  const isTrackingAllowed = me && me.progressConsent === true

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
      } else if (content.type === 'onAudioPlayerVisibilityChange') {
        console.log('onAudioPlayerVisibilityChange', content)
        setAudioPlayerVisibility(content.isVisible)
      } else if (content.type === 'onAppMediaProgressUpdate') {
        console.log('onAppMediaProgressUpdate', content)
        const { currentTime, mediaId } = content
        if (isTrackingAllowed) {
          upsertMediaProgress(mediaId, currentTime)
        } else {
          setLocalMediaProgress({ mediaId, currentTime })
        }
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
  withInNativeApp,
  withProgressApi,
  withMe
)(MessageSync)

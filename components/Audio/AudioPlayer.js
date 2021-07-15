import React from 'react'
import { AudioContext } from './AudioProvider'
import { AudioPlayer } from '@project-r/styleguide'
import ProgressComponent from '../../components/Article/Progress'
import withT from '../../lib/withT'
import { compose } from 'react-apollo'
import { AUDIO_PLAYER_HEIGHT } from '../constants'
import Link from '../Link/Href'

import BottomPanel from '../Frame/BottomPanel'

const AudioPlayerFrontend = ({ t }) => {
  return (
    <AudioContext.Consumer>
      {({
        audioPlayerVisible,
        onCloseAudioPlayer,
        audioState,
        autoPlayActive
      }) => {
        return (
          <>
            {audioState && (
              <BottomPanel wide visible={audioPlayerVisible}>
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
                    height={AUDIO_PLAYER_HEIGHT}
                    controlsPadding={18}
                    Link={Link}
                  />
                </ProgressComponent>
              </BottomPanel>
            )}
          </>
        )
      }}
    </AudioContext.Consumer>
  )
}

const ComposedAudioPlayer = compose(withT)(AudioPlayerFrontend)

export default ComposedAudioPlayer

import React from 'react'
import { css } from 'glamor'

import Link from '../Link/Href'
import { AudioContext } from './AudioProvider'
import {
  mediaQueries,
  zIndex,
  AudioPlayer,
  useColorContext
} from '@project-r/styleguide'
import ProgressComponent from '../../components/Article/Progress'
import withT from '../../lib/withT'
import { compose } from 'react-apollo'
import { AUDIO_PLAYER_HEIGHT } from '../constants'

const AudioPlayerFrontend = ({ t }) => {
  const [colorScheme] = useColorContext()
  return (
    <AudioContext.Consumer>
      {({
        audioSource,
        audioPlayerVisible,
        toggleAudioPlayer,
        onCloseAudioPlayer,
        audioState,
        autoPlayActive
      }) => {
        return (
          <>
            {audioState && (
              <div
                {...css(styles.audioPlayerContainer, {
                  opacity: audioPlayerVisible ? 1 : 0,
                  transform: audioPlayerVisible
                    ? 'translateY(0)'
                    : 'translateY(8px)'
                })}
              >
                <div
                  style={{
                    boxShadow: colorScheme.getCSSColor('overlayShadow')
                  }}
                  {...colorScheme.set('backgroundColor', 'overlay')}
                >
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
                </div>
              </div>
            )}
          </>
        )
      }}
    </AudioContext.Consumer>
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
  })
}

const ComposedAudioPlayer = compose(withT)(AudioPlayerFrontend)

export default ComposedAudioPlayer

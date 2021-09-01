import React, { useMemo } from 'react'
import { css } from 'glamor'
import {
  A,
  Button,
  Center,
  colors,
  Interaction,
  mediaQueries,
  useMediaQuery
} from '@project-r/styleguide'
import Box from './Box'
import { useInNativeApp } from '../../lib/withInNativeApp'
import { Breakout } from '@project-r/styleguide/lib/components/Center'

const styles = {
  actions: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    '> *:not(:last-child)': {
      marginBottom: 16
    },
    [mediaQueries.mUp]: {
      width: 'auto',
      flexDirection: 'row',
      '> *:not(:last-child)': {
        marginBottom: 0,
        marginRight: 16
      }
    }
  }),
  primaryAction: css({
    width: '100%',
    [mediaQueries.mUp]: {
      width: 'auto'
    }
  })
}

const LegacyAppNoticeBox = ({ t }) => {
  const { isNativeAppLegacy, inIOS } = useInNativeApp()

  const actions = useMemo(() => {
    if (inIOS) {
      return (
        <Button
          href='https://apps.apple.com/ch/app/republik/id1392772910'
          primary
          target='_blank'
          attributes={styles.primaryAction}
        >
          {t('components/outdatedAppVersion/ios/primaryAction')}
        </Button>
      )
    }
    return (
      <>
        <Button
          href='https://play.google.com/store/apps/details?id=app.republik'
          primary
          target='_blank'
          attributes={styles.primaryAction}
        >
          {t('components/outdatedAppVersion/android/primaryAction')}
        </Button>
        <A href='https://www.republik.ch/app/apk/latest' target='_blank'>
          {t('components/outdatedAppVersion/android/secondaryAction')}
        </A>
      </>
    )
  }, [isNativeAppLegacy, inIOS])

  return (
    <Box style={{ padding: 30 }}>
      <Center>
        <Breakout size='breakout'>
          <Interaction.P style={{ marginBottom: '1rem' }}>
            {t('components/outdatedAppVersion/text')}
          </Interaction.P>
          <div {...styles.actions}>{actions}</div>
        </Breakout>
      </Center>
    </Box>
  )
}

export default LegacyAppNoticeBox

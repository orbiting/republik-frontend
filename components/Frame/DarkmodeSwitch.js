import React from 'react'
import {
  CalloutMenu,
  IconButton,
  Radio,
  Interaction,
  Label,
  useColorContext
} from '@project-r/styleguide'
import { MdBrightness2 } from 'react-icons/md'
import withInNativeApp, { postMessage } from '../../lib/withInNativeApp'

import { usePersistedColorSchemeKey } from '../ColorScheme/lib'

const DarkmodeSwitch = ({
  colorSchemeKey: pageColorSchemeKey,
  t,
  inNativeApp
}) => {
  const [colorSchemeKey, setColorSchemeKey] = usePersistedColorSchemeKey()
  const [colorScheme] = useColorContext()

  const colorSchemaKeyForLable =
    pageColorSchemeKey !== 'auto' ? pageColorSchemeKey : colorSchemeKey

  const iconLabel =
    colorSchemaKeyForLable === 'light'
      ? t('darkmode/switch/off')
      : colorSchemaKeyForLable === 'dark'
      ? t('darkmode/switch/on')
      : t('darkmode/switch/auto')

  const Icon = React.forwardRef((props, ref) => (
    <IconButton
      Icon={MdBrightness2}
      label={t('darkmode/switch/label', {
        iconLabel
      })}
      labelShort={t('darkmode/switch/label', {
        iconLabel
      })}
      ref={ref}
      {...props}
    />
  ))

  const calloutPaddingNativeApp = inNativeApp
    ? '15px 15px 25px'
    : '15px 15px 50px'

  return (
    <CalloutMenu contentPaddingMobile={calloutPaddingNativeApp} Element={Icon}>
      <div style={{ width: 180, lineHeight: '2.5rem' }}>
        {!colorScheme.CSSVarSupport ? (
          <Label>{t('darkmode/switch/notSupported')}</Label>
        ) : pageColorSchemeKey !== 'auto' ? (
          <Label>{t('darkmode/switch/notAvailable')}</Label>
        ) : (
          <>
            <Radio
              value='dark'
              checked={colorSchemeKey === 'dark'}
              onChange={() => {
                setColorSchemeKey('dark')
                if (inNativeApp) {
                  postMessage({
                    type: 'setColorScheme',
                    colorSchemeKey: 'dark'
                  })
                }
              }}
            >
              {t('darkmode/switch/on')}
            </Radio>
            <br />
            <Radio
              value='light'
              checked={colorSchemeKey === 'light'}
              onChange={() => {
                setColorSchemeKey('light')
                if (inNativeApp) {
                  postMessage({
                    type: 'setColorScheme',
                    colorSchemeKey: 'light'
                  })
                }
              }}
            >
              {t('darkmode/switch/off')}
            </Radio>
            <br />
            <Radio
              value='auto'
              checked={colorSchemeKey === 'auto'}
              onChange={() => {
                // ToDo activating auto by default
                // - handle all «ToDo activating auto» comments
                // - rm explicit auto value
                setColorSchemeKey('auto')
                if (inNativeApp) {
                  postMessage({
                    type: 'setColorScheme',
                    colorSchemeKey: 'auto'
                  })
                }
              }}
            >
              {t('darkmode/switch/auto')}
            </Radio>
          </>
        )}
      </div>
    </CalloutMenu>
  )
}

export default withInNativeApp(DarkmodeSwitch)

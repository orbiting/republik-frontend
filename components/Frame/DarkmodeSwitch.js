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

import { useColorSchemeKey } from '../ColorScheme/lib'

const DarkmodeSwitch = ({ pageColorSchemeKey, t, inNativeApp }) => {
  const [colorSchemeKey, setColorSchemeKey] = useColorSchemeKey()
  const [colorScheme] = useColorContext()

  const colorSchemaKeyForLabel = pageColorSchemeKey || colorSchemeKey

  const iconLabel =
    colorSchemaKeyForLabel === 'light'
      ? t('darkmode/switch/off')
      : colorSchemaKeyForLabel === 'dark'
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

  return (
    <CalloutMenu Element={Icon}>
      <div style={{ width: 180 }}>
        {pageColorSchemeKey ? (
          <Label>{t('darkmode/switch/notAvailable')}</Label>
        ) : !colorScheme.CSSVarSupport ? (
          <Label>{t('darkmode/switch/notSupported')}</Label>
        ) : (
          <Interaction.P>
            <Radio
              value='dark'
              checked={colorSchemeKey === 'dark'}
              onChange={() => {
                setColorSchemeKey('dark')
              }}
            >
              {t('darkmode/switch/on')}
            </Radio>
            <br />
            <Radio
              value='light'
              checked={colorSchemeKey === 'light'}
              onChange={() => {
                // ToDo activating auto
                // - replace with 'light' when activating auto
                setColorSchemeKey('')
              }}
            >
              {t('darkmode/switch/off')}
            </Radio>
            <br />
            {/*
              // ToDo App has been updated 
              // - remove condition below
            */}
            {!inNativeApp ? (
              <Radio
                value='auto'
                checked={colorSchemeKey === 'auto'}
                onChange={() => {
                  // ToDo activating auto by default
                  // - handle all «ToDo activating auto» comments
                  // - rm explicit auto value
                  setColorSchemeKey('auto')
                }}
              >
                {t('darkmode/switch/auto')}
              </Radio>
            ) : null}
          </Interaction.P>
        )}
      </div>
    </CalloutMenu>
  )
}

export default DarkmodeSwitch

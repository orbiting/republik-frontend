import React from 'react'
import {
  CalloutMenu,
  IconButton,
  Radio,
  Interaction,
  Label
} from '@project-r/styleguide'
import { MdBrightness2 } from 'react-icons/md'

import { useColorSchemeKey } from '../ColorScheme/lib'

const DarkmodeSwitch = ({ colorSchemeKey: pageColorSchemeKey }) => {
  const [colorSchemeKey, setColorSchemeKey] = useColorSchemeKey()

  const colorSchemaKeyForLable =
    pageColorSchemeKey !== 'auto' ? pageColorSchemeKey : colorSchemeKey

  const iconLabel =
    colorSchemaKeyForLable === 'light'
      ? 'aus'
      : colorSchemaKeyForLable === 'dark'
      ? 'ein'
      : 'auto'

  const Icon = React.forwardRef((props, ref) => (
    <IconButton
      Icon={MdBrightness2}
      label={`Nachtmodus: ${iconLabel}`}
      labelShort={`Nachtmodus: ${iconLabel}`}
      ref={ref}
      {...props}
    />
  ))

  return (
    <CalloutMenu Element={Icon}>
      <div style={{ maxWidth: 180 }}>
        {pageColorSchemeKey !== 'auto' ? (
          <Label>Diese Seite unterstütz den Nachtmodus nicht</Label>
        ) : (
          <Interaction.P>
            <Radio
              value='dark'
              checked={colorSchemeKey === 'dark'}
              onChange={event => setColorSchemeKey(event.target.value)}
            >
              Ein
            </Radio>
            <br />
            <Radio
              value='light'
              checked={colorSchemeKey === 'light'}
              onChange={event => setColorSchemeKey(event.target.value)}
            >
              Aus
            </Radio>
            <br />
            <Radio
              // default auto is undefined
              value={undefined}
              checked={!colorSchemeKey}
              onChange={event => setColorSchemeKey(event.target.value)}
            >
              Automatisch
            </Radio>
          </Interaction.P>
        )}
      </div>
    </CalloutMenu>
  )
}

export default DarkmodeSwitch

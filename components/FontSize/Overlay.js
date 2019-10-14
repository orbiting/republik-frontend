import React, { useEffect, useRef } from 'react'

import {
  DEFAULT_FONT_SIZE, Overlay, OverlayBody,
  OverlayToolbar, OverlayToolbarConfirm,
  Interaction, Slider, mediaQueries,
  fontStyles, colors,
  Editorial, Collapsable
} from '@project-r/styleguide'

import MdClose from 'react-icons/lib/md/close'
import withT from '../../lib/withT'
import { compose } from 'react-apollo'

import { useFontSize } from '../../lib/fontSize'
import { css } from 'glamor'
import track from '../../lib/piwik'

const FontSizeOverlay = ({ t, onClose }) => {
  const [fontSize, setFontSize] = useFontSize(DEFAULT_FONT_SIZE)
  const fontPercentage = useRef()
  fontPercentage.current = `${Math.round(100 * fontSize / DEFAULT_FONT_SIZE)}%`

  const styles = {
    label: css({
      ...fontStyles.sansSerifRegular14,
      color: colors.secondary
    }),
    preview: css({
      borderTop: `1px solid ${colors.text}`,
      fontSize: fontSize
    }),
    subhead: css({
      marginTop: 12,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      fontSize: '1.1875em',
      lineHeight: '1.25',
      [mediaQueries.mUp]: {
        fontSize: '1.5em'
      }
    }),
    paragraph: css({
      fontSize: '1.0625em',
      lineHeight: '1.578em',
      [mediaQueries.mUp]: {
        fontSize: '1.1875em'
      }
    })
  }

  const trackFontSize = (action) => {
    track([
      'trackEvent',
      'FontSize',
      action,
      fontPercentage.current
    ])
  }

  useEffect(() => {
    trackFontSize('openOverlay')
    return () => { trackFontSize('closeOverlay') }
  }, [])

  return (
    <Overlay onClose={onClose} mUpStyle={{ maxWidth: 400, minHeight: 'none' }}>
      <OverlayToolbar>
        <Interaction.Emphasis style={{ padding: '15px 20px', fontSize: 16 }}>
          {t('article/actionbar/fontSize/title')}
        </Interaction.Emphasis>
        <OverlayToolbarConfirm
          onClick={onClose}
          label={<MdClose size={24} fill='#000' />}
        />
      </OverlayToolbar>
      <OverlayBody>
        <div>
          <label {...styles.label}>{fontPercentage.current}</label>
          <Slider
            value={fontSize}
            min='8'
            max='48'
            step='0.16'
            title={fontPercentage.current}
            onChange={(e, newValue) => { setFontSize(newValue) }}
            fullWidth />
          <br />
        </div>
        <div>
          <p>{t('article/actionbar/fontSize/example')}</p>
          <div {...styles.preview}>
            <Editorial.Subhead {...styles.subhead}>Hinter den Wortbergen</Editorial.Subhead>
            <Collapsable t={t} alwaysCollapsed>
              <Editorial.P {...styles.paragraph}>
                Weit hinten, hinter den Wortbergen, fern der Länder Vokalien und Konsonantien leben die Blindtexte.
                Abgeschieden wohnen sie in Buchstabhausen an der Küste des Semantik, eines grossen Sprachozeans. Ein
                kleines Bächlein namens Duden fliesst durch ihren Ort und versorgt sie mit den nötigen Regelialien. Es
                ist ein paradiesmatisches Land, in dem einem gebratene Satzteile in den Mund fliegen.
              </Editorial.P>
            </Collapsable>
          </div>
        </div>
      </OverlayBody>
    </Overlay>
  )
}

export default compose(withT)(FontSizeOverlay)

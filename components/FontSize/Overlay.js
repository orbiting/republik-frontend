import React, { useEffect, useRef } from 'react'

import {
  DEFAULT_FONT_SIZE,
  Overlay,
  OverlayBody,
  OverlayToolbar,
  OverlayToolbarConfirm,
  Interaction,
  Slider,
  mediaQueries,
  fontStyles,
  colors,
  Editorial,
  Collapsable,
  Button,
  plainButtonRule
} from '@project-r/styleguide'

import { MdClose, MdAdd, MdRemove } from 'react-icons/md'

import withT from '../../lib/withT'
import { compose } from 'react-apollo'

import { useFontSize } from '../../lib/fontSize'
import { css } from 'glamor'
import track from '../../lib/piwik'

const FONT_SIZE_STEP = 3.2
const MIN_FONT_SIZE = 8
const MAX_FONT_SIZE = 48

const FontSizeOverlay = ({ t, onClose }) => {
  const [fontSize, setFontSize] = useFontSize(DEFAULT_FONT_SIZE)
  const fontPercentage = useRef()
  fontPercentage.current = `${Math.round(
    (100 * fontSize) / DEFAULT_FONT_SIZE
  )}%`

  const styles = {
    label: css({
      ...fontStyles.sansSerifRegular17,
      color: colors.text
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
    }),
    iconButton: css({
      fontSize: 24,
      padding: '20px 20px 10px'
    }),
    reset: css({
      ...fontStyles.sansSerifRegular13,
      color: colors.lightText,
      padding: '0 20px 20px'
    }),
    container: css({
      textAlign: 'center'
    })
  }

  const trackFontSize = action => {
    track(['trackEvent', 'FontSize', action, fontPercentage.current])
  }

  useEffect(() => {
    trackFontSize('openOverlay')
    return () => {
      trackFontSize('closeOverlay')
    }
  }, [])

  const increaseFontSize = () =>
    fontSize < MAX_FONT_SIZE && setFontSize(fontSize + FONT_SIZE_STEP)

  const decreaseFontSize = () =>
    fontSize > MIN_FONT_SIZE && setFontSize(fontSize - FONT_SIZE_STEP)

  const resetFontSize = () => setFontSize(DEFAULT_FONT_SIZE)

  return (
    <Overlay onClose={onClose} mUpStyle={{ maxWidth: 375, minHeight: 'none' }}>
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
        <div {...styles.container}>
          <button
            {...plainButtonRule}
            {...styles.iconButton}
            title={t('article/actionbar/fontSize/decrease')}
            onClick={decreaseFontSize}
          >
            <MdRemove />
          </button>
          <label {...styles.label}>{fontPercentage.current}</label>
          <button
            {...plainButtonRule}
            {...styles.iconButton}
            title={t('article/actionbar/fontSize/increase')}
            onClick={increaseFontSize}
          >
            <MdAdd />
          </button>
          <div {...styles.container}>
            <button
              {...plainButtonRule}
              {...styles.reset}
              onClick={resetFontSize}
              title={t('article/actionbar/fontSize/reset')}
            >
              {t('article/actionbar/fontSize/reset')}
            </button>
          </div>
        </div>
        <div>
          <p>{t('article/actionbar/fontSize/example')}</p>
          <div {...styles.preview}>
            <Editorial.Subhead {...styles.subhead}>
              Hinter den Wortbergen
            </Editorial.Subhead>
            <Collapsable t={t} alwaysCollapsed>
              <Editorial.P {...styles.paragraph}>
                Weit hinten, hinter den Wortbergen, fern der Länder Vokalien und
                Konsonantien leben die Blindtexte. Abgeschieden wohnen sie in
                Buchstabhausen an der Küste des Semantik, eines grossen
                Sprachozeans. Ein kleines Bächlein namens Duden fliesst durch
                ihren Ort und versorgt sie mit den nötigen Regelialien. Es ist
                ein paradiesmatisches Land, in dem einem gebratene Satzteile in
                den Mund fliegen.
              </Editorial.P>
            </Collapsable>
          </div>
        </div>
      </OverlayBody>
    </Overlay>
  )
}

export default compose(withT)(FontSizeOverlay)

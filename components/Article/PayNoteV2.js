import React from 'react'
import {
  BrandMark,
  Interaction,
  Center,
  mediaQueries,
  Button
} from '@project-r/styleguide'
import TrialForm from '../Trial/Form'
// import { MdArrowForward } from 'react-icons/lib/md'
import { css, merge } from 'glamor'
import { randomElement } from '../../lib/utils/helpers'
import { trackEventOnClick } from '../../lib/piwik'
import { Router } from '../../lib/routes'

const TRY_TO_BUY_RATIO = 1

const BG_COLORS = [
  '#cfefd7',
  '#fdb26e',
  '#f9eca1',
  '#6bd076'
]

// TODO: add all versions
const TRY_VARIATIONS = [
  'tryNote/191023-v1',
  'tryNote/191023-v2'
]

const BUY_VARIATIONS = [
  'payNote/190305-v1',
  'payNote/190305-v2',
  'payNote/190305-v3',
  'payNote/190305-v4',
  'payNote/190305-v5',
  'payNote/190305-v6',
  'payNote/190305-v7',
  'payNote/190305-v8',
  'payNote/190305-v9'
]

const BUY_SERIES = 'payNote/series'

const getTryVariation = () => randomElement(TRY_VARIATIONS)

const getBuyVariation = (isSeries) => isSeries ? BUY_SERIES : randomElement(BUY_VARIATIONS)

const isTryNote = (variation) => variation.indexOf('tryNote') !== -1

export const getPayNoteVariation = (isMember, isActiveMember, isSeries) => {
  if (isActiveMember) {
    return
  }
  return isMember || Math.random() > TRY_TO_BUY_RATIO ? getBuyVariation(isSeries) : getTryVariation()
}

export const getPayNoteColor = () => randomElement(BG_COLORS)

// TODO: add members count
const getPayNoteText = (t, variation, position, element) => {
  return t(`article/${variation}/${position}${element ? '/' + element : ''}`)
}

const BuyNoteCta = ({ variation, position, t }) => {
  return (<Button style={{ marginTop: 10 }} black onClick={trackEventOnClick(
    ['PayNote', `pledge ${position}`, variation],
    () => {
      Router.pushRoute('pledge').then(() => window.scrollTo(0, 0))
    }
  )}>
    {getPayNoteText(t, variation, position, 'buy/button')}
  </Button>)
}

// TODO: configure/style import form
const PayNoteCta = ({ variation, position, t }) => {
  return isTryNote(variation)
    ? <TrialForm />
    : <BuyNoteCta variation={variation} position={position} t={t} />
}

// TODO: get membership count in article and pass it here
const PayNoteContainer = ({ inNativeIOSApp, variation, position, t, bgColor }) => {
  const variationInclIos = inNativeIOSApp ? 'payNote/ios' : variation
  const lead = getPayNoteText(t, variationInclIos, position, 'title')
  const body = getPayNoteText(t, variationInclIos, position)
  const cta = inNativeIOSApp ? null : <PayNoteCta variation={variation} position={position} t={t} />
  const styles = {
    banner: css({
      backgroundColor: bgColor,
      paddingBottom: 10
    }),
    brand: css({
      display: 'none',
      width: 40,
      float: 'left',
      verticalAlign: 'top',
      margin: '10px 0 0 -60px',
      [mediaQueries.mUp]: {
        display: 'initial'
      }
    }),
    body: css({
      margin: 0,
      paddingBottom: 0,
      color: '#000000'
    })
  }
  const beforeStyles = {
    banner: css({
      marginTop: -20,
      marginBottom: 40
    }),
    brand: css({
      [mediaQueries.mUp]: {
        display: 'none'
      }
    })
  }
  const isBefore = position === 'before'

  return (<div {...merge(styles.banner, isBefore && beforeStyles.banner)}>
    <Center>
      <div {...merge(styles.brand, isBefore && beforeStyles.brand)}>
        <BrandMark />
      </div>
      <Interaction.P {...styles.body}>
        <b>{lead}</b> <span dangerouslySetInnerHTML={{ __html: body }} />
      </Interaction.P>
      {cta}
    </Center>
  </div>)
}

export const PayNote = ({ variation, ...props }) => {
  return variation ? <PayNoteContainer variation={variation} {...props} /> : null
}

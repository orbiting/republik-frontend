import React from 'react'
import {
  Field,
  BrandMark,
  Interaction,
  Center,
  mediaQueries,
  Button
} from '@project-r/styleguide'
import { MdArrowForward } from 'react-icons/lib/md'
import { css, merge } from 'glamor'
import { randomElement } from '../../lib/utils/helpers'
import { trackEventOnClick } from '../../lib/piwik'
import { Router } from '../../lib/routes'

const TRY_TO_BUY_RATIO = 1

const BG_COLORS = [
  '#ff7669',
  '#cfefd7',
  '#fdb26e',
  '#8ee6fd',
  '#f9eca1',
  '#6bd076'
]

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
  return isMember || Math.random() > TRY_TO_BUY_RATIO ? getBuyVariation() : getTryVariation()
}

export const getPayNoteColor = () => randomElement(BG_COLORS)

// TODO: get count
const getPayNoteText = (t, variation, position, element) => {
  return t(`article/${variation}/${position}${element ? '/' + element : ''}`)
}

const BuyNoteCa = ({ variation, position, t }) => {
  return (<Button style={{ marginTop: 10 }} black onClick={trackEventOnClick(
    ['PayNote', `pledge ${position}`, variation],
    () => {
      Router.pushRoute('pledge').then(() => window.scrollTo(0, 0))
    }
  )}>
    {getPayNoteText(t, variation, position, 'buy/button')}
  </Button>)
}

// TODO: implement form
const TryNoteCa = () => {
  return <>
    <div style={{ maxWidth: 300 }}><Field black label='Email' icon={<MdArrowForward size={30} />} /></div>
    </>
}

// TODO: implement
const IosNote = () => null

const PayNoteCta = ({ variation, position, inNativeIOSApp, t }) => {
  if (inNativeIOSApp) {
    return <IosNote />
  }
  return isTryNote(variation)
    ? <TryNoteCa />
    : <BuyNoteCa variation={variation} position={position} t={t} />
}

// TODO: get membership count here
const PayNoteContainer = ({ inNativeIOSApp, variation, position, t, bgColor }) => {
  const lead = getPayNoteText(t, variation, position, 'title')
  const body = getPayNoteText(t, variation, position)
  const cta = <PayNoteCta variation={variation} inNativeIOSApp={inNativeIOSApp} position={position} t={t} />
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

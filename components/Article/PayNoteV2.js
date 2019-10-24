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
import { getElementFromSeed } from '../../lib/utils/helpers'
import { trackEventOnClick } from '../../lib/piwik'
import { Router } from '../../lib/routes'
import { compose, graphql } from 'react-apollo'
import withT from '../../lib/withT'
import withInNativeApp from '../../lib/withInNativeApp'
import gql from 'graphql-tag'
import { countFormat } from '../../lib/utils/format'
import withMemberStatus from '../../lib/withMemberStatus'

const styles = {
  banner: css({
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

const memberShipQuery = gql`
query payNoteMembershipStats {
  membershipStats {
    count
  }
}
`

const TRY_TO_BUY_RATIO = 0.8

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

export const MAX_PAYNOTE_SEED = Math.max(BG_COLORS.length, TRY_VARIATIONS.length, BUY_VARIATIONS.length)

const BUY_SERIES = 'payNote/series'

const getTryVariation = (seed) => getElementFromSeed(TRY_VARIATIONS, seed)

const getBuyVariation = (seed, isSeries) => isSeries ? BUY_SERIES : getElementFromSeed(BUY_VARIATIONS, seed)

const isTryNote = (variation) => variation.indexOf('tryNote') !== -1

const getPayNoteVariation = (hasOngoingTrial, isActiveMember, isSeries, seed) => {
  if (isActiveMember) {
    return
  }
  return hasOngoingTrial || Math.random() > TRY_TO_BUY_RATIO
    ? getBuyVariation(seed, isSeries) : getTryVariation(seed)
}

const getPayNoteColor = (seed) => getElementFromSeed(BG_COLORS, seed)

const initTranslator = (t, membershipStats) => (variation, position, element = undefined) => {
  console.log(countFormat((membershipStats && membershipStats.count) || 20000))
  return t.elements(`article/${variation}/${position}${element ? '/' + element : ''}`, {
    count: <span>20000</span> })
}

const BuyNoteCta = ({ variation, position, translator }) => {
  return (<Button style={{ marginTop: 10 }} black onClick={trackEventOnClick(
    ['PayNote', `pledge ${position}`, variation],
    () => {
      Router.pushRoute('pledge').then(() => window.scrollTo(0, 0))
    }
  )}>
    {translator(variation, position, 'buy/button')}
  </Button>)
}

// TODO: configure/style import form
const PayNoteCta = ({ variation, position, t }) => {
  return isTryNote(variation)
    ? <TrialForm />
    : <BuyNoteCta variation={variation} position={position} t={t} />
}

const PayNoteContainer = compose(
  withT,
  withInNativeApp,
  graphql(memberShipQuery)
)(({ t, inNativeIOSApp, data: { membershipStats }, variation, bgColor, position }) => {
  const translator = initTranslator(t, membershipStats)
  const variationInclIos = inNativeIOSApp ? 'payNote/ios' : variation
  const lead = translator(variationInclIos, position, 'title')
  const body = translator(variationInclIos, position)
  const cta = inNativeIOSApp ? null : <PayNoteCta variation={variation} position={position} translator={translator} />
  const isBefore = position === 'before'

  return (<div {...merge(styles.banner, isBefore && beforeStyles.banner)} style={{ backgroundColor: bgColor }}>
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
})

export const PayNote = compose(
  withMemberStatus
)(({ isActiveMember, hasOngoingTrial, seed, series, position }) => {
  const variation = getPayNoteVariation(hasOngoingTrial, isActiveMember, series, seed)
  const bgColor = getPayNoteColor(seed)

  return variation ? <PayNoteContainer variation={variation} bgColor={bgColor} position={position} /> : null
})

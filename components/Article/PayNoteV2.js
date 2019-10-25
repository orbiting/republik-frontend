import React from 'react'
import ReactDOMServer from 'react-dom/server'
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
    margin: '40px auto'
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

const TRY_VARIATIONS = [
  'tryNote/191023-v1',
  'tryNote/191023-v2',
  'tryNote/191023-v3',
  'tryNote/191023-v4',
  'tryNote/191023-v5',
  'tryNote/191023-v6',
  'tryNote/191023-v7',
  'tryNote/191023-v8',
  'tryNote/191023-v9',
  'tryNote/191023-v10',
  'tryNote/191023-v11',
  'tryNote/191023-v12',
  'tryNote/191023-v13',
  'tryNote/191023-v14',
  'tryNote/191023-v15',
  'tryNote/191023-v16',
  'tryNote/191023-v17',
  'tryNote/191023-v18',
  'tryNote/191023-v19'
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

const showBuyInsteadOfTry = (seed) => (seed / MAX_PAYNOTE_SEED) > TRY_TO_BUY_RATIO

const getPayNoteVariation = (hasOngoingTrial, isSeries, seed) => {
  return hasOngoingTrial || showBuyInsteadOfTry(seed)
    ? getBuyVariation(seed, isSeries) : getTryVariation(seed)
}

const getPayNoteColor = (seed) => getElementFromSeed(BG_COLORS, seed)

const MembersCount = ({ membershipStats }) => (
  <span style={{ whiteSpace: 'nowrap' }}>{countFormat(
    (membershipStats && membershipStats.count) || 20000
  )}</span>
)

const initTranslator = (t, membershipStats) => (variation, position, element = undefined) => {
  // react elements don't get rendered by dangerouslySetInnerHTML,
  // which we use because we want to support <b> tags, hence this mumbo-jumbo below
  return t.elements(
    `article/${variation}/${position}${element ? '/' + element : ''}`, {
      count: ReactDOMServer.renderToStaticMarkup(<MembersCount key='count' membershipStats={membershipStats} />)
    }).join('')
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
const PayNoteCta = ({ variation, position, translator }) => {
  return isTryNote(variation)
    ? <TrialForm />
    : <BuyNoteCta variation={variation} position={position} translator={translator} />
}

export const PayNote = compose(
  withT,
  withInNativeApp,
  withMemberStatus,
  graphql(memberShipQuery)
)(({ t, inNativeIOSApp, hasOngoingTrial, data: { membershipStats }, seed, series, position }) => {
  const translator = initTranslator(t, membershipStats)
  const variation = inNativeIOSApp ? 'payNote/ios' : getPayNoteVariation(hasOngoingTrial, series, seed)
  const bgColor = getPayNoteColor(seed)
  const lead = translator(variation, position, 'title')
  const body = translator(variation, position)
  console.log('BODY', body)
  const cta = !inNativeIOSApp && <PayNoteCta variation={variation} position={position} translator={translator} />
  const isBefore = position === 'before'

  return (<div {...merge(styles.banner, isBefore && beforeStyles.banner)} style={{ backgroundColor: bgColor }}>
    <Center>
      <div {...merge(styles.brand, isBefore && beforeStyles.brand)}>
        <BrandMark />
      </div>
      <Interaction.P {...styles.body}>
        <b dangerouslySetInnerHTML={{ __html: lead }} /> <span dangerouslySetInnerHTML={{ __html: body }} />
      </Interaction.P>
      {cta}
    </Center>
  </div>)
})

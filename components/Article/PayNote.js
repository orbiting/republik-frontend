import React from 'react'
import {
  BrandMark,
  Interaction,
  Center,
  mediaQueries,
  Button,
  colors,
  fontStyles,
  linkBlackStyle
} from '@project-r/styleguide'
import TrialForm from '../Trial/Form'
import { css, merge } from 'glamor'
import { getElementFromSeed } from '../../lib/utils/helpers'
import { trackEventOnClick } from '../../lib/piwik'
import { Router, routes } from '../../lib/routes'
import { compose, graphql } from 'react-apollo'
import withT from '../../lib/withT'
import withInNativeApp from '../../lib/withInNativeApp'
import gql from 'graphql-tag'
import { countFormat } from '../../lib/utils/format'
import withMemberStatus from '../../lib/withMemberStatus'
import { TRIAL_CAMPAIGN } from '../../lib/constants'

const styles = {
  banner: css({
    backgroundColor: colors.social,
    padding: '5px 0'
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
  }),
  cta: css({
    marginTop: 10
  }),
  actions: css({
    display: 'flex',
    flexDirection: 'column',
    [mediaQueries.mUp]: {
      alignItems: 'center',
      flexDirection: 'row'
    }
  }),
  aside: css({
    marginTop: 15,
    ...fontStyles.sansSerifRegular16,
    '& a': linkBlackStyle,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular18,
      marginLeft: 30,
      marginTop: 0
    }
  })
}

const beforeStyles = {
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

export const MAX_PAYNOTE_SEED = Math.max(TRY_VARIATIONS.length, BUY_VARIATIONS.length)

const BUY_SERIES = 'payNote/series'

const goTo = (route) => Router.pushRoute(route).then(() => window.scrollTo(0, 0))

const isTryNote = (variation) => variation.indexOf('tryNote') !== -1

const getTryVariation = (seed) => getElementFromSeed(TRY_VARIATIONS, seed)

const getBuyVariation = (seed, isSeries) => isSeries ? BUY_SERIES : getElementFromSeed(BUY_VARIATIONS, seed)

const showBuyInsteadOfTry = (seed) => (seed / MAX_PAYNOTE_SEED) > TRY_TO_BUY_RATIO

const getPayNoteVariation = (hasOngoingTrial, isSeries, seed) => {
  return hasOngoingTrial || showBuyInsteadOfTry(seed)
    ? getBuyVariation(seed, isSeries) : getTryVariation(seed)
}

const MembersCount = ({ membershipStats }) => (
  <span style={{ whiteSpace: 'nowrap' }}>{countFormat(
    (membershipStats && membershipStats.count) || 20000
  )}</span>
)

const initTranslator = (t, membershipStats) => (variation, position, element = undefined) => {
  const baseKey = `article/${variation}/${position}${element ? '/' + element : ''}`
  return t.elements(baseKey, {
    emphasis: <Interaction.Emphasis>{t(`${baseKey}/emphasis`)}</Interaction.Emphasis>,
    count: <MembersCount key='count' membershipStats={membershipStats} />
  })
}

const BuyButton = ({ variation, position, translator }) => {
  return <Button primary black onClick={trackEventOnClick(
    ['PayNote', `pledge ${position}`, variation],
    () => goTo('pledge')
  )}>
    {translator(variation, position, 'buy/button')}
  </Button>
}

const TrialLink = compose(withT)(({ t, variation }) => {
  return <div {...styles.aside}>
    {t.elements('article/payNote/secondaryAction/text', {
      link:
        (<a key='trial'
          href={routes.find(r => r.name === 'trial').toPath()}
          onClick={trackEventOnClick(
            ['PayNote', 'preview after', variation],
            () => goTo('trial')
          )}>
          {t('article/payNote/secondaryAction/linkText')}
        </a>)
    })}
  </div>
})

const BuyNoteCta = ({ variation, position, translator, hasOngoingTrial }) => {
  return <div {...styles.actions}>
    <BuyButton variation={variation} position={position} translator={translator} />
    {!hasOngoingTrial && <TrialLink variation={variation} />}
  </div>
}

const PayNoteCta = ({ variation, position, translator, hasOngoingTrial }) => {
  return <div {...styles.cta}>
    {isTryNote(variation)
      ? <TrialForm accessCampaignId={TRIAL_CAMPAIGN} minimal />
      : <BuyNoteCta
        variation={variation}
        position={position}
        translator={translator}
        hasOngoingTrial={hasOngoingTrial} />}
  </div>
}

export const PayNote = compose(
  withT,
  withInNativeApp,
  withMemberStatus,
  graphql(memberShipQuery)
)(({ t, inNativeIOSApp, hasOngoingTrial, data: { membershipStats }, seed, series, position }) => {
  const translator = initTranslator(t, membershipStats)
  const variation = inNativeIOSApp ? 'payNote/ios' : getPayNoteVariation(hasOngoingTrial, series, seed)
  const lead = translator(variation, position, 'title')
  const body = translator(variation, position)
  const cta = !inNativeIOSApp &&
    <PayNoteCta
      variation={variation}
      position={position}
      translator={translator}
      hasOngoingTrial={hasOngoingTrial} />
  const isBefore = position === 'before'

  return <div {...styles.banner}>
    <Center>
      <div {...merge(styles.brand, isBefore && beforeStyles.brand)}>
        <BrandMark />
      </div>
      <Interaction.P {...styles.body}>
        <Interaction.Emphasis>{lead}</Interaction.Emphasis> {body}
      </Interaction.P>
      {cta}
    </Center>
  </div>
})

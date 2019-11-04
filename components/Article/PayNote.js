import React from 'react'
import {
  Interaction,
  Center,
  mediaQueries,
  Button,
  colors,
  fontStyles,
  linkRule
} from '@project-r/styleguide'
import TrialForm from '../Trial/Form'
import { css } from 'glamor'
import { getElementFromSeed } from '../../lib/utils/helpers'
import { trackEventOnClick } from '../../lib/piwik'
import { Router, routes } from '../../lib/routes'
import NativeRouter, { withRouter } from 'next/router'
import { compose, graphql } from 'react-apollo'
import withT from '../../lib/withT'
import withInNativeApp from '../../lib/withInNativeApp'
import gql from 'graphql-tag'
import { countFormat } from '../../lib/utils/format'
import withMemberStatus from '../../lib/withMemberStatus'
import { TRIAL_CAMPAIGN } from '../../lib/constants'

const styles = {
  banner: css({
    padding: '5px 0'
  }),
  body: css({
    margin: 0,
    paddingBottom: 0
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
    color: colors.lightText,
    ...fontStyles.sansSerifRegular16,
    '& a': linkRule,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular18,
      marginLeft: 30,
      marginTop: 0
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

const BUY_SERIES = 'payNote/series'

export const MAX_PAYNOTE_SEED = Math.max(
  TRY_VARIATIONS.length,
  BUY_VARIATIONS.length
)

const goTo = route => Router.pushRoute(route).then(() => window.scrollTo(0, 0))

const isTryNote = variation => variation.indexOf('tryNote') !== -1

const getTryVariation = seed => getElementFromSeed(TRY_VARIATIONS, seed)

const getBuyVariation = (seed, isSeries) =>
  isSeries ? BUY_SERIES : getElementFromSeed(BUY_VARIATIONS, seed)

const showBuyInsteadOfTry = seed => seed / MAX_PAYNOTE_SEED > TRY_TO_BUY_RATIO

const getPayNoteVariation = (hasOngoingTrial, isSeries, seed) => {
  return hasOngoingTrial || showBuyInsteadOfTry(seed)
    ? getBuyVariation(seed, isSeries)
    : getTryVariation(seed)
}

const MembersCount = ({ membershipStats }) => (
  <span style={{ whiteSpace: 'nowrap' }}>
    {countFormat((membershipStats && membershipStats.count) || 20000)}
  </span>
)

const translate = (
  t,
  membershipStats,
  variation,
  position,
  element = undefined
) => {
  const baseKey = `article/${variation}/${position}${
    element ? '/' + element : ''
  }`
  return t.elements(baseKey, {
    emphasis: (
      <Interaction.Emphasis key="emphasis">
        {t(`${baseKey}/emphasis`)}
      </Interaction.Emphasis>
    ),
    count: <MembersCount key="count" membershipStats={membershipStats} />
  })
}

const BuyButton = compose(withT)(
  ({ t, variation, position, membershipStats }) => {
    return (
      <Button
        primary
        onClick={trackEventOnClick(
          ['PayNote', `pledge ${position}`, variation],
          () => goTo('pledge')
        )}
      >
        {translate(t, membershipStats, variation, position, 'buy/button')}
      </Button>
    )
  }
)

const TrialLink = compose(withT)(({ t, variation }) => {
  return (
    <div {...styles.aside}>
      {t.elements('article/payNote/secondaryAction/text', {
        link: (
          <a
            key="trial"
            href={routes.find(r => r.name === 'trial').toPath()}
            onClick={trackEventOnClick(
              ['PayNote', 'preview after', variation],
              () => goTo('trial')
            )}
          >
            {t('article/payNote/secondaryAction/linkText')}
          </a>
        )
      })}
    </div>
  )
})

const BuyNoteCta = ({
  variation,
  position,
  membershipStats,
  isTrialContext,
  darkMode
}) => {
  return (
    <div {...styles.actions}>
      <BuyButton
        variation={variation}
        position={position}
        translator={membershipStats}
      />
      {!isTrialContext && position === 'after' && (
        <TrialLink variation={variation} darkMode={darkMode} />
      )}
    </div>
  )
}

const TryNoteCta = compose(withRouter)(({ router, darkMode }) => {
  return (
    <TrialForm
      beforeSignIn={() => {
        // use native router for shadow routing
        NativeRouter.push(
          {
            pathname: '/article',
            query: { trialSignup: 1 }
          },
          router.asPath,
          { shallow: true }
        )
      }}
      onSuccess={() => {
        return false
      }}
      accessCampaignId={TRIAL_CAMPAIGN}
      darkMode={darkMode}
      minimal
    />
  )
})

const PayNoteCta = ({
  variation,
  position,
  membershipStats,
  isTrialContext,
  darkMode
}) => {
  return (
    <div {...styles.cta}>
      {isTryNote(variation) ? (
        <TryNoteCta darkMode={darkMode} />
      ) : (
        <BuyNoteCta
          darkMode={darkMode}
          variation={variation}
          position={position}
          membershipStats={membershipStats}
          isTrialContext={isTrialContext}
        />
      )}
    </div>
  )
}

export const PayNote = compose(
  withT,
  withRouter,
  withInNativeApp,
  withMemberStatus,
  graphql(memberShipQuery)
)(
  ({
    t,
    router,
    inNativeIOSApp,
    hasOngoingTrial,
    data: { membershipStats },
    seed,
    series,
    position
  }) => {
    const isTrialContext = hasOngoingTrial && !router.query.trialSignup
    const variation = inNativeIOSApp
      ? 'payNote/ios'
      : getPayNoteVariation(isTrialContext, series, seed)
    const showThankYouNote = hasOngoingTrial && isTryNote(variation)
    const lead = showThankYouNote
      ? t('article/tryNote/thankYou')
      : translate(t, membershipStats, variation, position, 'title')
    const body =
      !showThankYouNote && translate(t, membershipStats, variation, position)
    const isBefore = position === 'before'
    const cta = !inNativeIOSApp && (
      <PayNoteCta
        darkMode={isBefore}
        variation={variation}
        position={position}
        membershipStats={membershipStats}
        isTrialContext={isTrialContext}
      />
    )

    return (
      <div
        {...styles.banner}
        style={{
          backgroundColor: isBefore
            ? colors.negative.primaryBg
            : colors.primaryBg
        }}
      >
        <Center>
          <Interaction.P
            {...styles.body}
            style={{ color: isBefore ? colors.negative.text : '#000000' }}
          >
            <Interaction.Emphasis>{lead}</Interaction.Emphasis> {body}
          </Interaction.P>
          {cta}
        </Center>
      </div>
    )
  }
)

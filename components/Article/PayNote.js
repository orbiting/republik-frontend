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
  '191023-v1',
  '191023-v2',
  '191023-v3',
  '191023-v4',
  '191023-v5',
  '191023-v6',
  '191023-v7',
  '191023-v8',
  '191023-v9',
  '191023-v10',
  '191023-v11',
  '191023-v12',
  '191023-v13',
  '191023-v14',
  '191023-v15',
  '191023-v16',
  '191023-v17',
  '191023-v18',
  '191023-v19'
]

const BUY_VARIATIONS = [
  '190305-v1',
  '190305-v2',
  '190305-v3',
  '190305-v4',
  '190305-v5',
  '190305-v6',
  '190305-v7',
  '190305-v8',
  '190305-v9'
]

const BUY_SERIES = 'series'

export const MAX_PAYNOTE_SEED = Math.max(
  TRY_VARIATIONS.length,
  BUY_VARIATIONS.length
)

const goTo = route => Router.pushRoute(route).then(() => window.scrollTo(0, 0))

const getTryVariation = seed => {
  return {
    key: `article/tryNote/${getElementFromSeed(TRY_VARIATIONS, seed)}`,
    cta: 'try'
  }
}

const getBuyVariation = (seed, isSeries) => {
  const variation = isSeries
    ? BUY_SERIES
    : getElementFromSeed(BUY_VARIATIONS, seed)
  return {
    key: `article/payNote/${variation}`,
    cta: 'buy'
  }
}

const showTry = seed => seed / MAX_PAYNOTE_SEED < TRY_TO_BUY_RATIO

const getPayNoteVariation = (
  inNativeIOSApp,
  isEligibleForTrial,
  isSeries,
  seed
) => {
  if (inNativeIOSApp) {
    return {
      key: 'article/payNote/ios'
    }
  }
  return isEligibleForTrial && showTry(seed)
    ? getTryVariation(seed)
    : getBuyVariation(seed, isSeries)
}

const translate = (
  t,
  membershipStats,
  variation,
  position,
  element = undefined
) => {
  const baseKey = `${variation}/${position}${element ? '/' + element : ''}`
  return t.elements(baseKey, {
    emphasis: (
      <Interaction.Emphasis key="emphasis">
        {t(`${baseKey}/emphasis`)}
      </Interaction.Emphasis>
    ),
    count: countFormat((membershipStats && membershipStats.count) || 20000)
  })
}

const BuyButton = compose(withT)(
  ({ t, variation, position, membershipStats }) => {
    return (
      <Button
        primary
        onClick={trackEventOnClick(
          ['PayNote', `pledge ${position}`, variation.key],
          () => goTo('pledge')
        )}
      >
        {translate(t, membershipStats, variation.key, position, 'buy/button')}
      </Button>
    )
  }
)

const TrialLink = compose(withT)(({ t, variation }) => {
  const tKey = 'article/payNote/secondaryAction'
  return (
    <div {...styles.aside}>
      {t.elements(`${tKey}/text`, {
        link: (
          <a
            key="trial"
            href={routes.find(r => r.name === 'trial').toPath()}
            onClick={trackEventOnClick(
              ['PayNote', 'preview after', variation],
              () => goTo('trial')
            )}
          >
            {t(`${tKey}/linkText`)}
          </a>
        )
      })}
    </div>
  )
})

const BuyNoteCta = compose(withMemberStatus)(
  ({ isEligibleForTrial, variation, position, membershipStats }) => {
    return (
      <div {...styles.actions}>
        <BuyButton
          variation={variation}
          position={position}
          membershipStats={membershipStats}
        />
        {isEligibleForTrial && position === 'after' && (
          <TrialLink variation={variation} />
        )}
      </div>
    )
  }
)

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

const PayNoteCta = ({ variation, position, membershipStats, darkMode }) => {
  return (
    <div {...styles.cta}>
      {variation.cta === 'try' ? (
        <TryNoteCta darkMode={darkMode} />
      ) : (
        <BuyNoteCta
          variation={variation}
          position={position}
          membershipStats={membershipStats}
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
    isEligibleForTrial,
    data: { membershipStats },
    seed,
    series,
    position
  }) => {
    const isTrialThankYou = !isEligibleForTrial && router.query.trialSignup
    const variation = getPayNoteVariation(
      inNativeIOSApp,
      isEligibleForTrial || isTrialThankYou,
      series,
      seed
    )
    const lead = isTrialThankYou
      ? t('article/tryNote/thankYou')
      : translate(t, membershipStats, variation.key, position, 'title')
    const body =
      !isTrialThankYou && translate(t, membershipStats, variation.key, position)
    const isBefore = position === 'before'
    const cta = !!variation.cta && (
      <PayNoteCta
        darkMode={isBefore}
        variation={variation}
        position={position}
        membershipStats={membershipStats}
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

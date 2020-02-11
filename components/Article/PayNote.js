import React from 'react'
import {
  Interaction,
  Center,
  mediaQueries,
  Button,
  colors,
  fontStyles,
  linkRule,
  RawHtml
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
import { capitalize, countFormat } from '../../lib/utils/format'
import withMemberStatus from '../../lib/withMemberStatus'
import { TRIAL_CAMPAIGNS, TRIAL_CAMPAIGN } from '../../lib/constants'
import { parseJSONObject } from '../../lib/safeJSON'

const trialCampaigns = parseJSONObject(TRIAL_CAMPAIGNS)
const trialAccessCampaignId =
  (trialCampaigns.paynote && trialCampaigns.paynote.accessCampaignId) ||
  TRIAL_CAMPAIGN

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

/*
const addPaynote = e => {
    e.preventDefault()
    const templatePaynote = {
      title: '',
      body: '',
      cta: 'trialForm',
      button: {
        label: '',
        link: '/angebote'
      }
    }
    onPaynotesChange(
      paynotes.concat({
        before: templatePaynote,
        after: templatePaynote
      })
    )
  }
*/

const memberShipQuery = gql`
  query payNoteMembershipStats {
    membershipStats {
      count
    }
  }
`

export const TRY_TO_BUY_RATIO = 0.5

const TRY_VARIATIONS = ['191106-v2', '191106-v3', '191106-v4']
// make sure to include in MAX_PAYNOTE_SEED if you add one with more
const TRY_VARIATIONS_CAMPAIGN = {
  wseww: ['191106-v1', '191106-v2-campaign-wseww', '191106-v3', '191106-v4']
}

const BUY_VARIATIONS = ['191108-v1', '191108-v2']

const BUY_SERIES = ['series']

export const MAX_PAYNOTE_SEED = Math.max(
  TRY_VARIATIONS.length,
  BUY_VARIATIONS.length
)

const goTo = route => Router.pushRoute(route).then(() => window.scrollTo(0, 0))

const buildKey = (payNote, position, element) =>
  [payNote.key, position, element].filter(el => el).join('/')

const addKeyShort = (note, index) => {
  return { ...note, keyShort: `custom-${index}` }
}

const getNoteVariation = (seed, noteType, cta, variations) => {
  const variation = getElementFromSeed(variations, seed, MAX_PAYNOTE_SEED)
  return {
    keyShort: variation,
    key: `article/${noteType}Note/${variation}`,
    cta: cta
  }
}

const getTryNote = (seed, { query }) => {
  const variations =
    TRY_VARIATIONS_CAMPAIGN[query.campaign || query.utm_campaign] ||
    TRY_VARIATIONS
  return getNoteVariation(seed, 'try', 'trialForm', variations)
}

const getBuyNote = (seed, { isSeries }) => {
  const variations = isSeries ? BUY_SERIES : BUY_VARIATIONS
  return getNoteVariation(seed, 'pay', 'button', variations)
}

const getCustomNote = (seed, customNotes) => {
  const note = getElementFromSeed(
    customNotes.map(addKeyShort),
    seed,
    MAX_PAYNOTE_SEED
  )
  return {
    keyShort: note.keyShort,
    custom: note
  }
}

const getPayNote = ({
  inNativeIOSApp,
  isEligibleForTrial,
  isSeries,
  seed,
  trial,
  query,
  customPayNotes
}) => {
  if (query.trialSignup && !isEligibleForTrial) {
    return {
      key: 'article/tryNote/thankYou',
      cta: 'trialForm'
    }
  }
  if (inNativeIOSApp && !isEligibleForTrial) {
    return {
      key: 'article/payNote/ios'
    }
  }
  if (customPayNotes) {
    return getCustomNote(seed, customPayNotes)
  }
  return isEligibleForTrial && (inNativeIOSApp || trial)
    ? getTryNote(seed, {
        query
      })
    : getBuyNote(seed, {
        isSeries
      })
}

const Translation = compose(
  withT,
  graphql(memberShipQuery)
)(({ t, data: { membershipStats }, payNote, position, element }) => {
  const key = payNote.key
    ? buildKey(payNote, position, element)
    : element || 'body'
  const count = countFormat((membershipStats && membershipStats.count) || 20000)
  const customText = payNote.custom && payNote.custom[position][key]
  return (
    <RawHtml
      dangerouslySetInnerHTML={{
        __html: customText
          ? customText.replace('{count}', count)
          : t(key, { count: count }, '')
      }}
    />
  )
})

const BuyButton = compose(withT)(({ t, payNote, position }) => {
  return (
    <Button
      primary
      onClick={trackEventOnClick(
        ['PayNote', `pledge ${position}`, payNote.keyShort],
        () =>
          goTo(payNote.custom ? payNote.custom[position].button.link : 'pledge')
      )}
    >
      {payNote.custom
        ? payNote.custom[position].button.label
        : t(buildKey(payNote, position, 'button'))}
    </Button>
  )
})

const TrialLink = compose(withT)(({ t, payNote }) => {
  const tKey = 'article/payNote/secondaryAction'
  return (
    <div {...styles.aside}>
      {t.elements(`${tKey}/text`, {
        link: (
          <a
            key='trial'
            href={routes.find(r => r.name === 'trial').toPath()}
            onClick={trackEventOnClick(
              ['PayNote', 'preview after', payNote.keyShort],
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
  ({ isEligibleForTrial, payNote, position }) => {
    return (
      <div {...styles.actions}>
        <BuyButton payNote={payNote} position={position} />
        {isEligibleForTrial && position === 'after' && (
          <TrialLink payNote={payNote} />
        )}
      </div>
    )
  }
)

const TryNoteCta = compose(withRouter)(({ router, darkMode, payload }) => {
  return (
    <TrialForm
      beforeSignIn={() => {
        // use native router for shadow routing
        NativeRouter.push(
          {
            pathname: '/article',
            query: { ...router.query, trialSignup: 1 }
          },
          router.asPath,
          { shallow: true }
        )
      }}
      onSuccess={() => {
        return false
      }}
      accessCampaignId={trialAccessCampaignId}
      payload={payload}
      darkMode={darkMode}
      minimal
    />
  )
})

const PayNoteCta = ({ payNote, payload, position, darkMode }) => {
  const cta =
    payNote && payNote.custom ? payNote.custom[position].cta : payNote.cta
  if (!cta) return null
  return (
    <div {...styles.cta}>
      {cta === 'trialForm' ? (
        <TryNoteCta darkMode={darkMode} payload={payload} />
      ) : (
        <BuyNoteCta payNote={payNote} position={position} />
      )}
    </div>
  )
}

export const PayNote = compose(
  withRouter,
  withInNativeApp,
  withMemberStatus
)(
  ({
    router: { query },
    inNativeIOSApp,
    isEligibleForTrial,
    seed,
    trial,
    documentId,
    repoId,
    series,
    position,
    customPayNotes
  }) => {
    const payNote = getPayNote({
      inNativeIOSApp,
      isEligibleForTrial,
      series,
      trial,
      seed,
      query,
      customPayNotes
    })
    const lead = (
      <Translation payNote={payNote} position={position} element='title' />
    )
    const body = <Translation payNote={payNote} position={position} />
    const payload = {
      documentId,
      repoId,
      variation: payNote.keyShort,
      position
    }
    const isBefore = position === 'before'
    const cta = (
      <PayNoteCta
        darkMode={isBefore}
        payNote={payNote}
        payload={payload}
        position={position}
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

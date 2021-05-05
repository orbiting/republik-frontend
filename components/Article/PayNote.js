import React, { useMemo } from 'react'
import {
  Interaction,
  Center,
  mediaQueries,
  Button,
  fontStyles,
  Label,
  ColorContextProvider,
  useColorContext,
  RawHtml
} from '@project-r/styleguide'
import TrialForm from '../Trial/Form'
import { css, merge } from 'glamor'
import { getElementFromSeed } from '../../lib/utils/helpers'
import { trackEvent, trackEventOnClick } from '../../lib/matomo'
import { Router } from '../../lib/routes'
import NativeRouter, { withRouter } from 'next/router'
import { compose } from 'react-apollo'
import { t } from '../../lib/withT'
import withInNativeApp from '../../lib/withInNativeApp'
import gql from 'graphql-tag'
import withMemberStatus from '../../lib/withMemberStatus'
import { TRIAL_CAMPAIGNS, TRIAL_CAMPAIGN } from '../../lib/constants'
import { parseJSONObject } from '../../lib/safeJSON'
import { shouldIgnoreClick } from '../../lib/utils/link'

const trialCampaigns = parseJSONObject(TRIAL_CAMPAIGNS)
const trialAccessCampaignId =
  (trialCampaigns.paynote && trialCampaigns.paynote.accessCampaignId) ||
  TRIAL_CAMPAIGN

const styles = {
  banner: css({
    padding: '5px 0'
  }),
  content: css({
    paddingBottom: 0,
    margin: '0.8rem 0 0.8rem 0',
    ':first-of-type': {
      marginTop: 0
    },
    ':last-child': {
      marginBottom: 0
    }
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
    maxWidth: '50%',
    marginTop: 15,
    ...fontStyles.sansSerifRegular16,
    lineHeight: 1.4,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular18,
      lineHeight: 1.4,
      marginLeft: 30,
      marginTop: 0
    }
  })
}

const memberShipQuery = gql`
  query payNoteStats {
    crowdfunding(name: "MARCH20") {
      goals {
        people
        memberships
        money
      }
    }
    revenueStats {
      surplus(min: "2019-11-30T23:00:00Z") {
        total
      }
    }
    membershipStats {
      count
      marchCount: countRange(
        min: "2020-02-29T23:00:00Z"
        max: "2020-03-31T23:00:00Z"
      )
    }
  }
`

export const TRY_TO_BUY_RATIO = 0.5

const TRY_VARIATIONS = [
  'tryNote/191106-v2',
  'tryNote/191106-v3',
  'tryNote/191106-v4'
]
// old ones
// ['payNote/191108-v1', 'payNote/191108-v2']
// tmp: march
const BUY_VARIATIONS = ['payNote/200313-v1']
const THANK_YOU_VARIATIONS = ['tryNote/thankYou']
const IOS_VARIATIONS = ['payNote/ios']

const DEFAULT_BUTTON_TARGET = '/angebote?package=ABO'

export const MAX_PAYNOTE_SEED = Math.max(
  TRY_VARIATIONS.length,
  BUY_VARIATIONS.length
)

const generatePositionedNote = (variation, target, cta, position) => {
  return {
    [position]: {
      content: t(`article/${variation}/${position}`, undefined, ''),
      contentReached: t(
        `article/${variation}/${position}/reached`,
        undefined,
        ''
      ),
      cta: cta,
      button: {
        label: t(`article/${variation}/${position}/buy/button`, undefined, ''),
        link: t(
          `article/${variation}/${position}/buy/button/link`,
          undefined,
          DEFAULT_BUTTON_TARGET
        )
      },
      secondary: t(
        `article/${variation}/${position}/secondary/label`,
        undefined,
        ''
      ) && {
        prefix: t(
          `article/${variation}/${position}/secondary/prefix`,
          undefined,
          ''
        ),
        label: t(
          `article/${variation}/${position}/secondary/label`,
          undefined,
          ''
        ),
        link: t(
          `article/${variation}/${position}/secondary/link`,
          undefined,
          ''
        )
      },
      note: t(`article/${variation}/${position}/note`, undefined, '')
    }
  }
}

const generateNote = (variation, target, cta) => {
  return {
    key: variation,
    target: target,
    ...generatePositionedNote(variation, target, cta, 'before'),
    ...generatePositionedNote(variation, target, cta, 'after')
  }
}

const generateNotes = (variations, target, cta) =>
  variations.map(v => generateNote(v, target, cta))

const predefinedNotes = generateNotes(
  TRY_VARIATIONS,
  {
    trialSignup: 'any',
    hasActiveMembership: false,
    isEligibleForTrial: true
  },
  'trialForm'
)
  .concat(
    generateNotes(
      BUY_VARIATIONS,
      {
        hasActiveMembership: false,
        inNativeIOSApp: false
      },
      'button'
    )
  )
  .concat(
    generateNotes(
      IOS_VARIATIONS,
      {
        hasActiveMembership: false,
        isEligibleForTrial: false,
        inNativeIOSApp: true
      },
      null
    )
  )
  .concat(
    generateNotes(
      THANK_YOU_VARIATIONS,
      {
        trialSignup: '1',
        campaignId: 'any',
        isEligibleForTrial: false
      },
      'trialForm'
    )
  )

const isEmpty = positionedNote =>
  (!positionedNote.cta ||
    (positionedNote.cta === 'button' && !positionedNote.button.label)) &&
  !positionedNote.content

const meetTarget = target => payNote => {
  const targetKeys = new Set(Object.keys(payNote.target))
  if (target.trialSignup) targetKeys.add('trialSignup')
  if (target.campaignId) targetKeys.add('campaignId')
  return Array.from(targetKeys).every(
    key =>
      payNote.target[key] === 'any' ||
      payNote.target[key] ===
        (typeof payNote.target[key] === 'boolean' ? !!target[key] : target[key])
  )
}

const goTo = route => Router.pushRoute(route).then(() => window.scrollTo(0, 0))

const generateKey = (note, index) => {
  return { ...note, key: `custom-${index}` }
}

const isPermissibleIOSCta = cta => !cta || cta === 'trialForm'

const disableForIOS = note => {
  return {
    ...note,
    target: {
      ...note.target,
      inNativeIOSApp:
        isPermissibleIOSCta(note.before.cta) &&
        isPermissibleIOSCta(note.after.cta)
          ? 'any'
          : false
    }
  }
}

const enableForTrialSignup = note => {
  return note.before.cta === 'trialForm' || note.after.cta === 'trialForm'
    ? { ...note, target: { ...note.target, trialSignup: 'any' } }
    : note
}

const hasCta = cta => note => note.before.cta === cta

const hasTryAndBuyCtas = notes =>
  notes.some(hasCta('button')) &&
  notes.some(hasCta('trialForm')) &&
  notes.every(n => n.before.cta === 'trialForm' || n.before.cta === 'button')

const getPayNote = (
  subject,
  seed,
  tryOrBuy,
  customOnly,
  customPayNotes = []
) => {
  const targetedCustomPaynotes = customPayNotes
    .map(generateKey)
    .map(disableForIOS)
    .map(enableForTrialSignup)
    .filter(meetTarget(subject))

  if (customOnly || targetedCustomPaynotes.length)
    return getElementFromSeed(targetedCustomPaynotes, seed, MAX_PAYNOTE_SEED)

  const targetedPredefinedNotes = predefinedNotes.filter(
    meetTarget({
      ...subject,
      // tmp: disallow generic trials pending new strategie
      isEligibleForTrial: false
    })
  )

  if (!targetedPredefinedNotes.length) return null

  if (hasTryAndBuyCtas(targetedPredefinedNotes)) {
    const desiredCta = tryOrBuy < TRY_TO_BUY_RATIO ? 'trialForm' : 'button'
    const abPredefinedNotes = targetedPredefinedNotes.filter(hasCta(desiredCta))
    return getElementFromSeed(abPredefinedNotes, seed, MAX_PAYNOTE_SEED)
  }

  return getElementFromSeed(targetedPredefinedNotes, seed, MAX_PAYNOTE_SEED)
}

const withCounts = (text, replacements) => {
  let message = text
  if (replacements) {
    Object.keys(replacements).forEach(replacementKey => {
      message = message.replace(
        `{${replacementKey}}`,
        replacements[replacementKey]
      )
    })
  }
  return message
}

const BuyButton = ({ payNote, payload }) => (
  <Button
    primary
    href={payNote.button.link}
    onClick={trackEventOnClick(
      ['PayNote', `pledge ${payload.position}`, payload.variation],
      () => goTo(payNote.button.link)
    )}
  >
    {payNote.button.label}
  </Button>
)

const SecondaryCta = ({ payNote, payload }) => {
  const [colorScheme] = useColorContext()
  const linkRule = useMemo(
    () =>
      css({
        '& a': {
          textDecoration: 'none',
          color: colorScheme.getCSSColor('primary'),
          '@media (hover)': {
            ':hover': {
              color: colorScheme.getCSSColor('textSoft')
            }
          }
        }
      }),
    [colorScheme]
  )
  return (
    <>
      {payNote.secondary && payNote.secondary.link ? (
        <div
          {...styles.aside}
          {...colorScheme.set('color', 'textSoft')}
          {...linkRule}
        >
          <span>{payNote.secondary.prefix} </span>
          <a
            key='secondary'
            href={payNote.secondary.link}
            onClick={trackEventOnClick(
              ['PayNote', `secondary ${payload.position}`, payload.variation],
              () => goTo(payNote.secondary.link)
            )}
          >
            {payNote.secondary.label}
          </a>
        </div>
      ) : null}
    </>
  )
}

const BuyNoteCta = ({ payNote, payload }) => (
  <div {...styles.actions}>
    <BuyButton payNote={payNote} payload={payload} />
    <SecondaryCta payNote={payNote} payload={payload} />
  </div>
)

const TryNoteCta = compose(withRouter)(({ router, payload }) => {
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
      minimal
    />
  )
})

const PayNoteCta = ({ payNote, payload }) => {
  return (
    <>
      {payNote.cta ? (
        <div {...styles.cta}>
          {payNote.cta === 'trialForm' ? (
            <TryNoteCta payload={payload} />
          ) : (
            <BuyNoteCta payNote={payNote} payload={payload} />
          )}
          {payNote.note && (
            <div
              style={{ marginTop: 10, marginBottom: 5 }}
              onClick={e => {
                if (e.target.nodeName === 'A') {
                  trackEvent([
                    'PayNote',
                    `note ${payload.position}`,
                    payload.variation
                  ])
                  const href =
                    e.target.getAttribute && e.target.getAttribute('href')
                  if (!shouldIgnoreClick(e) && href && href.startsWith('/')) {
                    e.preventDefault()
                    goTo(href)
                  }
                }
              }}
            >
              <RawHtml
                type={Label}
                dangerouslySetInnerHTML={{
                  __html: payNote.note
                }}
              />
            </div>
          )}
        </div>
      ) : null}
    </>
  )
}

const PayNoteP = ({ content }) => (
  <Interaction.P
    {...styles.content}
    dangerouslySetInnerHTML={{
      __html: content
    }}
  />
)

const PayNoteContent = ({ content }) =>
  content ? (
    <>
      {content.split('\n\n').map((c, i) => (
        <PayNoteP key={i} content={c} />
      ))}
    </>
  ) : null

const withDarkContextWhenBefore = WrappedComponent => props => {
  if (props.position === 'before') {
    return (
      <ColorContextProvider colorSchemeKey='dark'>
        <WrappedComponent {...props} />
      </ColorContextProvider>
    )
  }
  return <WrappedComponent {...props} />
}

export const PayNote = compose(
  withRouter,
  withInNativeApp,
  withMemberStatus,
  withDarkContextWhenBefore
)(
  ({
    router: { query },
    inNativeIOSApp,
    isEligibleForTrial,
    hasActiveMembership,
    statReplacements = {},
    seed,
    tryOrBuy,
    documentId,
    repoId,
    position,
    customPayNotes,
    customOnly
  }) => {
    const [colorScheme] = useColorContext()
    const subject = {
      inNativeIOSApp,
      isEligibleForTrial,
      hasActiveMembership,
      trialSignup: query.trialSignup
    }
    const payNote = getPayNote(
      subject,
      seed,
      tryOrBuy,
      customOnly,
      customPayNotes
    )

    if (!payNote) return null

    const positionedNote = payNote[position]

    if (isEmpty(positionedNote)) return null

    const payload = {
      documentId,
      repoId,
      variation: payNote.key,
      position
    }
    const isBefore = position === 'before'

    return (
      <div
        {...styles.banner}
        {...colorScheme.set('backgroundColor', isBefore ? 'hover' : 'alert')}
      >
        <Center>
          <PayNoteContent
            content={withCounts(
              (statReplacements.reached && positionedNote.contentReached) ||
                positionedNote.content,
              statReplacements
            )}
          />
          <PayNoteCta payNote={positionedNote} payload={payload} />
        </Center>
      </div>
    )
  }
)

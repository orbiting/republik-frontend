import React, { Fragment, useEffect, useState } from 'react'
import { css } from 'glamor'
import { compose, graphql } from 'react-apollo'
import Router, { withRouter } from 'next/router'
import { extent } from 'd3-array'
import gql from 'graphql-tag'
import { timeMonth } from 'd3-time'

import {
  Button,
  Editorial,
  Interaction,
  Loader,
  colors,
  LazyLoad,
  ColorContextProvider
} from '@project-r/styleguide'
import {
  ChartTitle,
  ChartLead,
  ChartLegend,
  Chart
} from '@project-r/styleguide/chart'

import md from 'markdown-in-js'

import Frame from '../components/Frame'
import { light as mdComponents } from '../lib/utils/mdComponents'
import { countFormat } from '../lib/utils/format'
import HrefLink from '../components/Link/Href'

import { PackageItem, PackageBuffer } from '../components/Pledge/Accordion'

import {
  mapActionData,
  userSurviveActionsFragment
} from '../components/Crowdfunding/withSurviveStatus'
import { RawStatus } from '../components/Crowdfunding/Status'
import withT from '../lib/withT'

import { ListWithQuery as TestimonialList } from '../components/Testimonial/List'

import { CROWDFUNDING, CDN_FRONTEND_BASE_URL } from '../lib/constants'
import withMe from '../lib/apollo/withMe'
import { Link } from '../lib/routes'
import { swissTime } from '../lib/utils/format'
import withInNativeApp from '../lib/withInNativeApp'

const statusQuery = gql`
  query CockpitStatus(
    $prev: YearMonthDate!
    $max: YearMonthDate!
    $accessToken: ID
  ) {
    membershipStats {
      evolution(min: "2018-01", max: $max) {
        updatedAt
        buckets {
          key
          active
          overdue
          ended
          pending
          pendingSubscriptionsOnly
          gaining
        }
      }
      lastSeen(min: $prev, max: $max) {
        buckets {
          key
          users
        }
      }
    }
    discussionsStats {
      evolution(min: "2018-01", max: $max) {
        buckets {
          key
          users
        }
      }
    }
    collectionsStats {
      progress: evolution(name: "progress", min: "2019-03", max: $max) {
        buckets {
          key
          users
        }
      }
      bookmarks: evolution(name: "bookmarks", min: "2019-01", max: $max) {
        buckets {
          key
          users
        }
      }
    }
    actionMe: me(accessToken: $accessToken) {
      id
      ...SurviveActionsOnUser
    }
  }
  ${userSurviveActionsFragment}
`

const numMembersNeeded = 25000

const formatDateTime = swissTime.format('%d.%m.%Y %H:%M')

const YEAR_MONTH_FORMAT = '%Y-%m'
const formatYearMonthKey = swissTime.format(YEAR_MONTH_FORMAT)
const parseYearMonthKey = swissTime.parse(YEAR_MONTH_FORMAT)

const formatYearMonth = swissTime.format('%B %Y')

const Accordion = withInNativeApp(
  withT(
    ({
      t,
      me,
      query,
      shouldBuyProlong,
      isReactivating,
      defaultBenefactor,
      inNativeIOSApp
    }) => {
      const [hover, setHover] = useState()

      return (
        <div style={{ marginTop: 10, marginBottom: 30 }}>
          <Interaction.P style={{ marginBottom: 10 }}>
            <strong>So können Sie uns jetzt unterstützen:</strong>
          </Interaction.P>
          {me && me.activeMembership && (
            <>
              <HrefLink href='/komplizin' passHref>
                <PackageItem
                  t={t}
                  dark
                  crowdfundingName={CROWDFUNDING}
                  name='PROMOTE'
                  title={'Republik bekannter machen'}
                  hover={hover}
                  setHover={setHover}
                />
              </HrefLink>
            </>
          )}
          {!inNativeIOSApp && (
            <>
              {shouldBuyProlong ? (
                <>
                  <Link
                    route='pledge'
                    params={{ package: 'PROLONG', token: query.token }}
                    passHref
                  >
                    <PackageItem
                      t={t}
                      dark
                      crowdfundingName={CROWDFUNDING}
                      name='PROLONG'
                      title={isReactivating ? 'Zurückkehren' : undefined}
                      hover={hover}
                      setHover={setHover}
                      price={24000}
                    />
                  </Link>
                  <Link
                    route='pledge'
                    params={{
                      package: 'PROLONG',
                      price: 48000,
                      token: query.token
                    }}
                    passHref
                  >
                    <PackageItem
                      t={t}
                      dark
                      crowdfundingName={CROWDFUNDING}
                      name='PROLONG-BIG'
                      hover={hover}
                      setHover={setHover}
                      title={
                        isReactivating
                          ? 'Grosszügig zurückkehren'
                          : 'Grosszügig verlängern'
                      }
                      price={48000}
                    />
                  </Link>
                  <Link
                    route='pledge'
                    params={{
                      package: 'PROLONG',
                      membershipType: 'BENEFACTOR_ABO',
                      token: query.token
                    }}
                    passHref
                  >
                    <PackageItem
                      t={t}
                      dark
                      crowdfundingName={CROWDFUNDING}
                      name='PROLONG-BEN'
                      hover={hover}
                      setHover={setHover}
                      title={
                        defaultBenefactor ? 'Gönner bleiben' : 'Gönner werden'
                      }
                      price={100000}
                    />
                  </Link>
                </>
              ) : (
                <>
                  {me && me.activeMembership ? (
                    <Link
                      route='pledge'
                      params={{ package: 'ABO_GIVE' }}
                      passHref
                    >
                      <PackageItem
                        t={t}
                        dark
                        crowdfundingName={CROWDFUNDING}
                        name='ABO_GIVE'
                        hover={hover}
                        setHover={setHover}
                        price={24000}
                      />
                    </Link>
                  ) : (
                    <>
                      <Link
                        route='pledge'
                        params={{ package: 'MONTHLY_ABO' }}
                        passHref
                      >
                        <PackageItem
                          t={t}
                          dark
                          crowdfundingName={CROWDFUNDING}
                          name='MONTHLY_ABO'
                          hover={hover}
                          setHover={setHover}
                          price={2200}
                        />
                      </Link>
                      <Link route='pledge' params={{ package: 'ABO' }} passHref>
                        <PackageItem
                          t={t}
                          dark
                          crowdfundingName={CROWDFUNDING}
                          name='ABO'
                          hover={hover}
                          setHover={setHover}
                          price={24000}
                        />
                      </Link>
                      <Link
                        route='pledge'
                        params={{ package: 'BENEFACTOR' }}
                        passHref
                      >
                        <PackageItem
                          t={t}
                          dark
                          crowdfundingName={CROWDFUNDING}
                          name='BENEFACTOR'
                          hover={hover}
                          setHover={setHover}
                          price={100000}
                        />
                      </Link>
                    </>
                  )}
                </>
              )}
              <Link route='pledge' params={{ package: 'DONATE' }} passHref>
                <PackageItem
                  t={t}
                  dark
                  crowdfundingName={CROWDFUNDING}
                  name='DONATE'
                  hover={hover}
                  setHover={setHover}
                />
              </Link>
              <PackageBuffer />
              {false && !me && !shouldBuyProlong && !inNativeIOSApp && (
                <Interaction.P style={{ marginTop: 10 }}>
                  Falls Sie bereits Mitglied sind: Melden Sie sich an, um Ihr
                  Abo zu verlängern.
                </Interaction.P>
              )}
            </>
          )}
        </div>
      )
    }
  )
)

// https://ultradashboard.republik.ch/question/506
const bucketsBefore = [
  { key: '2017-04', presale: 9703 },
  { key: '2017-05', presale: 3866 }
].reduce((summed, d) => {
  const prev = summed[summed.length - 1]
  summed.push({ ...d, preactive: d.presale + (prev ? prev.preactive : 0) })
  return summed
}, [])

const Page = ({
  data,
  t,
  me,
  inNativeIOSApp,
  actionsLoading,
  questionnaire,
  shouldBuyProlong,
  isReactivating,
  defaultBenefactor,
  router: { query }
}) => {
  const meta = {
    pageTitle: '🚀 Republik Cockpit',
    title: 'Das Cockpit zum Stand unseres Unternehmens',
    description:
      'Alles, was Sie zur finanziellen Lage der Republik wissen müssen.',
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/cockpit.jpg`
  }

  useEffect(() => {
    if (query.token) {
      Router.replace(
        `/cockpit?token=${encodeURIComponent(query.token)}`,
        '/cockpit',
        {
          shallow: true
        }
      )
    }
  }, [query.token])

  return (
    <ColorContextProvider colorSchemeKey='dark'>
      <Frame meta={meta}>
        <Loader
          loading={data.loading || actionsLoading}
          error={data.error}
          style={{ minHeight: `calc(90vh)` }}
          render={() => {
            const {
              evolution: { buckets, updatedAt }
            } = data.membershipStats

            const labels = [
              { key: 'preactive', color: '#256900', label: 'Crowdfunder' },
              { key: 'active', color: '#3CAD00', label: 'aktive' },
              { key: 'loss', color: '#9970ab', label: 'Abgänge' },
              { key: 'missing', color: '#444', label: 'fehlende' },
              { key: 'pending', color: '#444', label: 'offene' },
              { key: 'base', color: '#3CAD00', label: 'bestehende' }
              // { key: 'gaining', color: '#2A7A00', label: 'neue' }
            ]
            const labelMap = labels.reduce((map, d) => {
              map[d.key] = d.label
              return map
            }, {})
            const colorMap = labels.reduce((map, d) => {
              map[d.label] = d.color
              return map
            }, {})

            const currentKey = formatYearMonthKey(new Date())
            const lastBucket = buckets[buckets.length - 1]
            const currentBucket =
              buckets.find(bucket => bucket.key === currentKey) || lastBucket

            const minMaxValues = []
            const values = bucketsBefore
              .map(bucket => ({
                month: bucket.key,
                label: labelMap.preactive,
                value: bucket.preactive
              }))
              .concat(
                buckets
                  .slice(0, -3)
                  .reduce(
                    (
                      acc,
                      {
                        key,
                        active,
                        overdue,
                        ended,
                        pending,
                        pendingSubscriptionsOnly
                      }
                    ) => {
                      minMaxValues.push(active + overdue)
                      minMaxValues.push(-ended)

                      acc.push({
                        month: key,
                        label: labelMap.active,
                        value: active + overdue
                      })
                      acc.push({
                        month: key,
                        label: labelMap.loss,
                        value: -ended
                      })
                      return acc
                    },
                    []
                  )
              )

            const pendingBuckets = buckets.slice(-7)
            const pendingValues = pendingBuckets.reduce(
              (agg, month) => {
                // agg.gaining += month.gaining
                const pendingYearly =
                  month.pending - month.pendingSubscriptionsOnly
                agg.values = agg.values.concat([
                  {
                    month: month.key,
                    label: labelMap.base,
                    value: month.active - pendingYearly // - month.gaining
                  },
                  // {
                  //   month: month.key,
                  //   label: labelMap.gaining,
                  //   value: month.gaining
                  // },
                  {
                    month: month.key,
                    label: labelMap.pending,
                    value: pendingYearly + month.overdue
                  },
                  {
                    month: month.key,
                    label: labelMap.loss,
                    value: -month.ended
                  }
                ])
                return agg
              },
              { gaining: 0, values: [] }
            ).values

            const activeCount = currentBucket.active + currentBucket.overdue
            const missingCount = numMembersNeeded - activeCount
            if (missingCount > 0) {
              values.push({
                month: currentBucket.key,
                label: labelMap.missing,
                value: missingCount
              })
            }
            minMaxValues.push(numMembersNeeded)
            const [minValue, maxValue] = extent(minMaxValues).map((d, i) =>
              Math[i ? 'ceil' : 'floor'](Math.round(d / 1000) * 1000)
            )

            const lastSeenBucket = data.membershipStats.lastSeen.buckets.slice(
              -1
            )[0]
            const lastSeen = lastSeenBucket.users

            const engagedUsers = [].concat(
              data.discussionsStats.evolution.buckets
                .slice(0, -1)
                .map(bucket => ({
                  type: 'Dialog',
                  date: bucket.key,
                  value: String(bucket.users)
                })),
              data.collectionsStats.progress.buckets
                .slice(0, -1)
                .map(bucket => ({
                  type: 'Lesepositionen',
                  date: bucket.key,
                  value: String(bucket.users)
                })),
              data.collectionsStats.bookmarks.buckets
                .slice(0, -1)
                .map(bucket => ({
                  type: 'Lesezeichen',
                  date: bucket.key,
                  value: String(bucket.users)
                }))
            )

            return (
              <>
                <div style={{ marginBottom: 60 }}>
                  <RawStatus
                    t={t}
                    color='#fff'
                    barColor='#333'
                    memberships
                    hasEnd={false}
                    crowdfundingName='PERMANENT'
                    crowdfunding={
                      currentBucket && {
                        name: 'PERMANENT',
                        goals: [
                          {
                            memberships: numMembersNeeded
                          }
                        ],
                        status: {
                          memberships: activeCount,
                          lastSeen
                        }
                      }
                    }
                  />
                </div>
                <Interaction.Headline style={{ marginBottom: 20 }}>
                  Das Cockpit zum Stand unseres Unternehmens
                </Interaction.Headline>
                {md(mdComponents)`

Die Aufgabe der Republik ist, brauchbaren Journalismus zu machen. Einen, der die Köpfe klarer, das Handeln mutiger, die Entscheidungen klüger macht. Und der das Gemeinsame stärkt: die Freiheit, den Rechtsstaat, die Demokratie.

Die Grundlage dafür ist ein Geschäftsmodell für werbefreien, unabhängigen, leserfinanzierten Journalismus. Damit die Republik einen entscheidenden Unterschied im Mediensystem machen kann, muss sie selbsttragend sein.

`}

                <div style={{ marginTop: 20 }}>
                  <ChartTitle>
                    Aktuell {countFormat(activeCount)} Mitglieder
                    und&nbsp;Abonnentinnen
                  </ChartTitle>
                  <ChartLead>
                    Entwicklung vom Crowdfunding im April 2017 bis heute.{' '}
                    {missingCount > 0 &&
                      `Es fehlen ${countFormat(missingCount)} Mitglieder.`}
                  </ChartLead>
                  <Chart
                    config={{
                      type: 'TimeBar',
                      color: 'label',
                      colorMap,
                      numberFormat: 's',
                      x: 'month',
                      timeParse: '%Y-%m',
                      timeFormat: '%b %y',
                      xInterval: 'month',
                      xTicks: ['2018-01', '2019-01', '2020-01', currentKey],
                      height: 300,
                      domain: [minValue, maxValue + 2000],
                      yTicks: [-5000, 0, 5000, 10000, 15000, 20000, 25000],
                      xAnnotations: [
                        {
                          x1: currentBucket.key,
                          x2: currentBucket.key,
                          value: activeCount,
                          label: 'Stand jetzt'
                        }
                      ],
                      xBandPadding: 0
                    }}
                    values={values.map(d => ({ ...d, value: String(d.value) }))}
                  />
                </div>

                <div style={{ marginTop: 20 }}>
                  <ChartTitle>
                    {countFormat(
                      lastBucket.pending - lastBucket.pendingSubscriptionsOnly
                    )}{' '}
                    anstehende Verläng&shy;erungen in den nächsten
                    3&nbsp;Monaten
                  </ChartTitle>
                  <ChartLead>
                    Anzahl Mitgliedschaften und Abos per Monatsende.
                  </ChartLead>
                  <Chart
                    config={{
                      type: 'TimeBar',
                      color: 'label',
                      colorMap,
                      numberFormat: 's',
                      x: 'month',
                      timeParse: '%Y-%m',
                      timeFormat: '%b %y',
                      xInterval: 'month',
                      height: 300,
                      domain: [minValue, maxValue + 2000],
                      yTicks: [-5000, 0, 5000, 10000, 15000, 20000],
                      yAnnotations: [
                        {
                          value: numMembersNeeded,
                          label: 'selbsttragend ab',
                          dy: '1.1em'
                        }
                      ],
                      xAnnotations: [
                        {
                          x1: currentBucket.key,
                          x2: currentBucket.key,
                          value: activeCount,
                          label: 'Stand jetzt'
                        }
                      ]
                    }}
                    values={pendingValues.map(d => ({
                      ...d,
                      value: String(d.value)
                    }))}
                  />
                  <ChartLegend>
                    Als offen gelten Jahres­mitgliedschaften ohne
                    Verlängerungszahlung. Datenstand:{' '}
                    {formatDateTime(new Date(updatedAt))}
                  </ChartLegend>
                </div>

                {md(mdComponents)`

Mit konstant ${countFormat(
                  numMembersNeeded
                )} Abonnentinnen und Mitgliedern haben wir genügend Einnahmen, um den gesamten Betrieb zu finanzieren. Und wir haben die Mittel, um Neues auszuprobieren und Experimente zu machen.

Das aktuelle Ausgabenbudget haben wir im November 2020 [veröffentlicht und nach den verschiedenen Bereichen aufgeschlüsselt und erklärt](/vote/nov20#unser-gesamtbudget-erklaert-und-aufgeschluesselt).

## ${countFormat(lastSeen)} Mitglieder sind monatlich&nbsp;aktiv

Der beste Journalismus nützt nichts, wenn ihn niemand sieht. Für ein gesundes Unternehmen braucht es eine aktive und interessierte Verlegerschaft.

`}

                <div style={{ marginTop: 20 }}>
                  <ChartTitle>
                    Wie beliebt sind Dialog, Lesezeichen und Leseposition?
                  </ChartTitle>
                  <ChartLead>
                    Anzahl Mitglieder, welche pro Monat eine Funktion benutzen.
                  </ChartLead>
                  <Chart
                    config={{
                      type: 'Line',
                      sort: 'none',
                      color: 'type',
                      colorSort: 'none',
                      numberFormat: 's',
                      x: 'date',
                      timeParse: '%Y-%m',
                      timeFormat: '%b %y',
                      xTicks: [
                        '2018-01',
                        '2019-01',
                        '2020-01'
                        // lastSeenBucket.key
                      ],
                      yNice: 0,
                      yTicks: [0, 3000, 6000, 9000, 12000],
                      colorMap: {
                        Lesepositionen: '#9467bd',
                        Lesezeichen: '#e377c2',
                        Dialog: '#bcbd22'
                      }
                    }}
                    values={engagedUsers}
                  />
                  <ChartLegend>
                    Beim Dialog werden Schreibende und Reagierende (Up- und
                    Downvotes) gezählt. Lesezeichen wurden Mitte Januar 2019
                    eingeführt, die Leseposition Ende März&nbsp;2019.
                  </ChartLegend>
                </div>

                {md(mdComponents)`

## Was bisher geschah

*   April 2017: [Initiales Crowdfunding](/crowdfunding) 
*   Januar 2018: [Launch Magazin](https://project-r.construction/newsletter/2018-01-14-gestartet)
*   Oktober 2018: [1. Geschäftsbericht](https://cdn.repub.ch/s3/republik-assets/assets/geschaeftsbericht/2017-2018.pdf)
*   Januar 2019: [Liquiditätsplanung für 2019](/2019/01/07/unser-plan-ihr-plan)
*   November 2019: [2. Geschäftsbericht](https://cdn.repub.ch/s3/republik-assets/assets/geschaeftsbericht/2018-2019.pdf) 
*   Dezember 2019: [das alte Cockpit](/cockpit19)
*   März 2020: [Märzkampagne](/maerzkampagne)
*   Juni 2020: [25’000 Mitglieder](https://project-r.construction/newsletter/2020-06-19-wir-sind-stolz-auf-sie)
*   November 2020: [3. Geschäftsbericht](https://cdn.repub.ch/s3/republik-assets/assets/geschaeftsbericht/2019-2020.pdf)

Seit dem Start schreiben wir regelmässig über die wichtigsten Entwicklungen in unserem Unternehmen. Sie können alles nachlesen, im [Archiv der Project-R-Newsletter](https://project-r.construction/news) und in der [Rubrik «An die Verlagsetage](/format/an-die-verlagsetage "An die Verlagsetage")».

`}
                <br />
                <Accordion
                  me={me}
                  query={query}
                  shouldBuyProlong={shouldBuyProlong}
                  isReactivating={isReactivating}
                  defaultBenefactor={defaultBenefactor}
                  questionnaire={questionnaire}
                />

                {inNativeIOSApp && (
                  <Interaction.P style={{ color: '#ef4533', marginBottom: 10 }}>
                    {t('cockpit/ios')}
                  </Interaction.P>
                )}

                {md(mdComponents)`



## ${countFormat(activeCount)} sind dabei.`}

                <LazyLoad>
                  <TestimonialList
                    ssr={false}
                    singleRow
                    minColumns={3}
                    share={false}
                  />
                </LazyLoad>
                <br />

                {md(mdComponents)`
[Alle anschauen](/community)${
                  me && me.activeMembership ? (
                    <Fragment>
                      {'\u00a0– '}
                      <Editorial.A
                        style={{ color: colors.negative.text }}
                        href='/einrichten'
                      >
                        Ihr Profil einrichten
                      </Editorial.A>
                    </Fragment>
                  ) : (
                    ''
                  )
                }
      `}

                <br />
                <br />
              </>
            )
          }}
        />
      </Frame>
    </ColorContextProvider>
  )
}

const EnhancedPage = compose(
  withT,
  withMe,
  withRouter,
  withInNativeApp,
  graphql(statusQuery, {
    props: ({ data, ownProps }) => {
      return {
        data,
        ...mapActionData({ data, ownProps })
      }
    },
    options: ({ router: { query } }) => ({
      variables: {
        prev: formatYearMonthKey(timeMonth.offset(new Date(), -1)),
        max: formatYearMonthKey(timeMonth.offset(new Date(), 3)),
        accessToken: query.token
      }
    })
  })
)(Page)

export default EnhancedPage

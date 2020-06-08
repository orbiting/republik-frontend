import React, { Fragment, useEffect, useState } from 'react'
import { css } from 'glamor'
import { compose, graphql } from 'react-apollo'
import Router, { withRouter } from 'next/router'
import { extent } from 'd3-array'
import gql from 'graphql-tag'

import {
  Button,
  Editorial,
  Interaction,
  Loader,
  colors,
  LazyLoad
} from '@project-r/styleguide'
import { ChartTitle, ChartLead, Chart } from '@project-r/styleguide/chart'

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
  query CockpitStatus($max: YearMonthDate!, $accessToken: ID) {
    membershipStats {
      evolution(min: "2018-01", max: $max) {
        updatedAt
        buckets {
          key
          active
          overdue
          ended
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
const formatYearMonth = swissTime.format(YEAR_MONTH_FORMAT)

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
          <Interaction.P style={{ color: '#fff', marginBottom: 10 }}>
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
                <Interaction.P style={{ color: '#fff', marginTop: 10 }}>
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
    <Frame meta={meta} dark>
      <Loader
        loading={data.loading || actionsLoading}
        error={data.error}
        style={{ minHeight: `calc(90vh)` }}
        render={() => {
          const {
            evolution: { buckets, updatedAt }
          } = data.membershipStats
          const lastMonth = buckets[buckets.length - 1]

          const labels = [
            { key: 'preactive', color: '#256900', label: 'Crowdfunder' },
            { key: 'active', color: '#3CAD00', label: 'aktive' },
            { key: 'loss', color: '#9970ab', label: 'Abgänge' },
            { key: 'missing', color: '#333', label: 'fehlende' }
          ]
          const labelMap = labels.reduce((map, d) => {
            map[d.key] = d.label
            return map
          }, {})
          const colorMap = labels.reduce((map, d) => {
            map[d.label] = d.color
            return map
          }, {})

          const minMaxValues = []
          const lastBucket = buckets[buckets.length - 1]
          const values = bucketsBefore
            .map(bucket => ({
              month: bucket.key,
              label: labelMap.preactive,
              value: bucket.preactive
            }))
            .concat(
              buckets.reduce((acc, { key, active, overdue, ended }) => {
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
              }, [])
            )
          const activeCount = lastBucket.active + lastBucket.overdue
          const missingCount = numMembersNeeded - activeCount
          if (missingCount > 0) {
            values.push({
              month: lastBucket.key,
              label: labelMap.missing,
              value: missingCount
            })
          }
          minMaxValues.push(numMembersNeeded)
          const [minValue, maxValue] = extent(minMaxValues).map((d, i) =>
            Math[i ? 'ceil' : 'floor'](Math.round(d / 1000) * 1000)
          )

          return (
            <>
              <div style={{ marginBottom: 60 }}>
                {md(mdComponents)`
Herzlichen Dank! Wir haben unsere überlebenswichtigen Ziele erreicht. Die Republik hat definitiv eine Zukunft. Danke an alle, die dazu beitragen. 
                `}
                <RawStatus
                  t={t}
                  color='#fff'
                  barColor='#333'
                  people
                  hasEnd={false}
                  crowdfundingName='PERMANENT'
                  crowdfunding={
                    lastMonth && {
                      name: 'PERMANENT',
                      goals: [
                        {
                          people: numMembersNeeded
                        }
                      ],
                      status: {
                        people: activeCount
                      }
                    }
                  }
                />
              </div>
              <Interaction.Headline style={{ color: '#fff', marginBottom: 20 }}>
                Das Cockpit zum Stand unseres Unternehmens
              </Interaction.Headline>
              {md(mdComponents)`

Die Aufgabe der Republik ist, brauchbaren Journalismus zu machen. Einen, der die Köpfe klarer, das Handeln mutiger, die Entscheidungen klüger macht. Und der das Gemeinsame stärkt: die Freiheit, den Rechtsstaat, die Demokratie.

Die Grundlage dafür ist ein Geschäftsmodell für werbefreien, unabhängigen, leserfinanzierten Journalismus. Damit die Republik einen entscheidenden Unterschied im Mediensystem machen kann, muss sie selbsttragend werden. Also die gesamten Kosten aus den Einnahmen decken, ohne die Hilfe von Investitionen.

Dafür braucht sie konstant etwa ${countFormat(
                numMembersNeeded
              )} Abonnentinnen und Mitglieder.


`}

              <div
                {...css({
                  marginTop: 20,
                  '& text': {
                    fill: '#fff !important'
                  },
                  '& line': {
                    stroke: 'rgba(255, 255, 255, 0.4) !important'
                  },
                  '& div': {
                    color: '#fff !important'
                  }
                })}
              >
                <ChartTitle style={{ color: '#fff' }}>
                  {countFormat(activeCount)} aktive Mitglieder und Abonnentinnen
                </ChartTitle>
                <ChartLead style={{ color: '#fff' }}>
                  Vom Crowdfunding im April 2017 bis heute.{' '}
                  {missingCount > 0 &&
                    `Aktuell fehlen noch ${countFormat(
                      missingCount
                    )} Mitglieder.`}
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
                    xTicks: ['2017-04', '2018-01', '2019-01', '2020-01'],
                    domain: [minValue, maxValue],
                    yTicks: [0, 10000, 20000],
                    yAnnotations: [
                      {
                        value: numMembersNeeded,
                        label: 'selbsttragend bei'
                      }
                    ],
                    xBandPadding: 0
                  }}
                  values={values.map(d => ({ ...d, value: String(d.value) }))}
                />
                <Editorial.Note style={{ marginTop: 10, color: '#fff' }}>
                  Datenstand: {formatDateTime(new Date(updatedAt))}
                </Editorial.Note>
              </div>

              {md(mdComponents)`

## Warum ${countFormat(numMembersNeeded)}?

Mit ${countFormat(
                numMembersNeeded
              )} Abonnenten und Mitgliedern haben wir genug Einnahmen, um den gesamten Betrieb zu finanzieren. Und wir haben die Mittel, um Neues auszuprobieren und Experimente zu machen. Wir wären dann unabhängig von Investoren und Stiftungen und zu 100 Prozent leserfinanziert.

Das aktuelle Ausgaben-Budget haben wir im Juli 2019 [veröffentlicht und nach den verschiedenen Bereichen aufgeschlüsselt und erklärt](/vote/juli19).

## Und bis dann?

Bis die Republik selbsttragend funktionieren kann, ist sie auf Investments angewiesen. Auf [unserer Aktionariats-Seite](/aktionariat) finden Sie alle Investoren. Zudem werden wir von verschiedenen Stiftungen gefördert und die Genossenschaft von Spenderinnen unterstützt.

Im letzten Geschäftsjahr (2018/2019) war die Republik zu 70 Prozent selbsttragend. Nun geht es darum, bekannter und nützlicher zu werden und mehr Menschen mit unserem Journalismus zu begeistern. Wir haben einen ganzen Schrank voller Ideen.

Und falls es ein bisschen Zeit braucht, bis die Ideen sich in zusätzliche Mitgliedschaften und Abos verwandeln, geht uns das Geld nicht übermorgen aus.

Dazu folgende Zusammenfassung unserer konservativen Liquiditätsplanung:

Solide Verkäufe (weniger als 2019 und 2018) + gute, aber nicht bemerkenswerte Erneuerungen (besser als im ersten Jahr, schlechter als die letzten Monate) + etwas tieferes Budget = sicher Geld bis Winter 2021/2022.

## Was bisher geschah

*   April 2017: [Initiales Crowdfunding](/crowdfunding) 
*   Januar 2018: [Launch Magazin](https://project-r.construction/newsletter/2018-01-14-gestartet)
*   Oktober 2018: [1. Geschäftsbericht](https://cdn.republik.space/s3/republik-assets/assets/geschaeftsbericht2017_2018_fuer_gv_und_urabstimmung.pdf)
*   Januar 2019: [Liquiditätsplanung für 2019](/2019/01/07/unser-plan-ihr-plan)
*   November 2019: [2. Geschäftsbericht](https://cdn.republik.space/s3/republik-assets/assets/can/Republik_Geschaeftsbericht_2018-2019.pdf) 
*   Dezember 2019: [das alte Cockpit](/cockpit19)
*   März 2020: [Märzkampagne](/maerzkampagne)

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
              {md(mdComponents)`

Sie wollen investieren? Schreiben Sie uns eine Mail an [ir@republik.ch](mailto:ir@republik.ch)

`}

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
        max: formatYearMonth(new Date()),
        accessToken: query.token
      }
    })
  })
)(Page)

export default EnhancedPage

import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import { withRouter } from 'next/router'

import { questionnaireCrowdSlug } from '../../lib/routes'
import withMe from '../../lib/apollo/withMe'
import withInNativeApp from '../../lib/withInNativeApp'

import { STATUS_POLL_INTERVAL_MS } from '../../lib/constants'

const END_DATE = '2020-03-31T10:00:00.000Z'

const CROWDFUNDING_NAME = 'SURVIVE'

const statusQuery = gql`
  query StatusPage {
    revenueStats {
      surplus(min: "2019-11-30T23:00:00Z") {
        total
        updatedAt
      }
    }
    membershipStats {
      count
      evolution(min: "2019-12", max: "2020-03") {
        buckets {
          key

          gaining

          ending
          expired
          cancelled

          activeEndOfMonth

          pending
          pendingSubscriptionsOnly
        }
        updatedAt
      }
    }
    questionnaire(slug: "${questionnaireCrowdSlug}") {
      id
      turnout {
        submitted
      }
    }
  }
`

const actionsQuery = gql`
  query StatusPageActions($accessToken: ID) {
    me(accessToken: $accessToken) {
      id
      customPackages {
        options {
          membership {
            id
            user {
              id
            }
            graceEndDate
          }
          defaultAmount
          reward {
            ... on MembershipType {
              name
            }
          }
        }
      }
    }
    questionnaire(slug: "${questionnaireCrowdSlug}") {
      id
      userIsEligible
      userHasSubmitted
      endDate
    }
  }
`

const withSurviveStatus = compose(
  withMe,
  withRouter,
  withInNativeApp,
  graphql(statusQuery, {
    options: {
      pollInterval: +STATUS_POLL_INTERVAL_MS
    },
    props: ({ data }) => {
      const { evolution, count } = data.membershipStats || {}
      const lastMonth = evolution.buckets[evolution.buckets.length - 1]

      return {
        surviveData: data,
        crowdfunding: lastMonth &&
          data.revenueStats && {
            name: CROWDFUNDING_NAME,
            endDate: END_DATE,
            goals: [
              {
                memberships: 3000,
                people: 19000,
                money: 220000000
              }
            ],
            status: {
              memberships: 123, // ToDo: wire up
              current: count,
              people:
                lastMonth.activeEndOfMonth + lastMonth.pendingSubscriptionsOnly,
              money: data.revenueStats.surplus.total,
              support: data.questionnaire
                ? data.questionnaire.turnout.submitted
                : undefined
            }
          }
      }
    }
  }),
  graphql(actionsQuery, {
    props: ({ data: { loading, me: meWithToken, questionnaire }, me }) => {
      const isOptionWithOwn = o =>
        o.membership &&
        o.membership.user &&
        o.membership.user.id === meWithToken.id
      const customPackageWithOwn =
        meWithToken &&
        meWithToken.customPackages &&
        meWithToken.customPackages.find(p => p.options.some(isOptionWithOwn))
      const ownMembership =
        customPackageWithOwn &&
        customPackageWithOwn.options.find(isOptionWithOwn).membership

      const canProlongOwn = !!customPackageWithOwn
      const shouldBuyProlong =
        canProlongOwn &&
        (!me ||
          (me.activeMembership &&
            new Date(me.activeMembership.endDate) <= new Date(END_DATE)))

      const qHasEnded =
        questionnaire && new Date() > new Date(questionnaire.endDate)

      return {
        actionsLoading: loading,
        questionnaire: {
          ...questionnaire,
          hasEnded: qHasEnded,
          shouldAnswer:
            questionnaire &&
            questionnaire.userIsEligible &&
            !questionnaire.userHasSubmitted &&
            !qHasEnded
        },
        shouldBuyProlong,
        isReactivating:
          ownMembership && new Date(ownMembership.graceEndDate) < new Date(),
        defaultBenefactor:
          !!customPackageWithOwn &&
          meWithToken.customPackages.some(p =>
            p.options.some(
              o =>
                isOptionWithOwn(o) &&
                o.defaultAmount === 1 &&
                o.reward.name === 'BENEFACTOR_ABO'
            )
          )
      }
    },
    options: ({ router: { query } }) => ({
      variables: {
        accessToken: query.token
      }
    })
  })
)

export default withSurviveStatus

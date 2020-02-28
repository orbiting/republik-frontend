import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import { withRouter } from 'next/router'
import { timeDay } from 'd3-time'

import { questionnaireCrowdSlug } from '../../lib/routes'
import withMe from '../../lib/apollo/withMe'
import withInNativeApp from '../../lib/withInNativeApp'

import { STATUS_POLL_INTERVAL_MS } from '../../lib/constants'

const END_DATE = '2020-03-31T10:00:00.000Z'

const CROWDFUNDING_NAME = 'SURVIVE'

// ToDo: change countRange min to 2020-02-29T23:00:00Z
const statusQuery = gql`
  query StatusPage {
    crowdfunding(name: "MARCH20") {
      goals {
        people
        memberships
        money
        description
      }
    }
    revenueStats {
      surplus(min: "2019-11-30T23:00:00Z") {
        total
        updatedAt
      }
    }
    membershipStats {
      count
      marchCount: countRange(min: "2020-02-27T23:00:00Z" max: "2020-03-31T23:00:00Z")
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
      const { evolution, count, marchCount } = data.membershipStats || {}
      const lastMonth =
        evolution && evolution.buckets[evolution.buckets.length - 1]

      return {
        surviveData: data,
        crowdfunding: data.crowdfunding &&
          lastMonth &&
          data.revenueStats && {
            name: CROWDFUNDING_NAME,
            endDate: END_DATE,
            goals: data.crowdfunding.goals,
            status: {
              memberships: marchCount,
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
    props: ({
      data: { loading, me: meWithToken, questionnaire },
      ownProps: { me }
    }) => {
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
      const activeMembership = me && me.activeMembership
      const numberOfDaysLeft =
        canProlongOwn &&
        activeMembership &&
        timeDay.count(new Date(), new Date(me.activeMembership.endDate))
      const shouldBuyProlong = canProlongOwn && (!me || numberOfDaysLeft < 31)
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
        activeMembership,
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

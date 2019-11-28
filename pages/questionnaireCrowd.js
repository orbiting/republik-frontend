import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'

import { CDN_FRONTEND_BASE_URL } from '../lib/constants'
import withT, { t } from '../lib/withT'

import { enforceMembership } from '../components/Auth/withMembership'
import { withQuestionnaire } from '../components/Questionnaire/enhancers'
import { description } from './questionnaire'
import { withRouter } from 'next/router'
import QuestionnaireActions from '../components/Questionnaire/QuestionnaireActions'
import Frame from '../components/Frame'
import Questionnaire from '../components/Questionnaire/Questionnaire'
import { query, withMyDetails } from '../components/Account/enhancers'
import { errorToString } from '../lib/utils/errors'
import AddressForm, { COUNTRIES } from '../components/Account/AddressForm'
import FieldSet from '../components/FieldSet'
import { A, colors, Interaction, Label, Loader } from '@project-r/styleguide'
import { intersperse } from '../lib/utils/helpers'
import gql from 'graphql-tag'

const mutation = gql`
  mutation updateMe(
    $questionnaireId: ID!
    $phoneNumber: String
    $address: AddressInput
  ) {
    updateMe(phoneNumber: $phoneNumber, address: $address) {
      id
    }
    submitQuestionnaire(id: $questionnaireId) {
      id
      userSubmitDate
      userHasSubmitted
    }
  }
`

const withMutation = graphql(mutation, {
  props: ({ mutate }) => ({
    submitForm: variables =>
      mutate({
        variables,
        refetchQueries: [
          {
            query
          }
        ]
      })
  })
})

const meta = {
  title: 'This was harder than it looked',
  description: t('questionnaire/description'),
  facebookTitle: t('pages/meta/questionnaire/socialTitle'),
  facebookDescription: t('pages/meta/questionnaire/socialDescription'),
  twitterTitle: t('pages/meta/questionnaire/socialTitle'),
  twitterDescription: t('pages/meta/questionnaire/socialDescription'),
  facebookImage: `${CDN_FRONTEND_BASE_URL}/static/social-media/umfrage/2018/facebookImage.png`,
  twitterImage: `${CDN_FRONTEND_BASE_URL}/static/social-media/umfrage/2018/twitterImage.png`
}

const { H2, P } = Interaction

const DEFAULT_COUNTRY = COUNTRIES[0]

const fields = t => [
  {
    label: t('Account/Update/phone/label'),
    name: 'phoneNumber'
  }
]

const getValues = me => {
  let addressState = {}
  if (me.address) {
    addressState = {
      name: me.address.name || me.name,
      line1: me.address.line1,
      line2: me.address.line2,
      postalCode: me.address.postalCode,
      city: me.address.city,
      country: me.address.country
    }
  } else if (me) {
    addressState.name = [me.firstName, me.lastName].filter(Boolean).join(' ')
  }

  return {
    phoneNumber: me.phoneNumber || '',
    ...addressState
  }
}

const isEmptyAddress = (values, me) => {
  const addressString = [
    values.name,
    values.line1,
    values.line2,
    values.postalCode,
    values.city,
    values.country
  ]
    .join('')
    .trim()
  const emptyAddressString = [me.name, DEFAULT_COUNTRY].join('').trim()

  return addressString === emptyAddressString
}

const getMutation = (values, me) => {
  return {
    phoneNumber: values.phoneNumber,
    address: isEmptyAddress(values, me)
      ? undefined
      : {
          name: values.name,
          line1: values.line1,
          line2: values.line2,
          postalCode: values.postalCode,
          city: values.city,
          country: values.country
        }
  }
}

const ThankYou = () => {
  return <div>Vielen Dank for helping</div>
}

class QuestionnaireCrowdPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isEditing: false,
      showErrors: false,
      values: {
        country: DEFAULT_COUNTRY
      },
      errors: {},
      dirty: {}
    }
  }

  startEditing() {
    const { me } = this.props.detailsData
    this.setState(state => ({
      isEditing: true,
      values: {
        ...state.values,
        ...getValues(me)
      }
    }))
  }

  submit(errorMessages) {
    const {
      t,
      detailsData: { me },
      submitForm,
      questionnaireData: {
        questionnaire: { id }
      }
    } = this.props

    const { values } = this.state

    if (errorMessages.length) {
      this.setState(state =>
        Object.keys(state.errors).reduce(
          (nextState, key) => {
            nextState.dirty[key] = true
            return nextState
          },
          {
            showErrors: true,
            dirty: {}
          }
        )
      )
      return
    }

    this.setState({ updating: true })
    submitForm({ ...getMutation(values, me), questionnaireId: id })
      .then(() =>
        this.setState(() => ({
          updating: false,
          serverError: null
        }))
      )
      .catch(error => {
        this.setState(() => ({
          updating: false,
          submitting: false,
          serverError: errorToString(error)
        }))
      })
  }

  render() {
    const { t, detailsData, questionnaireData, router } = this.props
    const { loading } = detailsData
    const me = loading ? undefined : detailsData.me
    const {
      serverError,
      updating,
      submitting,
      values,
      dirty,
      isEditing,
      errors
    } = this.state
    const submitted =
      questionnaireData && questionnaireData.questionnaire.userHasSubmitted
    const slug = router.query.slug
    const errorMessages =
      errors &&
      Object.keys(errors)
        .map(key => errors[key])
        .filter(Boolean)

    const thankYou = <ThankYou />
    return (
      <Frame meta={meta}>
        <Questionnaire
          {...this.props}
          externalSubmit
          hideCount
          questionnaireName={slug}
          pageClosed={thankYou}
          error={serverError}
          updating={updating}
          submitting={submitting}
        />
        {!submitted && (
          <div style={{ marginTop: 50 }}>
            <Loader
              loading={loading || !me}
              error={serverError}
              render={() => {
                const meFields = fields(t)

                return (
                  <div>
                    <H2 style={{ marginBottom: 30 }}>
                      Please confirm your address on Earth:
                    </H2>
                    <P style={{ margin: '-15px 0 20px' }}>
                      {"We won't contact you unless it's really important."}
                    </P>
                    {!isEditing ? (
                      <div>
                        {!!me.phoneNumber && (
                          <>
                            <P>
                              <Label>{t('Account/Update/phone/label')}</Label>
                              <br />
                            </P>
                            <P>
                              {me.phoneNumber}
                              <br />
                            </P>
                          </>
                        )}
                        {!!me.address && (
                          <>
                            <P>
                              <Label>{t('Account/Update/address/label')}</Label>
                              <br />
                            </P>
                            <P>
                              {intersperse(
                                [
                                  me.address.name,
                                  me.address.line1,
                                  me.address.line2,
                                  `${me.address.postalCode} ${me.address.city}`,
                                  me.address.country
                                ].filter(Boolean),
                                (_, i) => (
                                  <br key={i} />
                                )
                              )}
                            </P>
                          </>
                        )}
                        <br />
                        <A
                          href='#'
                          onClick={e => {
                            e.preventDefault()
                            this.startEditing()
                          }}
                        >
                          {t('Account/Update/edit')}
                        </A>
                      </div>
                    ) : (
                      <div>
                        <br />
                        <FieldSet
                          values={values}
                          errors={errors}
                          dirty={dirty}
                          onChange={fields =>
                            this.setState(FieldSet.utils.mergeFields(fields))
                          }
                          fields={meFields}
                        />
                        <br />
                        <br />
                        <br />
                        <AddressForm
                          values={values}
                          errors={errors}
                          dirty={dirty}
                          onChange={fields =>
                            this.setState(FieldSet.utils.mergeFields(fields))
                          }
                        />
                        <br />
                        <br />
                        <br />
                        {!updating && (
                          <div>
                            {!!this.state.showErrors &&
                              errorMessages.length > 0 && (
                                <div
                                  style={{
                                    color: colors.error,
                                    marginBottom: 40
                                  }}
                                >
                                  {t('pledge/submit/error/title')}
                                  <br />
                                  <ul>
                                    {errorMessages.map((error, i) => (
                                      <li key={i}>{error}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            {!!this.state.error && (
                              <div
                                style={{
                                  color: colors.error,
                                  marginBottom: 40
                                }}
                              >
                                {this.state.error}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              }}
            />
            <QuestionnaireActions
              onSubmit={() => {
                this.submit(errorMessages)
              }}
              updating={updating}
              submitting={submitting}
            />
          </div>
        )}
      </Frame>
    )
  }
}

export default compose(
  withT,
  withRouter,
  withQuestionnaire,
  withMyDetails,
  withMutation,
  enforceMembership(meta, { title: t('questionnaire/title'), description })
)(QuestionnaireCrowdPage)

import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'

import { CDN_FRONTEND_BASE_URL } from '../lib/constants'
import withT, { t } from '../lib/withT'

import { enforceMembership } from '../components/Auth/withMembership'
import {
  withQuestionnaire,
  withQuestionnaireMutation
} from '../components/Questionnaire/enhancers'
import { description } from './questionnaire'
import { withRouter } from 'next/router'
import QuestionnaireActions from '../components/Questionnaire/QuestionnaireActions'
import Frame from '../components/Frame'
import Questionnaire from '../components/Questionnaire/Questionnaire'
import { query, withMyDetails } from '../components/Account/enhancers'
import { errorToString } from '../lib/utils/errors'
import { COUNTRIES } from '../components/Account/AddressForm'
import FieldSet from '../components/FieldSet'
import gql from 'graphql-tag'
import DetailsForm from '../components/Account/DetailsForm'
import { Interaction, RawHtml, colors } from '@project-r/styleguide'
import { css } from 'glamor'
import MdArrow from 'react-icons/lib/md/trending-flat'

const { Headline, P } = Interaction

const mutation = gql`
  mutation submitQuestionnaireAndUpdateMe(
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

const DEFAULT_COUNTRY = COUNTRIES[0]

const styles = {
  intro: css({
    margin: '35px 0 70px'
  }),
  arrow: css({
    marginRight: 15,
    minWidth: 16,
    color: colors.lightText
  }),
  thankYouItem: css({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'left',
    alignItems: 'center',
    marginBottom: 20
  })
}

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

const ThankYouItem = compose(withT)(({ t, tKey }) => {
  return (
    <div {...styles.thankYouItem}>
      <MdArrow {...styles.arrow} />
      <RawHtml
        type={P}
        dangerouslySetInnerHTML={{
          __html: t(tKey)
        }}
      />
    </div>
  )
})

const ThankYou = compose(withT)(({ t }) => {
  return (
    <div>
      <Headline>{t('questionnaire/crowd/submitted/title')}</Headline>
      <div>
        <div {...styles.intro}>
          <RawHtml
            type={P}
            dangerouslySetInnerHTML={{
              __html: t('questionnaire/crowd/submitted/intro')
            }}
          />
        </div>
        <ThankYouItem tKey='questionnaire/crowd/submitted/list/1' />
        <ThankYouItem tKey='questionnaire/crowd/submitted/list/2' />
        <ThankYouItem tKey='questionnaire/crowd/submitted/list/3' />
      </div>
    </div>
  )
})

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

  onDetailsEdit() {
    this.setState(state => ({
      isEditing: true,
      values: {
        ...state.values,
        ...getValues(this.props.detailsData.me)
      }
    }))
  }

  onDetailsChange(fields) {
    this.setState(FieldSet.utils.mergeFields(fields))
  }

  processErrors(errorMessages) {
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
      return true
    }
  }

  processSubmit() {
    const {
      detailsData: { me },
      submitForm,
      submitQuestionnaire,
      questionnaireData: {
        questionnaire: { id }
      }
    } = this.props

    const { values, isEditing } = this.state

    return isEditing
      ? submitForm({ ...getMutation(values, me), questionnaireId: id })
      : submitQuestionnaire(id)
  }

  submit(errorMessages) {
    const hasErrors = this.processErrors(errorMessages)
    if (hasErrors) return

    this.setState({ updating: true })
    this.processSubmit()
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
      .then(() => window.scrollTo(0, 0))
  }

  render() {
    const { detailsData, questionnaireData, router } = this.props
    const {
      serverError,
      updating,
      submitting,
      values,
      dirty,
      errors,
      showErrors,
      isEditing
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
            <DetailsForm
              data={detailsData}
              values={values}
              errors={errors}
              dirty={dirty}
              onDetailsEdit={() => this.onDetailsEdit()}
              onChange={fields => this.onDetailsChange(fields)}
              isEditing={isEditing}
              errorMessages={errorMessages}
              showErrors={!updating && !!showErrors}
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
  withRouter,
  withQuestionnaire,
  withMyDetails,
  withMutation,
  withQuestionnaireMutation,
  enforceMembership(meta, { title: t('questionnaire/title'), description })
)(QuestionnaireCrowdPage)

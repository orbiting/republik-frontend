import React, { Component } from 'react'
import { compose } from 'react-apollo'

import { CDN_FRONTEND_BASE_URL } from '../lib/constants'
import { t } from '../lib/withT'

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
import UpdateMe from '../components/Account/UpdateMe'

const meta = {
  title: 'Make me a star',
  description: t('questionnaire/description'),
  facebookTitle: t('pages/meta/questionnaire/socialTitle'),
  facebookDescription: t('pages/meta/questionnaire/socialDescription'),
  twitterTitle: t('pages/meta/questionnaire/socialTitle'),
  twitterDescription: t('pages/meta/questionnaire/socialDescription'),
  facebookImage: `${CDN_FRONTEND_BASE_URL}/static/social-media/umfrage/2018/facebookImage.png`,
  twitterImage: `${CDN_FRONTEND_BASE_URL}/static/social-media/umfrage/2018/twitterImage.png`
}

const ThankYou = () => {
  return <div>Vielen Dank for helping</div>
}

class QuestionnaireCrowdPage extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  processSubmit = (fn, ...args) => {
    this.setState({ updating: true })
    return fn(...args)
      .then(() =>
        this.setState(() => ({
          updating: false,
          error: null
        }))
      )
      .catch(error => {
        this.setState(() => ({
          updating: false,
          submitting: false,
          error
        }))
      })
  }

  handleSubmit = e => {
    this.setState({ submitting: true })
    const {
      submitQuestionnaire,
      data: {
        questionnaire: { id }
      }
    } = this.props
    e.preventDefault()
    this.processSubmit(submitQuestionnaire, id).then(() =>
      this.setState({ submitting: false })
    )
  }

  render() {
    const { error, updating, submitting } = this.state
    const slug = this.props.router.query.slug
    const thankYou = <ThankYou />
    return (
      <Frame meta={meta}>
        <Questionnaire
          {...this.props}
          externalSubmit
          hideCount
          questionnaireName={slug}
          pageClosed={thankYou}
          error={error}
          updating={updating}
          submitting={submitting}
        />
        <div style={{ marginTop: 50 }}>
          <UpdateMe
            {...this.props}
            externalSubmit
            headline={'Please confirm your address on Earth:'}
            subHead={"We won't contact you unless it's really important."}
          />
        </div>
        <QuestionnaireActions
          onSubmit={this.handleSubmit}
          updating={updating}
          submitting={submitting}
        />
      </Frame>
    )
  }
}

export default compose(
  withRouter,
  withQuestionnaire,
  withQuestionnaireMutation,
  enforceMembership(meta, { title: t('questionnaire/title'), description })
)(QuestionnaireCrowdPage)

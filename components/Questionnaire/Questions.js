import React from 'react'

import { compose } from 'react-apollo'

import TextQuestion from './TextQuestion'
import ArticleQuestion from './ArticleQuestion'
import RangeQuestion from './RangeQuestion'
import ChoiceQuestion from './ChoiceQuestion'
import { withAnswerMutation } from './enhancers'
import { withRouter } from 'next/router'

const QUESTION_TYPES = {
  QuestionTypeDocument: ArticleQuestion,
  QuestionTypeText: TextQuestion,
  QuestionTypeChoice: ChoiceQuestion,
  QuestionTypeRange: RangeQuestion
}

export default compose(
  withRouter,
  withAnswerMutation
)(({ router, submitAnswer, processSubmit, questions, disabled }) => {
  const createHandleChange = questionId => (answerId, value) => {
    const payload = value !== null ? { value } : null
    processSubmit(submitAnswer, questionId, payload, answerId)
  }

  return (
    <>
      {questions.map(q =>
        React.createElement(QUESTION_TYPES[q.__typename], {
          onChange: createHandleChange(q.id),
          question: q,
          key: q.id,
          disabled
        })
      )}
    </>
  )
})

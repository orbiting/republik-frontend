import { QuestionnaireElement } from '../../custom-types'

export const questionnaire: QuestionnaireElement = {
  type: 'questionnaire',
  children: [
    {
      type: 'questionnaireParagraph',
      children: [{ text: 'Frage' }]
    },
    {
      type: 'questionnaireChoice',
      children: [{ text: '' }]
    }
  ]
}

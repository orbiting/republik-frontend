import { QuestionnaireElement } from '../custom-types'
import { emptyElement } from './text'

export const questionnaire: QuestionnaireElement = {
  type: 'questionnaire',
  children: [
    {
      type: 'questionnaireParagraph',
      children: [{ text: 'Frage' }]
    },
    {
      type: 'questionnaireChoice',
      ...emptyElement
    }
  ]
}

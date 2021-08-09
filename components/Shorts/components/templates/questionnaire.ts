import { QuestionnaireElement } from '../custom-types'
import { emptyElement } from './text'

export const questionnaire: QuestionnaireElement = {
  type: 'questionnaire',
  children: [
    {
      type: 'questionnaireParagraph',
      children: [{ text: 'Frage hier fragen' }]
    },
    {
      type: 'questionnaireChoice',
      ...emptyElement
    }
  ]
}

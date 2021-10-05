import { EditorAttr, ElementsConfig } from '../../custom-types'
import { config as link } from './link'
import { config as paragraph } from './paragraph'
import { config as headline } from './headline'
import { config as breakConfig } from './break'
import { config as figure } from './figure/container'
import { config as figureImage } from './figure/image'
import { config as figureCaption } from './figure/caption'
import { config as figureByline } from './figure/byline'
import { config as pullQuote } from './pullQuote/container'
import { config as pullQuoteText } from './pullQuote/text'
import { config as pullQuoteSource } from './pullQuote/source'
import { config as chartContainer } from './chart/container'
import { config as chart } from './chart/chart'
import { config as chartTitle } from './chart/title'
import { config as chartLead } from './chart/lead'
import { config as chartLegend } from './chart/legend'
import { config as questionnaire } from './questionnaire/container'
import { config as questionnaireParagraph } from './questionnaire/paragraph'
import { config as questionnaireChoice } from './questionnaire/choice'
import { config as linkPreview } from './linkPreview'

export const config: ElementsConfig = {
  paragraph,
  headline,
  link,
  figure,
  figureImage,
  figureCaption,
  figureByline,
  pullQuote,
  pullQuoteText,
  pullQuoteSource,
  chartContainer,
  chart,
  chartTitle,
  chartLead,
  chartLegend,
  questionnaire,
  questionnaireParagraph,
  questionnaireChoice,
  linkPreview,
  break: breakConfig
}

// typesafe helper
export const configKeys: (keyof ElementsConfig)[] = Object.keys(
  config
) as (keyof ElementsConfig)[]

export const coreEditorAttrs: EditorAttr[] = ['isVoid', 'isInline']

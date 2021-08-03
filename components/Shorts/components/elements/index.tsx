import { ElementsConfig, EditorAttr } from '../custom-types'
import { config as link } from './link'
import { config as paragraph } from './paragraph'
import { config as headline } from './headline'
import { config as breakConfig } from './break'
import { config as figure } from './figure'
import { config as figureImage } from './figureImage'
import { config as figureCaption } from './figureCaption'
import { config as figureByline } from './figureByline'
import { config as quote } from './quote'
import { config as quoteParagraph } from './quoteParagraph'
import { config as chartBlock } from './chart/block'
import { config as chart } from './chart/chart'
import { config as chartTitle } from './chart/title'
import { config as chartLead } from './chart/lead'
import { config as chartLegend } from './chart/legend'

export const config: ElementsConfig = {
  paragraph,
  headline,
  link,
  figure,
  figureImage,
  figureCaption,
  figureByline,
  quote,
  quoteParagraph,
  chartBlock,
  chart,
  chartTitle,
  chartLead,
  chartLegend,
  break: breakConfig
}

// typesafe helper
export const configKeys: (keyof ElementsConfig)[] = Object.keys(
  config
) as (keyof ElementsConfig)[]

export const editorAttrsKey: EditorAttr[] = ['isVoid', 'isInline']

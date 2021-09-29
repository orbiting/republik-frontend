import React from 'react'
import { IconType } from '@react-icons/all-files/lib'
import { BaseEditor, Path } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

type CustomMarks = {
  italic?: boolean
  bold?: boolean
  sub?: boolean
  sup?: boolean
}

export type CustomMarksType = keyof CustomMarks

type PlainText = {
  text: string
  placeholder?: string
}

export type CustomText = CustomMarks & PlainText

type SharedElement = {
  placeholder?: string
  children: (CustomElement | CustomText)[]
}

export type ParagraphElement = SharedElement & {
  type: 'paragraph'
}

export type HeadlineElement = SharedElement & {
  type: 'headline'
}

export type BreakElement = SharedElement & {
  type: 'break'
}

export type LinkElement = SharedElement & {
  type: 'link'
  href?: string
}

export type FigureElement = SharedElement & {
  type: 'figure'
}

export type FigureImageElement = SharedElement & {
  type: 'figureImage'
  src?: string
}

export type FigureCaptionElement = SharedElement & {
  type: 'figureCaption'
}

export type PullQuoteElement = SharedElement & {
  type: 'pullQuote'
}

export type PullQuoteTextElement = SharedElement & {
  type: 'pullQuoteText'
}

export type PullQuoteSourceElement = SharedElement & {
  type: 'pullQuoteSource'
}

export type ChartContainerElement = SharedElement & {
  type: 'chartContainer'
}

export type ChartTitleElement = SharedElement & {
  type: 'chartTitle'
}

export type ChartLeadElement = SharedElement & {
  type: 'chartLead'
}

export type ChartElement = SharedElement & {
  type: 'chart'
  values?: object[]
  config?: object
}

export type ChartLegendElement = SharedElement & {
  type: 'chartLegend'
}

export type QuestionnaireElement = SharedElement & {
  type: 'questionnaire'
}

export type QuestionnaireParagraphElement = SharedElement & {
  type: 'questionnaireParagraph'
}

export type QuestionnaireChoiceElement = SharedElement & {
  type: 'questionnaireChoice'
}

export type LinkPreviewElement = SharedElement & {
  type: 'linkPreview'
  src?: string
}

export type CustomElement =
  | HeadlineElement
  | ParagraphElement
  | BreakElement
  | LinkElement
  | FigureElement
  | FigureImageElement
  | FigureCaptionElement
  | PullQuoteElement
  | PullQuoteTextElement
  | PullQuoteSourceElement
  | ChartContainerElement
  | ChartElement
  | ChartTitleElement
  | ChartLeadElement
  | ChartLegendElement
  | QuestionnaireElement
  | QuestionnaireParagraphElement
  | QuestionnaireChoiceElement
  | LinkPreviewElement

// TODO: infer this from CustomElement (see above)
export type CustomElementsType =
  | 'headline'
  | 'paragraph'
  | 'break'
  | 'link'
  | 'figure'
  | 'figureImage'
  | 'figureCaption'
  | 'pullQuote'
  | 'pullQuoteText'
  | 'pullQuoteSource'
  | 'chartContainer'
  | 'chart'
  | 'chartTitle'
  | 'chartLead'
  | 'chartLegend'
  | 'questionnaire'
  | 'questionnaireParagraph'
  | 'questionnaireChoice'
  | 'linkPreview'

interface ButtonI {
  icon: IconType
  small?: boolean
}

interface EditorAttrsI {
  isVoid?: boolean
  isInline?: boolean
}

interface ElementAttrsI extends EditorAttrsI {
  editUi?: boolean | React.FC
  formatText?: boolean
  disableBreaks?: boolean
}

export type EditorAttr = keyof EditorAttrsI

export type InsertFn = (editor: CustomEditor) => void

export type NormalizeFn<E> = (entry: [E, Path], editor: CustomEditor) => void

export interface NodeConfigI {
  Component: any
  button?: ButtonI
}

export type MarksConfig = {
  [K in CustomMarksType]: NodeConfigI
}

export type DataFormType<E> = React.FC<{
  element: E
  setElement: (el: E) => void
}>

export type needsDataFn<E> = (el: E) => boolean

export type ElementStructureT = {
  type: CustomElementsType
  repeat?: boolean
}

export interface ElementConfigI extends NodeConfigI {
  insert?: InsertFn
  attrs?: ElementAttrsI
  node?: CustomElement
  DataForm?: DataFormType
  needsData?: needsDataFn
  normalizations?: NormalizeFn[]
  placeholder?: string
  structure?: ElementStructureT[]
}

export type ElementsConfig = {
  [K in CustomElementsType]: ElementConfigI
}

export interface TemplateButtonI {
  icon: IconType
  label: string
  customElement?: CustomElementsType
}

export interface DraftI {
  title: string
  id: string
  value: CustomElement[]
}

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}

declare module '@project-r/styleguide'

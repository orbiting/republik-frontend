import React from 'react'
import { IconType } from '@react-icons/all-files/lib'
import { BaseEditor, Path, Descendant } from 'slate'
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
}

export type ParagraphElement = SharedElement & {
  type: 'paragraph'
  children: Descendant[]
}

export type HeadlineElement = SharedElement & {
  type: 'headline'
  children: PlainText[]
}

export type BreakElement = SharedElement & {
  type: 'break'
  children: PlainText[]
}

export type LinkElement = SharedElement & {
  type: 'link'
  href: string
  children: CustomText[]
}

export type FigureElement = SharedElement & {
  type: 'figure'
  children: (FigureImageElement | FigureCaptionElement)[]
}

export type FigureImageElement = SharedElement & {
  type: 'figureImage'
  src: string
  children: PlainText[]
}

export type FigureCaptionElement = SharedElement & {
  type: 'figureCaption'
  children: (LinkElement | CustomText)[]
}

export type QuoteElement = SharedElement & {
  type: 'quote'
  children: (QuoteParagraphElement | FigureCaptionElement)[]
}

export type QuoteParagraphElement = SharedElement & {
  type: 'quoteParagraph'
  children: CustomText[]
}

export type ChartBlockElement = SharedElement & {
  type: 'chartBlock'
  children: (
    | ChartTitleElement
    | ChartLeadElement
    | ChartElement
    | ChartLegendElement
  )[]
}

export type ChartTitleElement = SharedElement & {
  type: 'chartTitle'
  children: CustomText[]
}

export type ChartLeadElement = SharedElement & {
  type: 'chartLead'
  children: CustomText[]
}

export type ChartElement = SharedElement & {
  type: 'chart'
  values: object[]
  config: object
  children: PlainText[]
}

export type ChartLegendElement = SharedElement & {
  type: 'chartLegend'
  children: (CustomText | LinkElement)[]
}

export type QuestionnaireElement = SharedElement & {
  type: 'questionnaire'
  children: (QuestionnaireParagraphElement | QuestionnaireChoiceElement)[]
}

export type QuestionnaireParagraphElement = SharedElement & {
  type: 'questionnaireParagraph'
  children: (CustomText | LinkElement)[]
}

export type QuestionnaireChoiceElement = SharedElement & {
  type: 'questionnaireChoice'
  children: PlainText[]
}

export type LinkPreviewElement = SharedElement & {
  type: 'linkPreview'
  path: string
  children: PlainText[]
}

export type CustomElement =
  | HeadlineElement
  | ParagraphElement
  | BreakElement
  | LinkElement
  | FigureElement
  | FigureImageElement
  | FigureCaptionElement
  | QuoteElement
  | QuoteParagraphElement
  | ChartBlockElement
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
  | 'quote'
  | 'quoteParagraph'
  | 'chartBlock'
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

export interface ElementConfigI extends NodeConfigI {
  insert?: InsertFn
  attrs?: ElementAttrsI
  node?: CustomElement
  normalizations?: NormalizeFn[]
  placeholder?: string
}

export type ElementsConfig = {
  [K in CustomElementsType]: ElementConfigI
}

export interface TemplateButtonI {
  icon: IconType
  label: string
  tree: CustomElement[]
}

export interface DraftI {
  key: string
  date: string
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

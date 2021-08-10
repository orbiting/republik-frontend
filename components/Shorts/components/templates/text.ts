import { CustomElement, CustomText } from '../custom-types'

export const emptyText: CustomText = { text: '' }

export const emptyElement = {
  children: [emptyText]
}

export const textTree = (title?: string): CustomElement[] => [
  {
    type: 'headline',
    children: [{ text: title || 'Titel' }]
  },
  {
    type: 'paragraph',
    children: [{ text: 'Text' }]
  }
]

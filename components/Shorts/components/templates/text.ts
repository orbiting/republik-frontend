import { CustomElement, CustomText } from '../custom-types'

export const emptyText: CustomText = { text: '' }

export const emptyElement = {
  children: [emptyText]
}

export const textTree = (title?: string): CustomElement[] => [
  {
    type: 'headline',
    children: [{ text: title || 'Untitled' }]
  },
  {
    type: 'paragraph',
    children: [{ text: 'In the beginning there was nothing, which exploded.' }]
  }
]

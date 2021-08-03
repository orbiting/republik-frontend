import { CustomElement, CustomText } from '../custom-types'

export const emptyText: CustomText = { text: '' }

export const emptyElement = {
  children: [emptyText]
}

export const textTree: CustomElement[] = [
  {
    type: 'headline',
    children: [{ text: 'Untitled' }]
  },
  {
    type: 'paragraph',
    children: [{ text: 'In the beginning there was nothing, which exploded.' }]
  }
]

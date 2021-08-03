import { NodeConfigI } from '../custom-types'
// @ts-ignore
import { Editorial } from '@project-r/styleguide'
import { MdFormatItalic } from '@react-icons/all-files/md/MdFormatItalic'

export const config: NodeConfigI = {
  Component: Editorial.Cursive,
  button: { icon: MdFormatItalic }
}

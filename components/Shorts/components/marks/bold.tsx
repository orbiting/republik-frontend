import { NodeConfigI } from '../custom-types'
// @ts-ignore
import { Editorial } from '@project-r/styleguide'
import { MdFormatBold } from '@react-icons/all-files/md/MdFormatBold'

export const config: NodeConfigI = {
  Component: Editorial.Emphasis,
  button: { icon: MdFormatBold }
}

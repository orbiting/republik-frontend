import { NodeConfigI } from '../../custom-types'
import { Sup } from '@project-r/styleguide'
import { FaSuperscript } from '@react-icons/all-files/fa/FaSuperscript'

export const config: NodeConfigI = {
  Component: Sup,
  button: { icon: FaSuperscript, small: true, toolbar: 'hovering' }
}

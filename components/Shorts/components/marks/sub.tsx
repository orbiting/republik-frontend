import { NodeConfigI } from '../../custom-types'
import { Sub } from '@project-r/styleguide'
import { FaSubscript } from '@react-icons/all-files/fa/FaSubscript'

export const config: NodeConfigI = {
  Component: Sub,
  button: { icon: FaSubscript, small: true, toolbar: 'hovering' }
}

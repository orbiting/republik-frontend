import React from 'react'
import { createFormatter } from '@project-r/styleguide'

export const vt = createFormatter(require('./translations-genossenschaft.json').data)

export default (Component) => (props) => (
  <Component {...props} vt={vt} />
)

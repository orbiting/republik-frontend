import React from 'react'
import { createFormatter } from '@project-r/styleguide'
import translations from './translations.json'

export const t = createFormatter(translations.data)
export type TranslationType = {
  t: (s: string) => string
}
const withT = Component => props => <Component {...props} t={t} />

export default withT

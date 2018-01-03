import React from 'react'

import {
  colors
} from '@project-r/styleguide'

const Icon = ({width, fill}) => (
  <svg width={12} height={16} viewBox='0 0 12 16'>
    <path d='M6 12c.828 0 1.5-.672 1.5-1.5C7.5 9.668 6.825 9 6 9c-.828 0-1.5.672-1.5 1.5S5.172 12 6 12zm4.5-6.75c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-9c-.828 0-1.5-.672-1.5-1.5v-7.5c0-.832.675-1.5 1.5-1.5h.75v-1.5C2.25 1.68 3.93 0 6 0c.995 0 1.948.395 2.652 1.098.703.704 1.098 1.657 1.098 2.652v1.5h.75zM6 1.5c-1.243 0-2.25 1.007-2.25 2.25v1.5h4.5v-1.5C8.25 2.507 7.243 1.5 6 1.5z' fill={fill} />
  </svg>
)

Icon.defaultProps = {
  fill: colors.primary
}

export default Icon

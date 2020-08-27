import React from 'react'

export default ({ size = 24, fill }) => (
  <svg width={size} height={size} viewBox='0 0 24 24'>
    <path d='M0 0h24v24H0V0zm0 0h24v24H0V0z' fill='none' />
    <path d='M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8z' fill={fill} />
  </svg>
)

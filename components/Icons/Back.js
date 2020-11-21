import React from 'react'

const Icon = ({ size = 24, style, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    style={{ verticalAlign: 'middle', ...style }}
    fill='currentColor'
    {...props}
  >
    <path d='M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z' />
    <path fill='none' d='M0 0h24v24H0z' />
  </svg>
)

export default Icon

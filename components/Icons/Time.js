import React from 'react'

const Icon = ({ size, fill }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 20 20'
    style={{ verticalAlign: 'middle' }}
  >
    <path
      fill={fill}
      d='M9,0 C4,0 0,4 0,9 C0,14 4,18 9,18 C14,18 18,14 18,9 C18,4 14,0 9,0 Z M9,16 C5.1,16 1.9,12.8 2,8.9 C2.1,5.2 5.2,2.1 8.9,2 C12.8,1.9 16,5.1 16,9 C16,12.9 12.9,16 9,16 Z'
    />
    <rect fill={fill} x='8' y='4' width='2' height='6' />
    <rect fill={fill} x='8' y='8' width='4' height='2' />
  </svg>
)

export default Icon
